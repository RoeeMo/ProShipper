$(document).ready(function() {
    // Show add item modal when Add Item button is clicked
    $("#add-item-btn").click(function() {
      $("#add-item-modal").modal("show");
    });
  
    // Refresh page when Save button is clicked
    $("#save-item-btn").click(function() {
      // Hide the modal
      $("#add-item-modal").modal("hide");
      //reload the page
      // location.reload();
    });
  });
  
  // Dynamically expands the "Description" input box
  function autoSize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight) + "px";
  };