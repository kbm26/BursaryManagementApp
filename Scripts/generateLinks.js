
 // Generate a Temporary Link for a student (Need to provide StudentIDNum)
 document.getElementById("tempLinkForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    // Get studentIDNum input value
    const studentIDNum = document.getElementById("studentIDNum").value;

    // Endpoint URL with the studentIDNum parameter
    const url = `https://bursarywebapp.azurewebsites.net/api/Token/generateToken?studentIDNum=${studentIDNum}`;

    // Define request options
    const requestOptions = {
        method: "POST",
        headers: {
            "accept": "*/*"
        }
    };

    // Make the POST request
    fetch(url, requestOptions)
        .then(response => {
            if (response.ok) {
                // Get token URL 
                console.log(response.json);
                return response.json();
            } else {
                document.getElementById("tokenUrl").textContent = "Error: " + response.statusText;
            }
        })
        .then(data => {
            // Display token URL to copy
            document.getElementById("tokenUrl").textContent = "Link generated: " + data.tokenUrl;
        })
        .catch(error => {

            console.error("Error:", error);
            document.getElementById("tokenUrl").textContent = "Error: " + error.message;
        });
});