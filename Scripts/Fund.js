const current = document.getElementById("Current");
const total = document.getElementById("Total");

async function fundFinder(){
    try {
        const response = await fetch("https://bursarywebapp.azurewebsites.net/api/BbdSpendings/GetCurrentBudget");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        current.innerText = `Current Amount: R${responseData["remaining"]}`;
        total.innerText = `Total Allocation: R${responseData["budget"]}`;
        console.log('Response:', responseData);
      } catch (error) {
        console.error('Error:', error);
      }
};

fundFinder();