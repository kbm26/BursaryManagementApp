document
  .getElementById("updateBudgetForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://bursarywebapp.azurewebsites.net/api/BbdSpendings/2024"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const oldBudgetAllocated = responseData["totalAmountAllocated"];
      const oldBudgetAmount = responseData["totalBudget"];

      const newBudgetAmount = document.getElementById("newBudgetAmount").value;

      if (newBudgetAmount > oldBudgetAmount) {
        const requestOptions = {
          method: "PUT",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify({
            budget: newBudgetAmount,
            amountAllocated: oldBudgetAllocated,
            budgetYear: new Date().getFullYear(),
          }),
        };

        const updateResponse = await fetch(
          "https://bursarywebapp.azurewebsites.net/api/BbdSpendings/2024",
          requestOptions
        );
        if (updateResponse.ok) {
          alert("Budget updated successfully");
        } else {
          alert("Error updating budget:", updateResponse.statusText);
        }
      } else {
        alert("New budget must be higher than old budget");
      }
    } catch (error) {
      alert("Error:", error);
    }
  });
