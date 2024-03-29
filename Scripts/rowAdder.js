const rowAdder = (table, index, { name, status }) => {
  let row = table.insertRow(-1);
  row.id = index;
  let c1 = row.insertCell(0);
  let c2 = row.insertCell(1);
  let c3 = row.insertCell(2);

  const statusButton = document.createElement("p");
  const viewButton = document.createElement("button");
  statusButton.textContent = status;
  viewButton.textContent = "View";
  statusButton.classList.add("status");
  viewButton.classList.add("viewUniversity");

  c1.innerText = name;
  c2.appendChild(statusButton);
  c3.appendChild(viewButton);
};
