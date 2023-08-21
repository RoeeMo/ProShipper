// Render Multiple reCAPTCHAs in the same page
function CaptchaCallback() {
    grecaptcha.render('login-recaptcha', {'sitekey' : '6LcHES4nAAAAAERbZEk3t1WJXQWpNxUvbVvzCv4E'});
    grecaptcha.render('reset-pass-recaptcha', {'sitekey' : '6LcHES4nAAAAAERbZEk3t1WJXQWpNxUvbVvzCv4E'});
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;
        const recaptchaResponse = grecaptcha.getResponse(0);
        const res = await fetch('/login', { 
        method: 'POST', 
        body: JSON.stringify({ username, password, recaptchaResponse }),
        headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();

        if (data.success) {    
            await Swal.fire({
                title: data.msg,
                icon: "success",
                showConfirmButton: false,
                timer: 1300,
            })
            
            // Show OTP modal
            const otpModal = document.getElementById('otp-modal');
            otpModal.classList.add('show'); // Show the modal backdrop
            otpModal.style.display = 'block'; // Show the modal content
            
            // Handle OTP form submission
            const otpForm = document.getElementById('otp-form');
            otpForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const otp = otpForm.otp.value;
                const res = await fetch('/login/otp', { 
                    method: 'POST', 
                    body: JSON.stringify({ otp }),
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json();
                console.log(data);
                
                if (data.success) {
                    Swal.fire({
                        title: data.msg,
                        html: "You'll be redirected shortly",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 800,
                        timerProgressBar: true,
                        });
                    setTimeout(() => {
                        window.location.href = '/items';
                    }, 700);
                } else {
                    Swal.fire({
                        title: "Oops",
                        html: data.msg,
                        icon: "error"
                    });
                }
            });
        } else {
        Swal.fire({
            title: "Oops",
            html: data.msg,
            icon: "error"
        });
        }
    });

    const resetPassForm = document.getElementById('reset-pass-form');
    resetPassForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = resetPassForm.email.value;
        const recaptchaResponse = grecaptcha.getResponse(1);
        const res = await fetch('/user/forgot-pass', {
            method: 'POST',
            body: JSON.stringify({ email, recaptchaResponse }),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();
        if (data.success) {
            Swal.fire({
                title: data.msg,
                icon: "success",
                showConfirmButton: false,
                timer: 1300,
            });
        } else {
            Swal.fire({
                title: "Oops",
                html: data.msg,
                icon: "error"
            });
        }
    });
});