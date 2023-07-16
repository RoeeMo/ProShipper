document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById("open-modal-btn");
    const modal = new bootstrap.Modal(document.getElementById("add-item-modal"));

    openModalBtn.addEventListener("click", function() {
    modal.show(); // Bootstrap function
    });
    
    // "Add item" listener
    const addForm = document.getElementById('add-item');
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = addForm.name.value;
        const price = addForm.price.value;
        const currency = addForm.currency.value;
        const image_url = addForm.image_url.value;
        const description = addForm.description.value;
        const res = await fetch(`${document.location.origin}/add-item`, { 
            method: 'POST', 
            body: JSON.stringify({ name, price, currency, image_url, description }),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();

        if (data.success) {
            Swal.fire({
                title: data.msg,
                icon: "success",
                timer: 1100,
                timerProgressBar: true,
            });
            setTimeout(() => {
                location.reload();
            }, 900);
        } else {
            Swal.fire({
                title: "Oops",
                html: data.msg,
                icon: "error"
            });
        };
    });

    // "Delete item" listener
    const table = document.getElementById('item-table');
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
                Swal.fire({
                    title: data.msg,
                    icon: "success",
                    timer: 1100,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    location.reload();
                }, 900);
            } else {
                Swal.fire({
                    title: "Oops",
                    html: data.msg,
                    icon: "error"
                });
            }
        }
    });
    
    // "Generate PDF" listener
    const generatePDF = document.getElementById('generate-pdf-btn');
    generatePDF.addEventListener('click', async () => {
        const table = document.getElementById('item-table');
        const rows = table.getElementsByTagName('tr');
        
        // An array to store the items
        const items = [];
        
        // Loop through each row (skip the header row)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            
            // Extract the item details from the row
            const name = row.cells[0].querySelector('a').innerText; // Skip the image 
            const price = row.cells[1].innerText;
            const description = row.cells[2].innerText;
            
            // Create an item object
            const item = {
                name: name,
                price: price,
                description: description
            };
            
            // Add the item to the items array
            items.push(item);
        };

        
        const response = await fetch('/generate-pdf', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: items })
        });
        
        if (response.ok) {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/pdf')) {
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl);
            } else {
                const data = await response.json();
                if (!data.success) {
                    Swal.fire({
                        title: "Oops",
                        html: data.msg,
                        icon: "error"
                    });
                }
            }
        } else {
            Swal.fire({
                title: "Oops",
                html: "Something went wrong",
                icon: "error"
            });
        }
    });
});


// Dynamically expands the item's "Description" input box
function autoSize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight) + "px";
};