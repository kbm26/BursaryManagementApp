function generateLinkandEmail(studentIDNum, studentEmail) {
  const url = `https://bursarywebapp.azurewebsites.net/api/Token/generateToken?studentIDNum=${studentIDNum}`;

  const requestOptions = {
    method: "POST",
    headers: {
      accept: "*/*",
    },
  };

  fetch(url, requestOptions)
    .then((response) => {
      if (response.ok) {
        console.log(response.json);
        return response.json();
      } else {
        console.log("Error: " + response.statusText);
      }
    })
    .then((data) => {
      console.log("Link generated: " + data.tokenUrl);
      const emailBody = `Dear Student,\n\nPlease find your link to upload application documents below:\n${data.tokenUrl}\n\nBest regards,\nYour Institution`;

      const encodedBody = encodeURIComponent(emailBody);
      const encodedSubject = encodeURIComponent("Token Link");

      const mailtoLink = `mailto:${studentEmail}?subject=${encodedSubject}&body=${encodedBody}`;

      window.location.href = mailtoLink;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
