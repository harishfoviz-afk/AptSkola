// netlify/functions/create-order.js
const Razorpay = require('razorpay');

export const handler = async (event) => {
    const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, internalOrderId } = JSON.parse(event.body);

    const options = {
        amount: amount, // Amount in paise
        currency: "INR",
        receipt: internalOrderId,
    };

    try {
        const order = await rzp.orders.create(options);
        return { statusCode: 200, body: JSON.stringify(order) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }
};