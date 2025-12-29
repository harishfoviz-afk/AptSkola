// netlify/functions/verify-payment.js
const crypto = require("crypto");

export const handler = async (event) => {
  // 1. Security Check: Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body);
    
    // 2. Fetch Secret and Trim to remove accidental leading/trailing spaces
    const secret = process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim() : null;

    if (!secret) {
      console.error("CRITICAL ERROR: RAZORPAY_KEY_SECRET is missing in Netlify Env Variables.");
      return { 
        statusCode: 500, 
        body: JSON.stringify({ status: "error", message: "Server configuration error." }) 
      };
    }

    // 3. Construct the payload as per Razorpay documentation: order_id + "|" + payment_id
    const authPayload = razorpay_order_id + "|" + razorpay_payment_id;

    // 4. Generate Signature using HMAC SHA256
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(authPayload)
      .digest("hex");

    // 5. Comparison
    if (generated_signature === razorpay_signature) {
      console.log("✅ Payment Verified for Order:", razorpay_order_id);
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "success", message: "Payment Verified" }),
      };
    } else {
      // Log details to Netlify Function Logs for you to inspect
      console.error("❌ Signature Mismatch Details:");
      console.error("Payload Used:", authPayload);
      console.error("Expected Signature (from Razorpay):", razorpay_signature);
      console.error("Generated Signature (calculated):", generated_signature);
      
      return { 
        statusCode: 400, 
        body: JSON.stringify({ status: "failure", message: "Invalid Signature Match" }) 
      };
    }
  } catch (error) {
    console.error("Critical Function Error:", error);
    return { statusCode: 500, body: error.toString() };
  }
};
