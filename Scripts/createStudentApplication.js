// Allow HOD to create a new Student Application
document.getElementById("newStudentApplication").addEventListener("submit", async function(event) {
    // Prevent form submission
    event.preventDefault();

    // Get HODUniversityID using UserID
    const tempUserId = sessionStorage.getItem("userID");
    if (!tempUserId) {
        // Display error message if userID is not found
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "HOD User ID not found. Please allow cookies";
        document.body.appendChild(errorMessage);
        return; // Exit function early if userID is not found
    }

    try {
        // Fetch user details using HOD UserID
        const url = `https://bursarywebapp.azurewebsites.net/api/Users/universityUserDetails/${window.atob(tempUserId)}`;
        const userDataResponse = await fetch(url);
        if (!userDataResponse.ok) {
            throw new Error("Network response was not ok");
        }
        const userData = await userDataResponse.json();
        console.log(userData);
        const HODUniversityID = userData.universityID;

        // Get form input values from html
        const formData = new FormData(event.target);
        const postData = {};

        // Manually trim whitespace from values and add to postData
        formData.forEach((value, key) => {
            const trimmedValue = value.trim();
            postData[key] = trimmedValue;
        });

        // Set the UniversityID as the retrieved ID
        postData.universityID = HODUniversityID;

        // Define request options
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        };


        // Check available funds: 
        const allocationYear = new Date().getFullYear();

        const spendingsResponse = await fetch(`https://bursarywebapp.azurewebsites.net/api/UniversitySpendings?allocationYear=${allocationYear}&universityID=${HODUniversityID}`, {
            method: "GET",
            headers: {
                "accept": "*/*"
            }
        });

        if (!spendingsResponse.ok) {
            throw new Error(`HTTP error! status: ${spendingsResponse.status}`);
        }

        const responseData = await spendingsResponse.json();
        const availableFunds = responseData["amountRemaining"];


        // Make Request if funds are available: 
        if (postData.amount < availableFunds) {
            // Make the POST request
            const response = await fetch("https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/createStudentApplication", requestOptions);
            if (response.ok) {
                // Display success message if request is successful
                document.getElementById("successMessage").textContent = "Creating Application Successful";
            } else {
                // Display error message if request fails
                document.getElementById("successMessage").textContent = "Creating Application Failed";
            }
        }
        else {
            alert("Insufficient funds in budget"); 
        }

        
    } catch (error) {
        // Display error message if an error occurs
        console.error("Error:", error);
    }
});


// Validate email address
function validateEmail(input) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailPattern.test(input.value);
    
    input.setCustomValidity(isValid ? "" : "Please enter a valid email address");
}



function validatePhoneNumber(input) {
    // Use regular expression to validate South African phone number format
    const regex = /^((\+27)|0)[6-8][0-9]{8}$/;
    return regex.test(input);
}



// Validate student marks (must be above 70)
function validateStudentMarks(input) {
    const marks = parseInt(input.value);
    if (marks <= 70) {
        input.setCustomValidity("Student marks must be above 70");
    } else {
        input.setCustomValidity("");
    }
}


function isValidSAIDNumber(input) {
    // Check if the ID number is 13 characters long
    if (input.length !== 13) {
        return false;
    }

    // Apply Luhn algorithm to validate the ID number
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(input.charAt(i));
        sum += (i % 2 === 0) ? digit : (digit < 5) ? 2 * digit : 2 * digit - 9;
    }
    const checksum = (10 - (sum % 10)) % 10;
    return parseInt(input.charAt(12)) === checksum;
}



// Attach validation functions to corresponding input fields
document.getElementById("phoneNumber").addEventListener("input", function () {
    const isValid = validatePhoneNumber(this.value);
    if (!isValid) {
        this.setCustomValidity("Please enter a valid South African phone number");
    } else {
        this.setCustomValidity("");
    }
});


function validateDateOfBirth(input) {
    const dob = new Date(input.value);
    const minDate = new Date("1990-01-01");
    const maxDate = new Date(); // Current date
    if (dob < minDate || dob > maxDate) {
        input.setCustomValidity('Date of birth must be between 1990 and the current year');
    } else {
        input.setCustomValidity('');
    }

    // Extract birthdate from student ID number (if available)
    // const studentIDNum = document.getElementById('studentIDNum').value;
    // if (studentIDNum.length === 13) { // Check if student ID number is valid
    //     const birthdateFromID = new Date(studentIDNum.substring(0, 6).replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3"));
    //     if (dob.getTime() !== birthdateFromID.getTime()) {
    //         input.setCustomValidity('Date of birth must match the student ID number');
    //     } else {
    //         input.setCustomValidity('');
    //     }
    // }
}



function validateNames(input) {
    const isValid = /^[A-Za-z]+$/.test(input.value);
    if (!isValid) {
        input.setCustomValidity("Must contain only alphabetic characters.");
    } else {
        input.setCustomValidity(""); // Reset validation message
    }
}

function matchGenderWithID(studentIDNum, genderID) {
    // Extract the gender digit from the student ID number
    const genderDigit = parseInt(studentIDNum.charAt(6));

    // Determine the expected gender based on the gender digit
    const expectedGender = (genderDigit % 2 === 0) ? "1" : "2"; // 1 for Female, 2 for Male

    // Compare the expected gender with the selected gender ID
    return expectedGender === genderID;
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


document.getElementById("genderID").addEventListener("change", function () {

    const studentIDNum = document.getElementById("studentIDNum").value

    const isValid = matchGenderWithID(studentIDNum, selectedGenderID);
    if (!isValid) {
        this.setCustomValidity("Gender must match ID Number");
    } else {
        this.setCustomValidity("");
    }

});





// const studentIDNum = "9706175213084"; // Example student ID number
// const selectedGenderID = document.getElementById("genderID").value; // Get the selected gender ID from the <select> element

// if (matchGenderWithID(studentIDNum, selectedGenderID)) {
//     // Gender matches the one derived from the ID number
//     console.log("Gender matches");
// } else {
//     // Gender does not match
//     console.log("Gender does not match");
// }
