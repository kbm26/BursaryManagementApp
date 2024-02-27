document.getElementById('postForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form input values
    const formData = new FormData(event.target);
    const postData = {};
    formData.forEach((value, key) => {
        postData[key] = value;
    });

    // Convert isLocked value to boolean
    postData.isLocked = document.getElementById('isLocked').checked;

    // Define request options
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    };

    // Make the POST request
    fetch('https://bursarywebapp.azurewebsites.net/api/UniversityApplication', requestOptions)
        .then(response => {
            if (response.ok) {
                // Display success message
                document.getElementById('response').textContent = 'Request successful. Response code: ' + response.status;
            } else {
                // Display error message
                document.getElementById('response').textContent = 'Request failed. Response code: ' + response.status;
            }
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
});
