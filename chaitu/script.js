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

    // Form Submission & Payment Flow Management
    const form = document.getElementById('enrollmentForm');
    const paymentSection = document.getElementById('paymentSection');
    const successSection = document.getElementById('successSection');
    const payBtn = document.getElementById('payBtn');
    
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitFormBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Google Forms Submit (Silent Sync)
            const googleFormData = new URLSearchParams();
            googleFormData.append("entry.106579225", object.childName);
            googleFormData.append("entry.361134983", object.grade);
            googleFormData.append("entry.659775470", object.parentName);
            googleFormData.append("entry.597202577", object.phone);
            googleFormData.append("entry.1740304574", object.email);
            googleFormData.append("entry.84335970", object.timeSlot);
            googleFormData.append("entry.84485773", object.city);

            fetch("https://docs.google.com/forms/d/e/1FAIpQLScoa34XlY6WLDpQN0ZWPAXn28uhI2lHPK-6YFtT4BnNWfjTRg/formResponse", {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: googleFormData.toString()
            })
            .then(() => {
                // Success - hide form, show payment
                form.classList.add('hidden');
                paymentSection.classList.remove('hidden');
            })
            .catch(error => {
                console.error("Google Forms Sync Error:", error);
                alert("Something went wrong with the submission. Please try again.");
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Razorpay Integration
    if(payBtn) {
        payBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Disable button visually while initializing
            payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing...';
            payBtn.disabled = true;

            // Simple setup for Razorpay integration (Development/Test Mode)
            // Note: In production, order_id should be fetched securely from your backend server.
            var options = {
                "key": "rzp_live_RxHmfgMlTRV3Su", // IMPORTANT: Add your Razorpay Key ID here
                "amount": "9900", // Amount is in currency subunits. Default currency is INR. 9900 = ₹99
                "currency": "INR",
                "name": "AptSkola",
                "description": "Seat reservation for 21-Day Reading & Creativity Summer Camp",
                "image": "https://aptskola.com/favicon.ico", // Add your logo URL here
                // "order_id": "order_xxxxxxx", // Uncomment and pass backend generated ID in production
                "handler": function (response){
                    // Payment Success Callback
                    // response.razorpay_payment_id
                    
                    paymentSection.classList.add('hidden');
                    successSection.classList.remove('hidden');
                    
                    /* Optionally trigger a webhook or second form submission here for final confirmation */
                },
                "prefill": {
                    // Pre-fill fields from the Web3Forms submission
                    "name": document.getElementById('parentName') ? document.getElementById('parentName').value : '',
                    "email": document.getElementById('email') ? document.getElementById('email').value : '',
                    "contact": document.getElementById('phone') ? document.getElementById('phone').value : ''
                },
                "theme": {
                    "color": "#FF9F1C" // Aptskola Primary Orange theme color
                }
            };

            if (options.key === "rzp_test_YOUR_KEY_HERE") {
                alert("Razorpay Key is missing! Please replace 'rzp_test_YOUR_KEY_HERE' with your actual key in script.js.");
                payBtn.innerHTML = 'Pay ₹99 Enrollment Fee';
                payBtn.disabled = false;
                return;
            }

            try {
                var rzp1 = new window.Razorpay(options);
                
                rzp1.on('payment.failed', function (response){
                    alert("Payment Failed. Reason: " + response.error.description);
                    // Redirect back to the chaitu landing page on failure
                    window.location.href = '/chaitu';
                });
                
                // Reset state if modal is closed without payment
                rzp1.on('payment.modal.closed', function() {
                    payBtn.innerHTML = 'Pay ₹99 Enrollment Fee';
                    payBtn.disabled = false;
                });
                
                rzp1.open();
            } catch (err) {
                alert("Razorpay Failed to Load: " + err.message);
                payBtn.innerHTML = 'Pay ₹99 Enrollment Fee';
                payBtn.disabled = false;
            }
        });
    }
});
