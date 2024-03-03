// Add new University
document.getElementById("newUniversity").addEventListener("submit", async function(event) {
    // Prevent form submission
    event.preventDefault();

    try {
        // Get the university name input value from the form
        const uniName = document.getElementById("universityName").value;

        const requestData = {
            uniName: uniName
        };

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
            },
            body: JSON.stringify(requestData) 
        };

        const response = await fetch("https://bursarywebapp.azurewebsites.net/api/Universities", requestOptions);

        if (!response.ok) {
            document.getElementById("successMessage").textContent = "University Already Exists";
            throw new Error(`HTTP error! status: ${response.status}`);
            
        }
        else {
            document.getElementById("successMessage").textContent = "University Added Successfully";
        }

        // Parse the JSON response data
        const responseData = await response.json();

        // Log the response data
        console.log("Response:", responseData);


    } catch (error) {
        // Log any errors that occur
        console.error("Error:", error);
        // Add code to handle errors (e.g., display error message)
    }

});