const express = require('express');
const { userAuth } = require('../Middlewares/auth');
const RazorpayInstance = require('../utils/razorpay');
const paymentRouter = express.Router();
const User = require('../model/user');
const PaymentModel = require('../model/payment');
const { membershipAmount } = require('../utils/constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

paymentRouter.post("/payment/create", userAuth, async (req, res) => {

    try {

        const { membershipType } = req.body;
        const { firstName, lastName, email } = req.user;

        const order = await RazorpayInstance.orders.create({
            amount: membershipAmount[membershipType] * 100,
            currency: 'INR',
            receipt: 'order_rcptid_1',
            notes: {
                firstName,
                lastName,
                email,
                membershipType: membershipType,
            }

        });

        const payment = new PaymentModel({
            userId: req.user._id,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        })

        const paymentStatus = await payment.save();

        res.json({ ...paymentStatus.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

});

paymentRouter.post("/payment/webhook", async (req, res) => {

    try {

        const webhookSignature = req.headers('X-Razorpay-Signature');

        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET);

        if (!isWebhookValid) {
            return res.status(400).json({ message: "Invalid Webhook Signature" });
        }

        // Get the payment details from the webhook payload.
        const paymentDetails = req.body.payload.payment.entity

        // Update the payment status in your database.
        const payment = await PaymentModel.findOne({ orderId: paymentDetails.id });
        payment.status = paymentDetails.status;
        await payment.save();

        //update the subscription status in your database.
        const user = await User.findOne({ _id: payment.userId });
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;

        await user.save();

        return res.status(200).json({ message: "Webhook Received Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

})

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (user.isPremium) {
            return res.json({ ...user })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})


module.exports = { paymentRouter };