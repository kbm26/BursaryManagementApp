function generateLinkandEmail(studentIDNum, studentEmail) {
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
                return response.json();
            } else {
                throw new Error("Error: " + response.statusText);
            }
        })
        .then(data => {
            // Generate the email body
            const emailBody = `Dear Student,\n\nPlease find your temporary link below:\n${data.tokenUrl}\n\nBest regards,\nYour Institution`;

            // Encode email body and subject for mailto link
            const encodedBody = encodeURIComponent(emailBody);
            const encodedSubject = encodeURIComponent("Temporary Link");

            // Construct the mailto link
            const mailtoLink = `mailto:${studentEmail}?subject=${encodedSubject}&body=${encodedBody}`;

            // Open the email client with the mailto link
            window.location.href = mailtoLink;
        })
        .catch(error => {
            console.error("Error:", error);
            console.log(url);
            alert("Error: " + error.message);
        });
}

// Example usage:
// generateLinkandEmail("123456", "example@example.com");
