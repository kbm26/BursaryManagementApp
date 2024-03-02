// Update the Budget for the year
document.getElementById("updateBudgetForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    try {
        // Fetch current budget data
        const response = await fetch("https://bursarywebapp.azurewebsites.net/api/BbdSpendings/2024");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        const oldBudgetAllocated = responseData["totalAmountAllocated"];
        const oldBudgetAmount = responseData["totalBudget"];

        // Get new budget amount from form input
        const newBudgetAmount = document.getElementById("newBudgetAmount").value;
        
        // Check that new budget is higher 
        if (newBudgetAmount > oldBudgetAmount) {

            const requestOptions = {
                method: "PUT",
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json-patch+json"
                },
                body: JSON.stringify({
                    budget: newBudgetAmount,
                    amountAllocated: oldBudgetAllocated,
                    budgetYear: new Date().getFullYear()
                })
            };

            // Send request to update the budget
            const updateResponse = await fetch("https://bursarywebapp.azurewebsites.net/api/BbdSpendings/2024", requestOptions);
            if (updateResponse.ok) {
                console.log("Budget updated successfully");
                
            } else {
                console.error("Error updating budget:", updateResponse.statusText);
                
            }
                
            }
        else {

            alert("New budget must be higher than old budget");

        }

        
    } catch (error) {
        console.error("Error:", error);
    }
});

