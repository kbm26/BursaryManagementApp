const table = document.getElementById("dataTable");
const viewUniversityButtons = document.getElementsByClassName("viewUniversity");

let students;

const tableMaker = (data) => {
  data.forEach((student, i) => {
    rowAdder(table, i, {
      name: `${student.firstName} ${student.lastName} (ID: ${student.studentIdNumber})`,
      status:
        student.applicationStatusID === 1
          ? "pending"
          : student.applicationStatusID === 2
          ? "approved"
          : "rejected",
    });
  });
};

const userDataInserter = ({ name, element, data }) => {
  element.innerHTML = ` <form action="">
      <h1>${name}(${data.allocationYear})</h1>
      <section class="formInput">
        <label for="status">Application Status:</label>
        <select disabled name="Status" id="status">
        <option ${
          data.applicationStatusID == "1" && "selected"
        } value="1">Pending</option>
        <option ${
          data.applicationStatusID == "2" && "selected"
        } value="2">Approved</option>
        <option ${
          data.applicationStatusID == "3" && "selected"
        } value="3">Rejected</option>
      </select>
      </section>
      <section class="formInput">
        <label for="name">Amount Requested:</label>
        <input class="userData" disabled placeholder=${
          data.amount
        }  type="number" name="name">
      </section>
      <section class="dataModButtons">
      <button class="deleteData" type="submit" allocationID="${data.allocationID}">Delete</button>
      <button class="updateData" type="submit">Update</button>
      </section>
    </form>`;

    // Event listener to the delete button
    const deleteButton = element.querySelector(".deleteData");
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent page from reloading when delete is clicked
      const allocationID = deleteButton.getAttribute("allocationID");
      deleteStudentAllocation(allocationID);
    });

};


// Delete the Allocation with AllocationID attached to button
function deleteStudentAllocation(allocationID) {
  fetch(`https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/${allocationID}`, {
    method: "DELETE",
    headers: {
      "accept": "*/*"
    }
  })
  .then(response => {
    if (response.ok) {
      console.log("Student Allocation successfully deleted.");
    } else {
      console.error("Failed to delete student allocation");
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });
}

const redirectToStudentInfo = (e) => {
  const tableRow = e.target.parentNode.parentNode;
  const uniName = tableRow.childNodes[0].textContent;
  const rowPos = parseInt(tableRow.id) + 2;
  console.log(tableRow)
  if (e.target.textContent == "View") {
    for (const b of viewUniversityButtons) b.setAttribute("disabled", "");
    e.target.textContent = "Close";
    const infoCell = table.insertRow(rowPos).insertCell(0);
    infoCell.classList.add("info");
    infoCell.setAttribute("colspan", 3);
    infoCell.parentNode.id = `info-${rowPos}`;
    userDataInserter({
      name: uniName,
      element: infoCell,
      data: students[tableRow.id],
    });
    setTimeout(() => {
      infoCell.style.height = "max-content";
      infoCell.style.padding = "10vh 5vw";
      infoCell.style.opacity = "1";
    }, 100);
    e.target.removeAttribute("disabled");
  } else if (e.target.textContent == "Close") {
    for (const b of viewUniversityButtons) b.removeAttribute("disabled");
    const infoStyle = document.getElementsByClassName("info")[0].style;
    infoStyle.height = "0vh";
    infoStyle.padding = "0px";
    infoStyle.opacity = "0";
    setTimeout(() => {
      document.getElementById(`info-${rowPos}`).remove();
      e.target.textContent = "View";
    }, 860);
  }
};

async function getAllApplications() {

    const url = `https://localhost:7162/api/StudentsAllocation/GetAllStudentAllocationsPro`;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        students = data;
        tableMaker(data);
        statusColorCoder();
        for (const b of viewUniversityButtons)
          b.addEventListener("click", redirectToStudentInfo);
      })
      .catch((error) => {
        console.error("Error:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "An error occurred while fetching data.";
        document.body.appendChild(errorMessage);
      });
  
}




getAllApplications();
