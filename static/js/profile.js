document.addEventListener('DOMContentLoaded', () => {
    // Change Password
    const changePassForm = document.getElementById('change-pass-form');
    changePassForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const current_pass = changePassForm.currentPassword.value;
        const new_pass = changePassForm.newPassword.value;
        const confirm_pass = changePassForm.confirmPassword.value;
        const res = await fetch('/user/change-pass', {
            method: 'POST',
            body: JSON.stringify({ current_pass, new_pass, confirm_pass }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();

        if (data.success) {
            Swal.fire({
                title: data.msg,
                icon: "success",
                showConfirmButton: false,
                timer: 800
                });
        } else {
            Swal.fire("Oops", ((data.msg).replaceAll('.', '.<br><br>')), "error");
        }
    })
})