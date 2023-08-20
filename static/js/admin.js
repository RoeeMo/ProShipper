document.addEventListener('DOMContentLoaded', () => {
    // For the "User Management" page
    const userTable = document.getElementById('user-table');
    if (userTable) {
        userTable.addEventListener('click', async (e) => {
            await buttonActions(e);
        });
    }

    // For the "User Details" page
    const userDetailsContainer = document.getElementById('user-details');
    if (userDetailsContainer) {
        userDetailsContainer.addEventListener('click', async (e) => {
            await buttonActions(e);
        });
    }
});

async function buttonActions(event) {
    const target = event.target;
    
    // Delete user
    if (target.classList.contains('delete-btn')) {          
        const res = await fetch('/admin/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: target.dataset.id }),
        });
        const data = await res.json();
        if (data.success) {
            Swal.fire({
                title: data.msg,
                icon: "success",
                timer: 800,
                timerProgressBar: true,
            });
            setTimeout(() => {
                window.location.href = '/admin/users';
            }, 700);
        } else {
            Swal.fire({
                title: "Oops",
                html: data.msg,
                icon: "error"
            });
        }
    };

    // Edit user
    if (target.classList.contains('update-user')) { 
        event.preventDefault();
        const form = target.closest('form');       
        const res = await fetch('/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: form.id.value,
                username: form.username.value,
                email: form.email.value,
                type: form.type.value
            }),
        });
        const data = await res.json();
        if (data.success) {
            Swal.fire({
                title: data.msg,
                icon: "success",
                timer: 800,
                timerProgressBar: true,
            });
            setTimeout(() => {
                window.location.reload();
            }, 700);
        } else {
            Swal.fire({
                title: "Oops",
                html: data.msg,
                icon: "error"
            });
        }
    };
};