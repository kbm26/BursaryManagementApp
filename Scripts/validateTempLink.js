// Validate The Temporary Link for a student 

document.addEventListener('DOMContentLoaded', function () {
    // Get the full URL of the current page
    const currentUrl = window.location.href;
    
    // Check if URL exists
    if (currentUrl) {
        // Construct the URL for the API endpoint, passing the URL parameter
        const apiUrl = `https://bursarywebapp.azurewebsites.net/api/Token/validateToken?url=${encodeURIComponent(currentUrl)}`;

        // Make a GET request to the API endpoint
        fetch(apiUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                // Display the response data
                displayResponse(data);
            })
            .catch(error => {
                console.error('Error:', error);
                // Display error message to the user
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'An error occurred while fetching data.';
                document.body.appendChild(errorMessage);
            });
    } else {
        // Display error message if URL is not provided
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'URL not found.';
        document.body.appendChild(errorMessage);
    }
});

function displayResponse(data) {
    // Display the response data
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.textContent = JSON.stringify(data, null, 2);
}
