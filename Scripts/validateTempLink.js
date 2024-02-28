document.addEventListener('DOMContentLoaded', function () {
    // Extract the current URL from the browser
    const currentUrl = window.location.href;
    
    // Define the URL for the API endpoint
    const apiUrl = 'https://bursarywebapp.azurewebsites.net/api/Token/validateToken';

    // Construct the full URL including the query parameter
    const fullUrl = `${apiUrl}?url=${encodeURIComponent(currentUrl)}`;

    // Define request options
    const requestOptions = {
        method: 'GET',
        headers: {
            'accept': '*/*'
        }
    };

    // Make the GET request
    fetch(fullUrl, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            // Handle the response data
            console.log(data);
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            // If validation fails, redirect the user
            window.location.href = "https://ukukhulabursary.netlify.app/InvalidLink.html";
        });
});
