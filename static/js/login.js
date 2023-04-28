document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

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
                title: "Logged in successfully!",
                html: "You'll be redirected shortly",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didClose: () => { window.location.href = '/items'; } });
        } else {
            Swal.fire("Oops", ((data.errs).replaceAll('.', '.<br><br>')), "error");
        }
    });
});