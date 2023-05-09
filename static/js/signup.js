document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = form.username.value;
        const password = form.password.value;
        const password2 = form.password2.value;
        const res = await fetch('/signup', { 
            method: 'POST', 
            body: JSON.stringify({ username, password, password2 }),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();

        if (data.success) {
            Swal.fire({
                title: data.msg,
                html: "You'll be redirected shortly",
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didClose: () => { window.location.href = '/items'; } });
        } else {
            Swal.fire("Oops", ((data.msg).replaceAll('.', '.<br><br>')), "error");
        }
    });
});