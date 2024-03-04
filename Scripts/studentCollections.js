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
      name: `${student.studentFirstName} ${student.studentLastName} (ID: ${student.studentIDNum})`,
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
  const studentFormInputs = [
    {
      identifier: "amount",
      textContent: "Amount Requested:",
      placeholder: data.amount,
      type: "number",
    },
    {
      identifier: "courseYear",
      textContent: "Course Year:",
      placeholder: data.courseYear,
      type: "number",
    },
    {
      identifier: "studentMarks",
      textContent: "Student Mark:",
      placeholder: data.studentMarks,
      type: "number",
    },
  ];
  const modificationButtons = [
    { buttonClass: "updateData", textContent: "Update" }
  ];
  const form = formMaker({
    name,
    formInputArr: studentFormInputs,
    modButtonsArr: modificationButtons,
    status: data.applicationStatusID,
    downloadable: true,
    allocationYear: data.allocationYear,
  });

  element.appendChild(form);

  const downloadID = element.querySelector(".downloadID");
  const downloadAcademic = element.querySelector(".downloadAcademic");
  const createLinkButton = element.querySelector(".createLink");


  const fd = document.getElementById("fd");
  fd.addEventListener("submit", () => {
    event.preventDefault();
    const formData = new FormData(fd);
    UpdateStudentAllocation(
      formData.get("amount") ? formData.get("amount") : data.amount,
      data.allocationYear,
      data.studentIDNum,
      formData.get("studentMarks")
        ? formData.get("studentMarks")
        : data.studentMarks,
      formData.get("courseYear") ? formData.get("courseYear") : data.courseYear,
      formData.get("status")
        ? formData.get("status")
        : data.applicationStatusID,
      data.allocationID
    );
  });

  downloadID.addEventListener("click", (event) => {
    event.preventDefault();
    getStudentID(data.studentIDNum);
  });

  downloadAcademic.addEventListener("click", (event) => {
    event.preventDefault();
    getStudentAcademicTranscript(data.studentIDNum);
  });

  createLinkButton.addEventListener("click", (event) => {
    event.preventDefault();
    generateLinkandEmail(data.studentIDNum, data.email);
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
  
  const options = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json-patch+json",
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
  } catch (error) {
    console.log("Error:", error);
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
        alert("Student Allocation successfully deleted.");
      } else {
        alert("Cannot delete application under review");
        alert(
          "Failed to delete student allocation. It has an assigned reviewer"
        );
      }
    })
    .catch((error) => {
      alert("Error:", error);
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
  // const tempUserId = localStorage.getItem("userID");
  const tempUserId = 1;
  if (tempUserId) {
    // const url = `https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/user/${window.atob(
    //   tempUserId
    // )}`;
    const url = `https://bursarywebapp.azurewebsites.net/api/StudentsAllocation/user/1`;
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
        students = data.sort((a, b) => {
          return b.allocationYear - a.allocationYear;
        });
        tableUpdater(data);
      })
      .catch((error) => {
        alert("Error:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "An error occurred while fetching data.";
        document.body.appendChild(errorMessage);
      });
  } else {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = `HOD User ID not found. ${
      tempUserId ? "Please retry later" : "Please allow cookies"
    }`;
    document.body.appendChild(errorMessage);
  }
}

nameFilter.addEventListener("click", (e) => {
  e.preventDefault();
  const sortedStudentsAsc = students.slice().sort((a, b) => {
    const nameA = a.studentFirstName;
    const nameB = b.studentFirstName;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
  const sortedStudentsDec = students.slice().sort((a, b) => {
    const nameA = a.studentFirstName;
    const nameB = b.studentFirstName;
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });

  tableUpdater(
    students[0]["studentFirstName"] == sortedStudentsAsc[0]["studentFirstName"]
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
