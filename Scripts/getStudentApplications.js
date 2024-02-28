document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (userId) {
    const url = `https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/user/${userId}`;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        displayStudentAllocations(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "An error occurred while fetching data.";
        document.body.appendChild(errorMessage);
      });
  } else {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "HOD User ID not found in the URL.";
    document.body.appendChild(errorMessage);
  }
});

function displayStudentAllocations(data) {
  const studentAllocationsTableBody = document.getElementById(
    "studentAllocationsTableBody"
  );
  studentAllocationsTableBody.innerHTML = "";

  data.forEach((allocation) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${allocation.allocationID}</td>
            <td>${allocation.amount}</td>
            <td>${allocation.allocationYear}</td>
            <td>${allocation.studentIDNum}</td>
            <td>${allocation.studentMarks}</td>
            <td>${allocation.courseYear}</td>
            <td>${allocation.applicationStatusID}</td>
            <td>${allocation.uniName}</td>
        `;
    studentAllocationsTableBody.appendChild(row);
  });
}
