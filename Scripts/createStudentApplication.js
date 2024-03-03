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