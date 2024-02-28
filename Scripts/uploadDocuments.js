document.getElementById("logInForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    
    // Get form input values
    const studentIDNum = document.getElementById("studentIDNumber").value;
    const academicTranscriptFile = document.getElementById("academicTranscriptFile").files[0];
    const idFile = document.getElementById("idFile").files[0];

    // Construct FormData object to send multipart/form-data
    const formData = new FormData();
    formData.append("studentIDNum", studentIDNum);
    formData.append("academicTranscriptFile", academicTranscriptFile);
    formData.append("idFile", idFile);

    // Options for request 
    const requestOptions = {
        method: "POST",
        headers: {
            'accept': '*/*'
        },
        body: formData
        
        
    };

    // POST Request to upload documents for StudentIDNum
    fetch(`https://bursarywebapp.azurewebsites.net/api/Documents/UploadStudentDocuments?studentIDNum=${studentIDNum}`, requestOptions)
        .then(response => {
            if (response.ok) {
                console.log("Student Documents uploaded successfully.");
                document.getElementById("successMessage").textContent = "Documents uploaded successfully.";
                document.getElementById("successMessage").style.display = "inline";
            } else {
                console.error("Failed to upload documents.");
                document.getElementById("successMessage").textContent = "Documents Failed to upload.";
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
  });