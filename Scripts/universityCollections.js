const table = document.getElementById("dataTable");
const viewUniversityButtons = document.getElementsByClassName("viewUniversity");

let unis;

function tableMaker(list) {
  list.forEach((uni, i) => {
    rowAdder(table, i, {
      name: uni.universityName,
      status:
        uni.applicationStatusID === 1
          ? "pending"
          : uni.applicationStatusID === 2
          ? "approved"
          : "rejected",
    });
  });
}

const userDataInserter = ({ name, element, data }) => {
  console.log(data);
  element.innerHTML = ` <form id="fd" action="">
      <h1>${name}(${data.applicationYear})</h1>
      <section class="formInput">
        <label for="status">Application Status:</label>
       <select name="Status" id="status">
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
        <input class="userData" id="amount" placeholder=${
          data.amountRequested
        }  type="number" name="name">
        <button class="lock-button" value=true>LOCKED</button>
      </section>
      <section class="dataModButtons">
      <button class="deleteData" applicationID=${
        data.applicationID
      } type="submit">Delete</button>
      <button class="updateData" applicationID=${data.applicationID} 
      oldamountRequested=${data.amountRequested}
      applicationYear=${data.applicationYear}
      isLocked=${data.isLocked}
      universityID=${data.universityID}
      type="submit">Update</button>
      </section>
    </form>`;

  const deleteButton = element.querySelector(".deleteData");
  const updateButton = element.querySelector(".updateData");
  const lockButton = element.querySelector(".lock-button");

  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    const allocationID = deleteButton.getAttribute("applicationID");
    deleteApplication(allocationID);
  });

  updateButton.addEventListener("click", (event) => {
    event.preventDefault();
    const allocationID = deleteButton.getAttribute("applicationID");
    const status = document.getElementById("status").value;
    const amount =
      document.getElementById("amount").value == ""
        ? updateButton.getAttribute("oldamountRequested")
        : document.getElementById("amount").value;
    const universityID = updateButton.getAttribute("universityID");
    const applicationYear = updateButton.getAttribute("applicationYear");
    const isLocked = lockButton.value === "true";
    updateApplication(
      allocationID,
      status,
      amount,
      universityID,
      applicationYear,
      isLocked
    );
  });

  lockButton.addEventListener("click", (event) => {
    event.preventDefault();
    lockButton.innerText =
      lockButton.innerText === "UNLOCKED" ? "LOCKED" : "UNLOCKED";
    lockButton.value = lockButton.value === "true" ? "false" : "true";
  });
};

async function updateApplication(
  applicationID,
  applicationStatusID,
  amountRequested,
  universityID,
  applicationYear,
  isLocked
) {
  const url =
    "https://bursarywebapp.azurewebsites.net/api/UniversityApplication";

  const data = {
    applicationID: applicationID,
    applicationStatusID: applicationStatusID,
    amountRequested: amountRequested,
    universityID: universityID,
    applicationYear: applicationYear,
    isLocked: isLocked,
  };
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
    // Handle response data here
  } catch (error) {
    console.error("Error:", error);
    // Handle errors here
  }
}

function deleteApplication(allocationID) {
  fetch(
    `https://bursarywebapp.azurewebsites.net/api/UniversityApplication/${allocationID}`,
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
        console.error("Failed to delete student allocation");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const redirectToUniInfo = (e) => {
  const tableRow = e.target.parentNode.parentNode;
  const uniName = tableRow.childNodes[0].textContent;
  const rowPos = parseInt(tableRow.id) + 2;

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
      data: unis[tableRow.id],
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
  fetch(
    "https://bursarywebapp.azurewebsites.net/api/UniversityApplication/getAllUniversityApplicationsWithName"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((jsonData) => {
      unis = jsonData;
      tableMaker(jsonData);
      statusColorCoder();
      for (const b of viewUniversityButtons)
        b.addEventListener("click", redirectToUniInfo);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

getAllApplications();

// {
//   //Data object
//   amountRequested, +
//   applicationID, +
//   applicationStatusID, +
//   applicationYear, +
//   isLocked, +
//   universityID, +
//   universityName
// }
