const crypto = require("crypto");

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // LOG FOR DEBUGGING: This will show up in your Netlify logs
    console.log("Attempting verification for Order:", razorpay_order_id);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return { 
            statusCode: 400, 
            body: JSON.stringify({ status: "error", message: "Missing required Razorpay IDs" }) 
        };
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return { statusCode: 200, body: JSON.stringify({ status: "success" }) };
    } else {
      // If this still happens, your SECRET KEY in Netlify is wrong
      console.error("SIGNATURE MISMATCH. Check your RAZORPAY_KEY_SECRET in Netlify.");
      return { statusCode: 400, body: JSON.stringify({ status: "failure" }) };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
