const current = document.getElementById("current");
const total = document.getElementById("total");

// Get the Balance of spendings for a particular university 
async function fundFinder(allocationYear, universityID) {
    try {
        const response = await fetch(`https://bursarywebapp.azurewebsites.net/api/UniversitySpendings?allocationYear=${allocationYear}&universityID=${universityID}`, {
            method: "GET",
            headers: {
                "accept": "*/*"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        current.innerText = `Current Amount: R${responseData["amountRemaining"]}`;
        total.innerText = `Total Allocation: R${responseData["totalAmount"]}`;
        console.log('Response:', responseData);
    } catch (error) {
        console.error('Error:', error);
    }
}

fundFinder(2024,1);