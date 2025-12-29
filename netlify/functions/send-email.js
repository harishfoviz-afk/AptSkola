// netlify/functions/send-email.js

export const handler = async (event) => {
  // 1. Security Check: Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // 2. Environment Check
  if (!process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY is missing in Netlify Environment Variables");
      return { statusCode: 500, body: "Server Misconfiguration: Missing API Key" };
  }

  try {
    // 3. Parse the incoming data
    const { userEmail, userName, pdfBase64, orderId, childName } = JSON.parse(event.body);

    if (!userEmail || !pdfBase64) {
      console.error("Missing email or PDF data");
      return { statusCode: 400, body: "Missing required fields" };
    }

    // 4. CLEAN THE PDF & SIZE CHECK (CORE LOGIC PRESERVED)
    // Remove the data URI prefix if present
    const cleanBase64 = pdfBase64.replace(/^data:.+;base64,/, '');
    
    // Calculate approximate size in MB (Base64 string length * 0.75 / 1024 / 1024)
    const sizeInMB = (cleanBase64.length * 0.75) / (1024 * 1024);
    
    // Brevo Limit is ~10MB, Netlify Limit is ~6MB for request/response bodies.
    // If it's over 9MB, we skip the attachment to prevent a crash.
    let attachments = [];
    if (sizeInMB < 9) {
        attachments = [{
          content: cleanBase64,
          name: "AptSkola-Admissions-Toolkit.pdf",
          type: "application/pdf"
        }];
    } else {
        console.warn(`PDF too large (${sizeInMB.toFixed(2)} MB). Sending email without attachment.`);
    }
    
    const url = "https://api.brevo.com/v3/smtp/email";
    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    };

    // ==========================================
    // EMAIL 1: Instant PDF Delivery (From connect@)
    // ==========================================
    const pdfEmailPayload = {
      sender: { email: "connect@aptskola.com", name: "Apt Skola Support" },
      to: [{ email: userEmail, name: userName || "Parent" }],
      bcc: [{ email: "reports.aptskola@gmail.com" }],
      subject: `Your Report is Ready: ${childName || "Your Child"}'s 15-Year Roadmap 🚀`,
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <p>Hi ${userName || "Parent"},</p>
            <p>Your Apt Skola Best Board Match report is attached. This diagnostic replaces weeks of research with the scientific "Why" behind the best board for ${childName || "your child"}.</p>
            
            <h3>What’s Next?</h3>
            <ul>
              <li><strong>Parent & Child Sync Match:</strong> Use your Order ID: <strong>${orderId || "Pending"}</strong> to unlock our advanced behavioral module and ensure your parenting vision aligns with your child’s natural instincts.</li>
              <li><strong>School X-Ray (Forensic Audit):</strong> Don't trust glossy brochures; run a forensic scan on your shortlisted schools to spot "Library Props" and get a real 15-year fee forecast.</li>
              <li><strong>Secure the Future (Foviz.in):</strong> Map ${childName || "your child"}'s unique personality to 250+ specific career paths with our 5D analysis to ensure today’s schooling leads to tomorrow’s success.</li>
            </ul>
            
            <p><a href="https://aptskola.com" style="background-color: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Access Your Full Roadmap Dashboard Here</a></p>
            
            <p>Did our science bring you peace of mind? Help other families find clarity by leaving a 30-second review on our <a href="https://share.google/UuN7aZvgVcdaeD0ng">Verified Google Profile</a>.</p>
            
            <p>To a future made by design, not by accident.</p>
            <p><strong>Apt Skola Team</strong></p>
          </body>
        </html>
      `,
      attachment: attachments,
    };

    // Send the First Email
    const pdfResponse = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(pdfEmailPayload),
    });

    if (!pdfResponse.ok) {
      const errorData = await pdfResponse.json();
      console.error("Brevo PDF Email Failed:", JSON.stringify(errorData));
      return { statusCode: 200, body: JSON.stringify({ warning: "Email failed", detail: errorData }) };
    }

    // ==========================================
    // EMAIL 2: Scheduled Feedback (72 Hours Later - From Harish)
    // ==========================================
    try {
        const scheduledTime = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
        const feedbackEmailPayload = {
          sender: { email: "harish@aptskola.com", name: "Harish from AptSkola" }, 
          to: [{ email: userEmail, name: userName || "Parent" }],
          subject: `Phase 1 Done: What’s next for ${childName || "your child"}? 🚀`,
          htmlContent: `
            <html>
              <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <p>Hi ${userName || "Parent"},</p>
                <p>Three days ago, you decoded ${childName || "your child"}’s Learning DNA. Now that you have the Board Match, let's lock in the rest of the 15-year roadmap:</p>
                
                <p><strong>1. The School X-Ray (Institutional Audit) 🔎</strong><br>
                Don't trust the brochures. Use your Order ID: <strong>${orderId || "Pending"}</strong> to audit your shortlisted schools. Spot "Library Props" and get a real 15-year fee forecast before you sign.<br>
                👉 <a href="https://aptskola.com/xray">Run Forensic Scan</a></p>
                
                <p><strong>2. The Career GPS (Foviz.in) 🎯</strong><br>
                Ensure today’s board choice leads to tomorrow’s dream career. Map their personality to 250+ specific paths with our 5D analysis (Foviz.In).<br>
                👉 <a href="https://foviz.in">View Career Roadmap</a></p>
                
                <p><strong>3. Help Other Parents 💬</strong><br>
                Did our science bring you peace of mind? Share a quick review on our Verified Google Profile to help other families find clarity.<br>
                ⭐ <a href="https://share.google/UuN7aZvgVcdaeD0ng">Leave a 30-Sec Review</a></p>
                
                <br>
                <p>To a future made by design, not by accident.</p>
                <p><strong>Harish | Foviz Skola</strong></p>
              </body>
            </html>
          `,
          scheduledAt: scheduledTime, 
        };

        await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(feedbackEmailPayload),
        });
        console.log("Feedback email scheduled successfully.");
    } catch (schedErr) {
        console.warn("Scheduling Error (Non-Critical):", schedErr);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Emails processed successfully" }),
    };

  } catch (error) {
    console.error("Critical Function Error:", error);
    return { statusCode: 500, body: error.toString() };
  }
};