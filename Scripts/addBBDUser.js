function validateEmail(emailInput) {
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

  const formData = {
    phoneNumber,
    email,
    firstName,
    lastName,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };

  fetch(
    "https://bursarywebapp.azurewebsites.net/api/Users/createBBDUser",
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
