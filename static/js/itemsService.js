document.addEventListener('DOMContentLoaded', () => {
    // Add item listener
    const addForm = document.getElementById('add-item');
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = addForm.name.value;
        const price = addForm.price.value;
        const currency = addForm.currency.value;
        const image_url = addForm.image_url.value;
        const description = addForm.description.value;
        const res = await fetch('http://localhost:3000/add-item', { 
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
            Swal.fire("Oops", data.msg, "error");
        };
    });

    // Delete item listener
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
                Swal.fire('Oops', data.msg, 'error');
            }
        }
    });
    
    // Generate PDF listener
    const generatePDF = document.getElementById('generatePDFBtn');
    generatePDF.addEventListener('click', function() {
        const table = document.getElementById('itemTable');
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

        fetch('/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ items: items })
        })
        .then(response => response.blob())
        .then(blob => {
          // Create a new blob URL from the PDF blob
          var blobUrl = URL.createObjectURL(blob);
          // Open the generated PDF in a new browser tab
          window.open(blobUrl);
        })
        .catch(error => console.error('Error:', error));
      });
});