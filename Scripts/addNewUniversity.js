document
  .getElementById("newUniversity")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const uniName = document.getElementById("universityName").value;

      const requestData = {
        uniName: uniName,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(requestData),
      };

      const response = await fetch(
        "https://bursarywebapp.azurewebsites.net/api/Universities",
        requestOptions
      );

      if (!response.ok) {
        document.getElementById("successMessage").textContent =
          "University Already Exists";
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        document.getElementById("successMessage").textContent =
          "University Added Successfully";
      }

      alert("University has been created.");
    } catch (error) {
      alert("University has not been created.", error);
    }
  });
