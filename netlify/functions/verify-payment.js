// netlify/functions/create-order.js
const Razorpay = require('razorpay');

exports.handler = async (event) => {
    const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, internalOrderId } = JSON.parse(event.body);

    const options = {
        amount: amount, 
        currency: "INR",
        receipt: internalOrderId, // This is your AS1-XXX ID
    };

    try {
        const order = await rzp.orders.create(options);
        // This 'order' object contains the 'id' (order_XXXXX) needed for verification
        return { statusCode: 200, body: JSON.stringify(order) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }
};
