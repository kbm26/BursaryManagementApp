// Get the Documents for Specified Student ID Number
function getStudentDocuments(studentIDNum) {
    fetch(`https://bursarywebapp.azurewebsites.net/api/Documents/${studentIDNum}`, {
        method: "GET",
        headers: {
            "accept": "application/json" // Expecting a json response
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log(Error + "Student has no documents. Please send them a temporary link to upload")
            alert("Student has no documents. Please send them a temporary link to upload");
        }
    })
    .then(data => {
        console.log("Documents for Student retrieved:", data);

        // Extract individual links from the response data
        const academicTranscriptLink = data.academicTranscript;
        const idLink = data.id;

        // Check if both links are available
        if (academicTranscriptLink && idLink) {
            // Create anchor elements for each link
            const academicTranscriptAnchor = document.createElement("a");
            academicTranscriptAnchor.href = academicTranscriptLink;
            academicTranscriptAnchor.target = "_blank"; // Open in new tab

            const idAnchor = document.createElement('a');
            idAnchor.href = idLink;
            idAnchor.target = "_blank"; // Open in new tab

            // Append the first anchor element to the document body
            document.body.appendChild(academicTranscriptAnchor);

            // Trigger download of the first file
            academicTranscriptAnchor.click();

            // Remove the first anchor element after download
            academicTranscriptAnchor.addEventListener("click", () => {
                document.body.removeChild(academicTranscriptAnchor);

                // Append the second anchor element to the document body
                document.body.appendChild(idAnchor);

                // Trigger download of the second file
                idAnchor.click();

                // Remove the second anchor element after download
                idAnchor.addEventListener("click", () => {
                    document.body.removeChild(idAnchor);
                });
            });
        } else {
            console.error("Error: Missing link(s) in the response data");
            alert("Error: Missing link(s) in the response data");
        }

        alert("Documents retrieved successfully.");
    })
    .catch(error => {
        console.error("Error:", error);

        //alert("Failed to retrieve documents. Please try again later.");
    });
}




  // Popup message = Student Has no document. Please send them a temporary link to upload 

