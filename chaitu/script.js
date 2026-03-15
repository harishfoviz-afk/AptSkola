document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // Toggle answer
            answer.classList.toggle('open');
            
            // Toggle icon
            if(answer.classList.contains('open')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });

    // Form Submission & Payment Unified Flow
    const form = document.getElementById('enrollmentForm');
    const successSection = document.getElementById('successSection');
    
    // NOTE: Exact entry ID from Google Forms for "Payment Made" field
    const PAYMENT_ENTRY_ID = "entry.601609998"; 

    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitFormBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing Payment securely...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            
            // Build the core Google Form submission payload
            const googleFormData = new URLSearchParams();
            googleFormData.append("entry.106579225", object.childName);
            googleFormData.append("entry.361134983", object.grade);
            googleFormData.append("entry.659775470", object.parentName);
            googleFormData.append("entry.597202577", object.phone);
            googleFormData.append("entry.1740304574", object.email);
            googleFormData.append("entry.84335970", object.timeSlot);
            googleFormData.append("entry.84485773", object.city);

            function submitToGoogleForms(paymentStatus) {
                // Clone the params to add the payment status
                const finalData = new URLSearchParams(googleFormData.toString());
                finalData.append(PAYMENT_ENTRY_ID, paymentStatus);

                return fetch("https://docs.google.com/forms/d/e/1FAIpQLScoa34XlY6WLDpQN0ZWPAXn28uhI2lHPK-6YFtT4BnNWfjTRg/formResponse", {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: finalData.toString()
                }).catch(err => console.error("Google Forms Sync Error:", err));
            }

            // Fire up Razorpay
            var options = {
                "key": "rzp_live_RxHmfgMlTRV3Su", 
                "amount": "9900", // 9900 subunits = ₹99
                "currency": "INR",
                "name": "AptSkola",
                "description": "Seat reservation for 21-Day Reading & Creativity Summer Camp",
                "image": "https://aptskola.com/favicon.ico",
                "handler": function (response) {
                    // Payment was successful
                    submitToGoogleForms("Yes - Paid");
                    form.classList.add('hidden');
                    successSection.classList.remove('hidden');
                },
                "modal": {
                    "ondismiss": function() {
                        // User closed the window, or existed without paying
                        // Submit "No" immediately so we don't lose the lead
                        submitToGoogleForms("No - Abandoned at Payment");
                        
                        // Restore button and UI
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        
                        alert("Payment was incomplete. We have preserved your details, but please click 'Book the Slot' again to finish your payment to reserve the seat!");
                    }
                },
                "prefill": {
                    "name": object.parentName,
                    "email": object.email,
                    "contact": object.phone
                },
                "theme": {
                    "color": "#FF9F1C"
                }
            };

            try {
                var rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response){
                    alert("Payment Failed. Reason: " + response.error.description);
                    // The ondismiss modal handler will fire when they close the alert window
                });
                rzp1.open();
            } catch (err) {
                alert("Payment Gateway Failed to Load: " + err.message);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
