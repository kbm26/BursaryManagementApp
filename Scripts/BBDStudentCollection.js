const table = document.getElementById("dataTable");
const viewUniversityButtons = document.getElementsByClassName("viewUniversity");
const nameFilter = document.getElementById("nameFilter");
const approvedFilter = document.getElementById("approvedFilter");
const pendingFilter = document.getElementById("pendingFilter");
const rejectedFilter = document.getElementById("rejectedFilter");
const loadingScreen = document.getElementsByClassName("loadingScreen");

let students;
let tempStudents;

const tableMaker = (data) => {
  data.forEach((student, i) => {
    rowAdder(table, i, {
      name: `${student.firstName} ${student.lastName} (${student.university})`,
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
  console.log(data);
  element.innerHTML = ` <form  id="fd" action="">
      <h1>${name}(${data.allocationYear})</h1>
      <section class="formInput">
        <label for="status">Application Status:</label>
        <select ${
          data.applicationStatusID !== 1 && "disabled"
        } name="Status" id="status">
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
        <label for="amount">Amount Requested:</label>
        <input class="universalInput" ${
          data.applicationStatusID !== 1 && "disabled"
        }  placeholder=${
    data.amount
  }  type="number" name="amount">
        <label for="courseYear">Course Year:</label>
        <input class="universalInput" ${
          data.applicationStatusID !== 1 && "disabled"
        }  placeholder=${
    data.courseYear
  }  type="number" name="courseYear">
        <label for="studentMarks">Student Mark:</label>
        <input class="universalInput" ${
          data.applicationStatusID !== 1 && "disabled"
        }  placeholder=${
    data.studentMarks
  }  type="number" name="studentMarks">
      </section>
      <section class="dataModButtons">
      <button class="deleteData" type="submit">Delete</button>
      <button class="updateData" type="submit">Update</button>
      </section>
      <section class="dataModButtons">
      <button class="downloadID" type="submit">Download ID</button>
      <button class="downloadAcademic" type="submit">Download Academic</button>
      <button class="createLink" type="submit">Send Link</button>
      </section>
    </form>`;

  const deleteButton = element.querySelector(".deleteData");
  const downloadID = element.querySelector(".downloadID");
  const downloadAcademic = element.querySelector(".downloadAcademic");
  const createLinkButton = element.querySelector(".createLink");

  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    deleteStudentAllocation(data.allocationID);
  });

  const fd = document.getElementById("fd");
  fd.addEventListener("submit", () => {
    event.preventDefault();
    const formData = new FormData(fd);
    UpdateStudentAllocation(
      formData.get("amount") ? formData.get("amount") : data.amountRequested,
      data.allocationYear,
      data.studentIdNumber,
      formData.get("studentMarks")
        ? formData.get("studentMarks")
        : data.studentMarks,
      data.courseYear,
      formData.get("Status")
        ? formData.get("Status")
        : data.applicationStatusID,
      data.allocationID
    );
  });

  downloadID.addEventListener("click", (event) => {
    event.preventDefault();
    getStudentID(data.studentIdNumber);
  });

  downloadAcademic.addEventListener("click", (event) => {
    event.preventDefault();
    getStudentAcademicTranscript(data.studentIdNumber);
  });

  createLinkButton.addEventListener("click", (event) => {
    event.preventDefault();
    generateLinkandEmail(data.studentIdNumber, data.email);
  });
};

async function UpdateStudentAllocation(
  amount,
  allocationYear,
  studentIDNum,
  studentMarks,
  courseYear,
  applicationStatusID,
  allocationID
) {
  const url = "https://bursarywebapp.azurewebsites.net/api/StudentsAllocation";
  const data = {
    amount: amount,
    allocationYear: allocationYear,
    studentIDNum: studentIDNum,
    studentMarks: studentMarks,
    courseYear: courseYear,
    applicationStatusID: applicationStatusID,
    allocationID: allocationID,
  };
  console.log(data);
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json-patch+json",
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log("Response:", responseData);
  } catch (error) {
    console.error("Error:", error);
  }
}

function deleteStudentAllocation(allocationID) {
  fetch(
    `https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/${allocationID}`,
    {
      method: "DELETE",
      headers: {
        accept: "*/*",
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        console.log("Student Allocation successfully deleted.");
      } else {
        alert("Cannot delete application under review");
        console.error(
          "Failed to delete student allocation. It has an assigned reviewer"
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const redirectToStudentInfo = (e) => {
  const tableRow = e.target.parentNode.parentNode;
  const uniName = tableRow.childNodes[0].textContent;
  const rowPos = parseInt(tableRow.id) + 1;

  if (e.target.textContent == "View") {
    const viewButtons = document.getElementsByClassName("viewUniversity");

    for (let i = 0; i < students.length + 2; i++) {
      if (i !== rowPos && document.getElementById(`info-${i}`)) {
        document.getElementById(`info-${i}`).remove();
      }

      if (document.getElementById(i)) viewButtons[i].textContent = "View";
    }
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
  } else if (e.target.textContent == "Close") {
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

const tableUpdater = (data) => {
  table.innerHTML = "";
  students = data;
  tableMaker(data);
  statusColorCoder();
  for (const b of viewUniversityButtons)
    b.addEventListener("click", redirectToStudentInfo);
};

async function getAllApplications() {
  const url = `https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/GetAllStudentAllocationsPro`;
  loadingScreen[0].style.opacity = 1;
  loadingScreen[0].style.height = "70vh";

  fetch(url)
    .then((response) => {
      table.innerHTML = "";
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((data) => {
      loadingScreen[0].style.opacity = 0;
      loadingScreen[0].style.height = "0vh";
      tempStudents = data.sort((a, b) => {
        return b.allocationYear - a.allocationYear;
      });
      tableUpdater(
        data.sort((a, b) => {
          return b.allocationYear - a.allocationYear;
        })
      );
    })
    .catch((error) => {
      console.error("Error:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "An error occurred while fetching data.";
      document.body.appendChild(errorMessage);
    });
}

nameFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const sortedStudentsAsc = students.slice().sort((a, b) => {
    const nameA = a.firstName;
    const nameB = b.firstName;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });
  const sortedStudentsDec = students.slice().sort((a, b) => {
    const nameA = a.firstName;
    const nameB = b.firstName;
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }

    return 0;
  });

  tableUpdater(
    students[0]["firstName"] == sortedStudentsAsc[0]["firstName"]
      ? sortedStudentsDec
      : sortedStudentsAsc
  );
});

approvedFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const approvedStudents = tempStudents.filter(
    (student) => student.applicationStatusID === 2
  );

  tableUpdater(
    students.length === approvedStudents.length
      ? tempStudents
      : approvedStudents
  );
});

pendingFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const pendingStudents = tempStudents.filter(
    (student) => student.applicationStatusID === 1
  );

  tableUpdater(
    students.length === pendingStudents.length ? tempStudents : pendingStudents
  );
});

rejectedFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const rejectedStudents = tempStudents.filter(
    (student) => student.applicationStatusID === 3
  );

  tableUpdater(
    students.length === rejectedStudents.length
      ? tempStudents
      : rejectedStudents
  );
});

getAllApplications();
