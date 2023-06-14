const input = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
let popoverInstance;

input.addEventListener('input', async () => {
  const searchTerm = input.value.trim();
  if (searchTerm === '') {
    hidePopover();
    return;
  }

  try {
    const response = await fetch(`/search?term=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    displaySearchResults(data);
  } catch (err) {
    console.error(err);
  }
});

function displaySearchResults(results) {
  if (results.length === 0) {
    hidePopover();
    return;
  };

  const resultList = document.createElement('ul');
  resultList.classList.add('list-group');

  results.forEach((result) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    
    const link = document.createElement('a');
    link.href = `/items/${result._id}`;
    link.textContent = result.name;

    li.appendChild(link);
    resultList.appendChild(li);
  });

  searchResults.innerHTML = '';
  searchResults.appendChild(resultList);

  // Initialize or update the popover instance with the new content
  if (popoverInstance) {
    popoverInstance.update();
  } else {
    const popoverTrigger = document.querySelector('[data-bs-toggle="popover"]');
    popoverInstance = new bootstrap.Popover(popoverTrigger);
  };

  // Show the popover
  const popoverContent = searchResults.innerHTML;
  popoverInstance._config.content = popoverContent;
  popoverInstance.show();
};

function hidePopover() {
  if (popoverInstance) {
    popoverInstance.hide();
  }
};