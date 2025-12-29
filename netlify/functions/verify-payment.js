// netlify/functions/verify-payment.js
const crypto = require("crypto");

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body);
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Razorpay Signature Verification Logic
    // Construct the string: order_id + "|" + payment_id
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "success", message: "Payment Verified" }),
      };
    } else {
      console.error("Signature Mismatch: Potential Fraud Attempt");
      return { statusCode: 400, body: JSON.stringify({ status: "failure", message: "Invalid Signature" }) };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};