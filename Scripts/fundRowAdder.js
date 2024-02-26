const fundRowAdder = (table, index, { name, amountRequested }) => {
    let row = table.insertRow(-1);
    row.id = index;
    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);
  
    const requestedAllocatedAmount = document.createElement("button");
    const viewButton = document.createElement("button");
    requestedAllocatedAmount.textContent = `R${amountRequested}`;
    viewButton.textContent = "View";
    requestedAllocatedAmount.classList.add("fundAllocation");
    viewButton.classList.add("viewUniversity");
  
    c1.innerText = name;
    c2.appendChild(requestedAllocatedAmount);
    c3.appendChild(viewButton);
  };