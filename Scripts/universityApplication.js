document
  .getElementById("postForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const tempUserId = localStorage.getItem("userID");
    if (!tempUserId) {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "HOD User ID not found. Please allow cookies";
      document.body.appendChild(errorMessage);
      return;
    }

    try {
      const url = `https://bursarywebapp.azurewebsites.net/api/Users/universityUserDetails/${window.atob(
        tempUserId
      )}`;
      const userDataResponse = await fetch(url);
      if (!userDataResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const userData = await userDataResponse.json();
      const HODUniversityID = userData.universityID;

      const formData = new FormData(event.target);
      const postData = {};
      formData.forEach((value, key) => {
        postData[key] = value;
      });

      postData.universityID = HODUniversityID;

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };

      fetch(
        "https://bursarywebapp.azurewebsites.net/api/UniversityApplication",
        requestOptions
      )
        .then((response) => {
          if (response.ok) {
            document.getElementById("successMessage").textContent =
              "Application Submitted";
          } else {
            document.getElementById("successMessage").textContent =
              "Application for year already exists";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  });
