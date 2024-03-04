document.addEventListener("DOMContentLoaded", function () {

  const currentUrl = window.location.href;

  const apiUrl =
    "https://bursarywebapp.azurewebsites.net/api/Token/validateToken";


  const fullUrl = `${apiUrl}?url=${encodeURIComponent(currentUrl)}`;


  const requestOptions = {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  };


  fetch(fullUrl, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();

      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((data) => {
      const inputField = document.getElementById("studentIDNumber");
      inputField.value = data.studentIDNum;
      inputField.disabled = true;

      if (!data.isValid) {
        window.location.href = "/error";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      window.location.href = "/error";
    });
});
