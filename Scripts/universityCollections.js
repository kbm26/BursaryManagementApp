const table = document.getElementById("dataTable");
const viewUniversityButtons = document.getElementsByClassName("viewUniversity");
const loadingScreen = document.getElementsByClassName("loadingScreen");

let unis;

function tableMaker(list) {
  list.forEach((uni, i) => {
    rowAdder(
      table,
      i,
      {
        name: uni.universityName,
        status:
          uni.applicationStatusID === 1
            ? "pending"
            : uni.applicationStatusID === 2
            ? "approved"
            : "rejected",
      },
      true
    );
  });
}

const userDataInserter = ({ name, element, data }) => {
  element.innerHTML = ` <form id="fd" action="">
      <h1>${name}(${data.applicationYear})</h1>
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
        <input ${
          data.applicationStatusID !== 1 && "disabled"
        } class="userData" id="amount" placeholder=${
    data.amountRequested
  }  type="number" name="amount">
        <button type="button" class="lock-button" value=true>${
          data.isLocked === true ? "LOCKED" : "UNLOCKED"
        }</button>
      </section>
      <section class="dataModButtons">
      <button class="deleteData" type="submit">Delete</button>
      <button class="updateData" type="submit">Update</button>
      <button class="payUniversity" type="submit">Allocate Funds</button>
      </section>
    </form>`;

  const deleteButton = element.querySelector(".deleteData");
  const lockButton = element.querySelector(".lock-button");
  const payUniversityButton = element.querySelector(".payUniversity");

  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    deleteApplication(data.applicationID);
  });

  lockButton.addEventListener("click", (event) => {
    event.preventDefault();
    lockButton.innerText =
      lockButton.innerText === "UNLOCKED" ? "LOCKED" : "UNLOCKED";
    lockButton.value = lockButton.value === "true" ? "false" : "true";
  });

  payUniversityButton.addEventListener("click", (event) => {
    event.preventDefault();
    payMoneytoUniversity(
      data.universityID,
      data.applicationID,
      data.amountRequested,
      data.applicationStatusID
    );
  });

  const fd = document.getElementById("fd");
  fd.addEventListener("submit", () => {
    event.preventDefault();
    const formData = new FormData(fd);
    const isLocked = lockButton.value === "true";
    const amount = formData.get("amount")
      ? formData.get("amount")
      : data.amountRequested;
    updateApplication(
      data.applicationID,
      formData.get("Status"),
      amount,
      data.universityID,
      data.applicationYear,
      isLocked
    );
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
  } catch (error) {
    console.error("Error:", error);
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
  const rowPos = parseInt(tableRow.id) + 1;

  if (e.target.textContent == "View") {
    const viewButtons = document.getElementsByClassName("viewUniversity");

    for (let i = 0; i < unis.length + 2; i++) {
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
      data: unis[tableRow.id],
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

async function getAllApplications() {
  loadingScreen[0].style.opacity = 1;
  loadingScreen[0].style.height = "70vh";
  fetch(
    "https://bursarywebapp.azurewebsites.net/api/UniversityApplication/getAllUniversityApplicationsWithName"
  )
    .then((response) => {
      table.innerHTML = "";
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((jsonData) => {
      loadingScreen[0].style.opacity = 0;
      loadingScreen[0].style.height = "0vh";
      unis = jsonData.sort((a, b) => {
        return b.applicationYear - a.applicationYear;
      });
      tableMaker(jsonData);
      statusColorCoder();
      for (const b of viewUniversityButtons)
        b.addEventListener("click", redirectToUniInfo);
      const universityNames = document.getElementsByClassName("studentViewer");

      for (let i = 0; i < universityNames.length; i++) {
        const uni = universityNames[i];
        uni.addEventListener("click", (e) => {
          e.preventDefault();
          sessionStorage.getItem("uniID") && sessionStorage.removeItem("uniID");
          sessionStorage.setItem(
            "uniID",
            window.btoa(unis[i + 1].universityID)
          );
          window.location.href = "/bbd/selectedUnivirsityStudentsCollection";
        });
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

getAllApplications();

async function payMoneytoUniversity(
  universityID,
  applicationID,
  amountRequested,
  applicationStatusID
) {
  try {
    // Fetch current budget data NB: Changed endpoint
    const response = await fetch(
      "https://bursarywebapp.azurewebsites.net/api/BbdSpendings/2024"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    const BudgetAmount = responseData["totalBudget"];
    const availableFunds = responseData["amountRemaining"];

    // Check that you have funds available
    if (amountRequested <= availableFunds) {
      if (applicationStatusID == 2) {
        const requestOptions = {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify({
            universityID,
            amountAlloc: amountRequested,
            allocationYear: new Date().getFullYear(),
            universityApplicationID: applicationID,
          }),
        };

        // Send request to update the budget
        const updateResponse = await fetch(
          "https://bursarywebapp.azurewebsites.net/api/BursaryAllocation",
          requestOptions
        );
        if (updateResponse.ok) {
          console.log("Budget updated successfully");
          alert("Funds have been processed");
        } else {
          console.error("Error updating budget:", updateResponse.statusText);
          console.log(updateResponse.statusText);
          alert("You have already allocated funds to this application");
        }
      } else {
        alert("This application has not been approved");
      }
    } else {
      alert("Insufficient funds for this allocation");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}