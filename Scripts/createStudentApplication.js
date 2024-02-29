// Allow HOD to create a new Student Application
document.getElementById("newStudentApplication").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form input values from html
    const formData = new FormData(event.target);
    const postData = {};
    
     // Manually trim whitespace from values and add to postData
    formData.forEach((value, key) => {
        const trimmedValue = value.trim();
        postData[key] = trimmedValue;
    });


    // Define request options
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    };

    console.log(JSON.stringify(postData));

    // Make the POST request
    fetch("https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/createStudentApplication", requestOptions)
        .then(response => {
            if (response.ok) {
                // Display success message
                document.getElementById("successMessage").textContent = "Creating Application Successful";
            } else {
                // Display error message
                document.getElementById("successMessage").textContent = "Creating Application Failed";
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

// Validate email address
function validateEmail(input) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailPattern.test(input.value);
    
    input.setCustomValidity(isValid ? "" : "Please enter a valid email address");
}