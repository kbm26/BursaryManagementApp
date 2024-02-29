// Allow HOD to create a new Student Application
document.getElementById("newStudentApplication").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form input values from html
    const formData = new FormData(event.target);
    const postData = {};
    formData.forEach((value, key) => {
        postData[key] = value;
    });


    // Define request options
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    };

    console.log(postData);

    // Make the POST request
    fetch("https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/createStudentApplication", requestOptions)
        .then(response => {
            if (response.ok) {
                // Display success message
                document.getElementById("successMessage").textContent = "Creating Application Successful. Response code: " + response.status;
            } else {
                // Display error message
                document.getElementById("successMessage").textContent = 'Creating Application Failed. Response code: ' + response.status;
            }
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
});


