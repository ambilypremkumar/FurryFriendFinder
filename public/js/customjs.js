document.addEventListener('DOMContentLoaded', function() {
    const searchElement = document.getElementById('search');
    const form = document.querySelector('.search-form');

    // Function to perform search
    function performSearch() {
        const query = searchElement.value.trim();
        if (query.length > 0) {
            form.setAttribute('action', `/finder?query=${query}`);
        } else {
            form.setAttribute('action', '/finder');
        }
        form.submit(); // Submit the form when typing starts
    }

    // Add event listener for input field
    if (searchElement && form) {
        searchElement.addEventListener('input', performSearch);

        // Add event listener for form submission
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            performSearch(); // Perform search
            window.location.href = form.getAttribute('action'); // Redirect to search URL
        });
    }
});
