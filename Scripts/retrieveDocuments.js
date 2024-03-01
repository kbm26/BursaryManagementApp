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
        const documentLinks = data;

        // Define keys to open in new tabs
        const keysToOpenInNewTab = ["id", "academicTranscript"];

        /*
        Loops through each key in the keysToOpenInNewTab array.
        Then checks if the documentLinks object has the current key.
        Creates an anchor href attribute of the anchor element to the link associated with the current key.
        Targe attribute '_blank' opens the created link in new tab. 
        anchor gets removed when function is completed. 
        */
        keysToOpenInNewTab.forEach(key => {
            if (documentLinks.hasOwnProperty(key)) {
                const link = documentLinks[key];
                const anchor = document.createElement('a');
                anchor.href = link;
                anchor.target = '_blank'; // Open in new tab
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            }
        });

        alert("Documents retrieved successfully.");
    })
    .catch(error => {
        console.error("Error:", error);

        //alert("Failed to retrieve documents. Please try again later.");
    });
}




  // Popup message = Student Has no document. Please send them a temporary link to upload 

