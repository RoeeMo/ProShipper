document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;
        const res = await fetch('/login', { 
            method: 'POST', 
            body: JSON.stringify({ username, password }),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();

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

    const resetPassForm = document.getElementById('reset-pass-form');
    resetPassForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        email = resetPassForm.email.value;
        await fetch('/user/forgot-pass', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {'Content-Type': 'application/json'}
        });
        Swal.fire({
            title: "A reset link was sent to your email, please check your inbox",
            icon: "success",
            showConfirmButton: false,
            timer: 1300,
            });
    });
});