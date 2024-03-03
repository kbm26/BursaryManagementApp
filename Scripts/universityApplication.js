// Create a New University Application for funding from BBD 
document.getElementById('postForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const tempUserId = sessionStorage.getItem("userID");
    if (!tempUserId) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "HOD User ID not found. Please allow cookies";
        document.body.appendChild(errorMessage);
        return; 
    }

    try {
        const url = `https://bursarywebapp.azurewebsites.net/api/Users/universityUserDetails/${window.atob(tempUserId)}`;
        const userDataResponse = await fetch(url);
        if (!userDataResponse.ok) {
            throw new Error("Network response was not ok");
        }
        const userData = await userDataResponse.json();
        console.log(userData);
        const HODUniversityID = userData.universityID;

        // Get form input values
        const formData = new FormData(event.target);
        const postData = {};
        formData.forEach((value, key) => {
            postData[key] = value;
        });

        // Set the UniversityID as the retrieved ID
        postData.universityID = HODUniversityID;

        // Define request options
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        };

        fetch('https://bursarywebapp.azurewebsites.net/api/UniversityApplication', requestOptions)
            .then(response => {
                if (response.ok) {
                    document.getElementById("successMessage").textContent = "Application Submitted";
                } else {
                    document.getElementById("successMessage").textContent = "Application for year already exists";
                }
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    } catch (error) {
        console.error("Error:", error);
    }
});



