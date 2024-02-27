document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('getTokenForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Construct the URL for the GET request
        var url = 'https://bursarywebapp.azurewebsites.net/api/Universities';

        // AJAX GET request to the API endpoint
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Display the JSON response in the responseContainer div
                document.getElementById('responseContainer').innerText = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
