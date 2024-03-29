const current = document.getElementById("current");
const total = document.getElementById("total");

async function universityBudgetFinder() {
  try {
    const tempUserId = localStorage.getItem("userID");
    if (!tempUserId) {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = `HOD User ID not found. ${
        tempUserId ? "Please retry later" : "Please allow cookies"
      }`;
      document.body.appendChild(errorMessage);
      return;
    }

    const url = `https://bursarywebapp.azurewebsites.net/api/Users/universityUserDetails/${window.atob(
      tempUserId
    )}`;

    const userDataResponse = await fetch(url);
    if (!userDataResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const userData = await userDataResponse.json();
    let universityID = userData.universityID;
    const allocationYear = new Date().getFullYear();

    const spendingsResponse = await fetch(
      `https://bursarywebapp.azurewebsites.net/api/UniversitySpendings?allocationYear=${allocationYear}&universityID=${universityID}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      }
    );

    if (!spendingsResponse.ok) {
      throw new Error(`HTTP error! status: ${spendingsResponse.status}`);
    }

    const responseData = await spendingsResponse.json();
    current.innerText = `Current Amount: R${responseData["amountRemaining"]}`;
    total.innerText = `Total Allocation: R${responseData["totalAmount"]}`;
  } catch (error) {
    console.error("Error:", error);
  }
}

universityBudgetFinder();
