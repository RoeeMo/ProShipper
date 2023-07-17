document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-pass-form');
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const reset_token = (document.location.href).split('=')[1]
        const new_pass = resetForm.password.value;
        const confirm_pass = resetForm.confirmPassword.value;
        const recaptchaResponse = grecaptcha.getResponse();
        const res = await fetch('/user/reset-pass', {
            method: 'POST',
            body: JSON.stringify({ reset_token, new_pass, confirm_pass, recaptchaResponse }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();

        if (data.success) {
            Swal.fire({
                title: data.msg,
                html: "You are being redirected to the login page",
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didClose: () => { window.location.href = '/login'; }
            });
        } else {
            Swal.fire("Oops", ((data.msg).replaceAll('.', '.<br><br>')), "error");
        }
    })
})