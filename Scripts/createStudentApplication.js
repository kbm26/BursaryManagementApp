
document
  .getElementById("newStudentApplication")
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
        tempUserId)}`;
      const userDataResponse = await fetch(url);
      if (!userDataResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const userData = await userDataResponse.json();
      console.log(userData);
      const HODUniversityID = userData.universityID;

      const formData = new FormData(event.target);
      const postData = {};

      formData.forEach((value, key) => {
        const trimmedValue = value.trim();
        postData[key] = trimmedValue;
      });


      postData.universityID = HODUniversityID;

      const idNumber = document.getElementById("studentIDNum").value; 

      postData.dateOfBirth = extractDateOfBirth(idNumber);

      postData.genderID = extractGender(idNumber);


      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };


      const allocationYear = new Date().getFullYear();

      const spendingsResponse = await fetch(
        `https://bursarywebapp.azurewebsites.net/api/UniversitySpendings?allocationYear=${allocationYear}&universityID=${HODUniversityID}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (!spendingsResponse.ok) {
        throw new Error(`HTTP error! status: ${spendingsResponse.status}`);
      }

      const responseData = await spendingsResponse.json();
      const availableFunds = responseData["amountRemaining"];

      console.log(postData);


      if (postData.amount < availableFunds) {

        const response = await fetch(
          "https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/createStudentApplication",
          requestOptions
        );
        if (response.ok) {

          document.getElementById("successMessage").textContent =
            "Creating Application Successful";
            console.log(response.json);
        } else {

          document.getElementById("successMessage").textContent =
            "Creating Application Failed";
            
        }
      } else {
        alert("Insufficient funds in budget");
      }
    } catch (error) {

      console.error("Error:", error);
    }
  });


function validateEmail(input) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailPattern.test(input.value);

  input.setCustomValidity(isValid ? "" : "Please enter a valid email address");
}



function validatePhoneNumber(input) {

    const regex = /^((\+27)|0)[6-8][0-9]{8}$/;
    return regex.test(input);
}


function validateStudentMarks(input) {
    const marks = parseInt(input.value);
    if (marks <= 70 || marks > 100) {
        input.setCustomValidity("Student marks must be above 70 and less than 100");
    } else {
        input.setCustomValidity("");
    }
}


function isValidSAIDNumber(input) {
  const regex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))$/;

  return regex.test(input);
}


document.getElementById("phoneNumber").addEventListener("input", function () {
    const isValid = validatePhoneNumber(this.value);
    if (!isValid) {
        this.setCustomValidity("Please enter a valid South African phone number");
    } else {
        this.setCustomValidity("");
    }
});



function validateNames(input) {
    const isValid = /^[A-Za-z]+$/.test(input.value);
    if (!isValid) {
        input.setCustomValidity("Must contain only alphabetic characters.");
    } else {
        input.setCustomValidity(""); 
    }
}


function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function extractDateOfBirth(idNumber) {
    idNumber = String(idNumber);

    const yearPrefix = parseInt(idNumber.substring(0, 2));
    const month = parseInt(idNumber.substring(2, 4));
    const day = parseInt(idNumber.substring(4, 6));

    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100) * 100;

    let fullYear;
    if (yearPrefix >= currentYear % 100) {
        fullYear = currentCentury - 100 + yearPrefix;
    } else {
        fullYear = currentCentury + yearPrefix;
    }

    const dateOfBirth = new Date(fullYear, month - 1, day);
    return formatDate(dateOfBirth);
}


function extractGender(idNumber) {
  const genderDigits = parseInt(idNumber.substring(6, 10));

  if (genderDigits < 5000) {
      return 1;
  } else {
      return 2; 
  }
}

document.getElementById("studentIDNum").addEventListener("input", function () {
    const isValid = isValidSAIDNumber(this.value);
    if (!isValid) {
        this.setCustomValidity("Please enter a valid South African Identity Number");
    } else {
        this.setCustomValidity("");
    }
});


document.getElementById("studentMarks").addEventListener("input", function () {
    validateStudentMarks(this);
});

document.getElementById("firstName").addEventListener("input", function () {
    validateNames(this);
});

document.getElementById("lastName").addEventListener("input", function () {
    validateNames(this);
});


document.getElementById("amount").addEventListener("input", function () {
  const value = this.value;

  const sanitizedValue = value.replace(/^0+/, '');

  const sanitizedValue2 = sanitizedValue.replace(/[^\d.]/g, '');

  const sanitizedValue3 = sanitizedValue2.replace(/(\..*)\./g, '$1');

  const finalValue = sanitizedValue3.startsWith('-') ? sanitizedValue3.slice(1) : sanitizedValue3;

  this.value = finalValue;

  if (value !== finalValue) {
      this.setCustomValidity("Please enter a valid amount (positive number)");
  } else {
      this.setCustomValidity("");
  }
});


