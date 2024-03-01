
//Get the Email address of the student and open a mailto for the link
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
                // Get token URL 
                console.log(response.json);
                return response.json();
            } else {
                console.log("Error: " + response.statusText);
                
            }
        })
        .then(data => {
            console.log("Link generated: " + data.tokenUrl);
            // Generate email body and then open email for supplied studentEmail
            const emailBody = `Dear Student,\n\nPlease find your link to upload application documents below:\n${data.tokenUrl}\n\nBest regards,\nYour Institution`;

            // Encode email body and subject for mailto link
            const encodedBody = encodeURIComponent(emailBody);
            const encodedSubject = encodeURIComponent("Token Link");

            // Create MailtoLink
            const mailtoLink = `mailto:${studentEmail}?subject=${encodedSubject}&body=${encodedBody}`;

            // Open Mail client 
            window.location.href = mailtoLink;
            
        })
        .catch(error => {
            console.error("Error:", error);
            
        });



}

 