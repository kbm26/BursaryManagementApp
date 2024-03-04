const current = document.getElementById("Current");
const total = document.getElementById("Total");

async function fundFinder() {
  try {
    // Changed to fetch from BBDSpendings endpoint
    const response = await fetch(
      "https://bursarywebapp.azurewebsites.net/api/BbdSpendings/2024"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    current.innerText = `Current Amount: R${responseData["amountRemaining"]}`;
    total.innerText = `Total Allocation: R${responseData["totalBudget"]}`;
  } catch (error) {
    alert("Error:", error);
  }
}

fundFinder();
