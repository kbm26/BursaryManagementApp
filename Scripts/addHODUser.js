function validateEmail(emailInput) {
  // Regular expression for validating email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    emailInput.setCustomValidity("Invalid email format");
  } else {
    emailInput.setCustomValidity("");
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const phoneNumber = document.getElementById("phoneNumber").value;
  const email = document.getElementById("email").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const departmentID = document.getElementById("departmentID").value;
  const universityID = document.getElementById("universityID").value;
  const formData = {
    phoneNumber,
    email,
    firstName,
    lastName,
    departmentID,
    universityID,
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };

  fetch(
    "https://bursarywebapp.azurewebsites.net/api/Users/createUniversityUser",
    requestOptions
  )
    .then((response) => {
      if (response.ok) {
        alert("submission successful");
      }
    })
    .catch((error) => {
      alert("Failed to submit form");
    });
}

document
  .querySelector(".addApplication")
  .addEventListener("submit", handleSubmit);
