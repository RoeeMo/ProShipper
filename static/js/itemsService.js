document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('add-item');
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = addForm.name.value;
        const price = addForm.price.value;
        const currency = addForm.currency.value;
        const image_url = addForm.image_url.value;
        const description = addForm.description.value;
        const res = await fetch('/add-item', { 
            method: 'POST', 
            body: JSON.stringify({ name, price, currency, image_url, description }),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();

        if (data.success) {
            Swal.fire({
                title: "Item added successfully!",
                icon: "success",
                timer: 1200,
                timerProgressBar: true,
            });
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            Swal.fire("Oops", ("Something went wrong"), "error");
        };
    });


    const table = document.querySelector('table');
    table.addEventListener('click', async (event) => {
        const target = event.target;

        if (target.classList.contains('delete-btn')) {
            const itemId = target.dataset.id;
            const url = '/del-item';
            const id = { id: itemId };

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(id),
            });

            const data = await res.json();

            if (data.success) {
                location.reload();
            } else {
                Swal.fire('Oops', 'Something went wrong', 'error');
            }
        }
    });
});