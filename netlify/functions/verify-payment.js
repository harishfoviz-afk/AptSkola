// netlify/functions/verify-payment.js
const crypto = require("crypto");

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body);
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
        console.error("CRITICAL: RAZORPAY_KEY_SECRET is missing in Netlify environment variables.");
        return { statusCode: 500, body: "Server Configuration Error" };
    }

    // STEP: Create the signature locally using the same logic as Razorpay
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("Payment Verified Successfully for Order:", razorpay_order_id);
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "success", message: "Payment Verified" }),
      };
    } else {
      // Log details for debugging mismatch
      console.error("Signature Mismatch for Order ID:", razorpay_order_id);
      return { 
        statusCode: 400, 
        body: JSON.stringify({ status: "failure", message: "Invalid Signature" }) 
      };
    }
  } catch (error) {
    console.error("Verification Function Error:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
