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

    // Select all delete buttons and attach a click event listener
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', async (event) => {
        const itemId = event.target.dataset.id;
        const url = '/del-item';
        const id = { id: itemId };
        
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id)
        })

        const data = await res.json();
    
        if (data.success) {
            location.reload();
        } else {
            Swal.fire("Oops", "Something went wrong", "error");
        }
        });
    });

    // async function delItem(id) {
    //     const res = await fetch('/del-item', {
    //         method: 'POST',
    //         body: JSON.stringify({ id }),
    //         headers: { 'Content-Type': 'application/json' }
    //     });
    //     const data = await res.json();
    
    //     if (data.success) {
    //         location.reload();
    //     } else {
    //         Swal.fire("Oops", "Something went wrong", "error");
    //     }
    // };
    // const table = document.querySelector('.table');
    // // const table = document.getElementById('test123');
    // console.log(table);
    // table.addEventListener('submit', async (e) => {
    //     if (e.target.classList.contains('del-item')) {
    //         e.preventDefault();
    //         const id = e.target.id.value;
    //         delItem(id);
    //     }
    // });
});





// const delForm = document.getElementById('del-item');
//     delForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const id = delForm.id.value;
//         const res = await fetch('/del-item', { 
//             method: 'POST', 
//             body: JSON.stringify({ id }),
//             headers: {'Content-Type': 'application/json'}
//         });
//         const data = await res.json();

//         if (data.success) {
//             location.reload();
//         } else {
//             Swal.fire("Oops", "Something went wrong", "error");
//         };
//     });