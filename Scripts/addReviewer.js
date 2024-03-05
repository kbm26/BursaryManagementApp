function getUsers() {
  const selectButton = document.getElementById("userID");

  fetch("https://bursarywebapp.azurewebsites.net/api/Users/users/2")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      selectDropDownDataInserter({
        listOfData: data,
        select: selectButton,
        dataKey: "firstName",
        optionalkey: "lastName",
        optionalAttribute: "userID",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "An error occurred while fetching data.";
      document.body.appendChild(errorMessage);
    });
}

function getUniversities() {
  const selectButton = document.getElementById("universityID");
  fetch("https://bursarywebapp.azurewebsites.net/api/Universities")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("No funds allocated");
      }
    })
    .then((data) => {
      selectDropDownDataInserter({
        listOfData: data,
        select: selectButton,
        dataKey: "uniName",
        optionalAttribute: "uniName",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "An error occurred while fetching data.";
      document.body.appendChild(errorMessage);
    });
}

async function getUniversityApplicationID(uniName) {
  try {
    const response = await fetch(
      "https://bursarywebapp.azurewebsites.net/api/UniversityApplication/" +
        uniName
    );
    if (!response.ok) {
      throw new Error("Failed to fetch application ID");
    }
    const data = await response.json();
    return data["applicationID"];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
getUsers();
getUniversities();

async function handleSubmit(event) {
  event.preventDefault();
  const universityID = document.getElementById("universityID").value;
  const UserSelect = document.getElementById("userID");
  const selectedOption = UserSelect.options[UserSelect.selectedIndex];

  try {
    const appID = await getUniversityApplicationID(universityID);

    const userID = parseInt(selectedOption.getAttribute("info"));
    const formData = {
      userID: userID,
      studentAllocationID: null,
      universityApplicationID: appID,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    const response = await fetch(
      "https://bursarywebapp.azurewebsites.net/api/Reviewer",
      requestOptions
    );

    if (response.ok) {
      alert("Submission successful");
    } else {
      throw new Error("Failed to submit form");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to submit form");
  }
}

document
  .getElementById("newStudentApplication")
  .addEventListener("submit", handleSubmit);
