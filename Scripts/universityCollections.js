const table = document.getElementById("dataTable");
const viewUniversityButtons = document.getElementsByClassName("viewUniversity");
const loadingScreen = document.getElementsByClassName("loadingScreen");

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
  const universityFormInputs = [
    {
      identifier: "amount",
      textContent: "Amount Requested:",
      placeholder: data.amountRequested,
      type: "number",
    },
  ];
  const modificationButtons = [
    { buttonClass: "updateData", textContent: "Update" },
    { buttonClass: "payUniversity", textContent: "Allocate Funds" },
  ];
  const form = formMaker({
    name,
    formInputArr: universityFormInputs,
    modButtonsArr: modificationButtons,
    status: data.applicationStatusID,
    allocationYear: data.applicationYear,
  });

  element.appendChild(form);

  const payUniversityButton = element.querySelector(".payUniversity");

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
        alert("Student Allocation successfully deleted.");
      } else {
        alert("Failed to delete student allocation");
      }
    })
    .catch((error) => {
      alert("Error:", error);
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
    const response = await fetch(
      "https://bursarywebapp.azurewebsites.net/api/BbdSpendings/2024"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    const BudgetAmount = responseData["totalBudget"];
    const availableFunds = responseData["amountRemaining"];

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

        const updateResponse = await fetch(
          "https://bursarywebapp.azurewebsites.net/api/BursaryAllocation",
          requestOptions
        );
        if (updateResponse.ok) {
          alert("Funds have been processed");
        } else {
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
