document.getElementById('generateTokenForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get studentIDNum input value
    const studentIDNum = document.getElementById('studentIDNum').value;

    // Construct the URL with the studentIDNum parameter
    const url = `https://bursarywebapp.azurewebsites.net/api/Token/generateToken?studentIDNum=${studentIDNum}`;

    // Define request options
    const requestOptions = {
        method: 'POST',
        headers: {
            'accept': '*/*'
        }
    };

    // Make the POST request
    fetch(url, requestOptions)
        .then(response => {
            if (response.ok) {
                // Extract token URL from the response
                return response.json();
            } else {
                // Display error message
                document.getElementById('tokenUrl').textContent = 'Error: ' + response.statusText;
            }
        })
        .then(data => {
            // Display token URL
            document.getElementById('tokenUrl').textContent = 'Token URL: ' + data.tokenUrl;
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            document.getElementById('tokenUrl').textContent = 'Error: ' + error.message;
        });
});
