// Get the Documents for Specified Student ID Number
function getStudentAcademicTranscript(studentIDNum) {
  fetch(
    `https://bursarywebapp.azurewebsites.net/api/Documents/${studentIDNum}`,
    {
      method: "GET",
      headers: {
        accept: "application/json", // Expecting a json response
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(
          Error +
            "Student has no documents. Please send them a temporary link to upload"
        );
        alert(
          "Student has no documents. Please send them a temporary link to upload"
        );
      }
    })
    .then((data) => {
      alert("Documents for Student retrieved:", data);

      // Extract individual links from the response data
      const academicTranscriptLink = data.academicTranscript;
      const idLink = data.id;
      // Check if both links are available
      if (academicTranscriptLink) {
        // Create anchor elements for each link
        const academicTranscriptAnchor = document.createElement("a");
        academicTranscriptAnchor.href = academicTranscriptLink;
        academicTranscriptAnchor.target = "_blank";
        document.body.appendChild(academicTranscriptAnchor);
        academicTranscriptAnchor.click();
        academicTranscriptAnchor.addEventListener("click", () => {
          document.body.removeChild(academicTranscriptAnchor);
          alert("Academic Transcript retrieved successfully.");
        });
      } else {
        console.error("Error: Missing link(s) in the response data");
        alert("Error: Missing link(s) in the response data");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getStudentID(studentIDNum) {
  fetch(
    `https://bursarywebapp.azurewebsites.net/api/Documents/${studentIDNum}`,
    {
      method: "GET",
      headers: {
        accept: "application/json", // Expecting a json response
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(
          Error +
            "Student has no documents. Please send them a temporary link to upload"
        );
        alert(
          "Student has no documents. Please send them a temporary link to upload"
        );
      }
    })
    .then((data) => {
      alert("Documents for Student retrieved:", data);

      // Extract individual links from the response data
      const idLink = data.id;
      if (idLink) {
        const idAnchor = document.createElement("a");
        idAnchor.href = idLink;
        idAnchor.target = "_blank";
        document.body.appendChild(idAnchor);
        idAnchor.click();
        document.body.appendChild(idAnchor);
        idAnchor.addEventListener("click", () => {
          document.body.removeChild(idAnchor);
          alert("Documents ID successfully.");
        });
      } else {
        console.error("Error: Missing link(s) in the response data");
        alert("Error: Missing link(s) in the response data");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Popup message = Student Has no document. Please send them a temporary link to upload
