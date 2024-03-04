document.getElementById("logInForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    

    const submitButton = document.getElementById("submitLogIn");
    submitButton.style.display = "none";
    document.getElementById("successMessage").textContent = "Processing submission";

    const studentIDNum = document.getElementById("studentIDNumber").value;
    const academicTranscriptFile = document.getElementById("academicTranscriptFile").files[0];
    const idFile = document.getElementById("idFile").files[0];


    const formData = new FormData();
    formData.append("studentIDNum", studentIDNum);
    formData.append("academicTranscriptFile", academicTranscriptFile);
    formData.append("idFile", idFile);


    const requestOptions = {
        method: "POST",
        headers: {
            'accept': '*/*'
        },
        body: formData
        
        
    };


    fetch(`https://bursarywebapp.azurewebsites.net/api/Documents/UploadStudentDocuments?studentIDNum=${studentIDNum}`, requestOptions)
        .then(response => {
            if (response.ok) {
                console.log("Student Documents uploaded successfully.");
                document.getElementById("successMessage").textContent = "Documents uploaded successfully.";
                document.getElementById("successMessage").style.display = "inline";
                submitButton.style.display = "block";
            } else {
                console.error("Failed to upload documents.");
                document.getElementById("successMessage").textContent = "Documents Failed to upload.";
                submitButton.style.display = "block";
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
  });