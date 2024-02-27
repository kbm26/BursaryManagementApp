/*
 Get All the student Allocations for a university ID 
 userId needs to be in URL e.g https://ukukhulabursary.netlify.app/hod/studentcollection?userId=10
 */

document.addEventListener('DOMContentLoaded', function () {
    // Extract userID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    // console.log(window.location.href.split('/').at(-1).split('=').at(-1));
    
    // Check if userID exists
    if (userId) {
        // Url for API Endpoint, passes UserId 
        const url = `https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/user/${userId}`;

        // AJAX (Asynchronous JavaScript and XML) GET request to the API endpoint
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                // Process the response data and display it in the table
                displayStudentAllocations(data);
            })
            .catch(error => {
                console.error('Error:', error);
                // Display error message to the user
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'An error occurred while fetching data.';
                document.body.appendChild(errorMessage);
            });
    } else {
        // Display error message if userID is not provided in the URL
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'HOD User ID not found in the URL.';
        document.body.appendChild(errorMessage);
    }
});

function displayStudentAllocations(data) {
    const studentAllocationsTableBody = document.getElementById('studentAllocationsTableBody');
    studentAllocationsTableBody.innerHTML = ''; // Clear previous data
    
    // Iterate over the data and create table rows
    data.forEach(allocation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${allocation.allocationID}</td>
            <td>${allocation.amount}</td>
            <td>${allocation.allocationYear}</td>
            <td>${allocation.studentIDNum}</td>
        `;
        studentAllocationsTableBody.appendChild(row);
    });
}
