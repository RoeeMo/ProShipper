document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = form.username.value;
        const password = form.password.value;
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
    })
});