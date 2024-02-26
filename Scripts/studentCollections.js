const students = [
    {
      applicationID: 1,
      status: "pending",
      amountRequested: 360000,
      name: "John Hendrick",
      applicationYear: 2022,
      isLocked: true,
    },
    {
      applicationID: 2,
      status: "approved",
      amountRequested: 288000,
      name: "Naoimi Wes",
      applicationYear: 2022,
      isLocked: true,
    },
    {
      applicationID: 3,
      status: "rejected",
      amountRequested: 240000,
      name: "Jenny Jakes",
      applicationYear: 2022,
      isLocked: true,
    },
    {
      applicationID: 4,
      status: "pending",
      amountRequested: 192000,
      name: "Riri Wreck",
      applicationYear: 2022,
      isLocked: true,
    },
    {
      applicationID: 5,
      status: "pending",
      amountRequested: 192000,
      name: "Riri Wreck",
      applicationYear: 2022,
      isLocked: true,
    },
    {
      applicationID: 6,
      status: "pending",
      amountRequested: 240000,
      name: "Naoimi Wes",
      applicationYear: 2022,
      isLocked: true,
    },
    {
      applicationID: 7,
      status: "pending",
      amountRequested: 168000,
      name: "Jenny Jakes",
      applicationYear: 2022,
      isLocked: true,
    },
    {
      applicationID: 8,
      status: "pending",
      amountRequested: 360000,
      name: "Riri Wreck",
      applicationYear: 2022,
      isLocked: true,
    },
    {
      applicationID: 9,
      status: "pending",
      amountRequested: 192000,
      name: "Riri Wreck",
      applicationYear: 2022,
      isLocked: true,
    },
    {
      applicationID: 10,
      status: "pending",
      amountRequested: 168000,
      name: "Naoimi Wes",
      applicationYear: 2022,
      isLocked: true,
    },
    {
      applicationID: 11,
      status: "pending",
      amountRequested: 180000,
      name: "John Hendrick",
      applicationYear: 2023,
      isLocked: true,
    },
    {
      applicationID: 12,
      status: "pending",
      amountRequested: 144000,
      name: "Naoimi Wes",
      applicationYear: 2023,
      isLocked: true,
    },
    {
      applicationID: 13,
      status: "pending",
      amountRequested: 120000,
      name: "Jenny Jakes",
      applicationYear: 2023,
      isLocked: true,
    },
    {
      applicationID: 14,
      status: "pending",
      amountRequested: 96000,
      name: "Riri Wreck",
      applicationYear: 2023,
      isLocked: true,
    },
    {
      applicationID: 15,
      status: "pending",
      amountRequested: 96000,
      name: "Riri Wreck",
      applicationYear: 2023,
      isLocked: true,
    },
    {
      applicationID: 16,
      status: "pending",
      amountRequested: 120000,
      name: "Naoimi Wes",
      applicationYear: 2023,
      isLocked: true,
    },
    {
      applicationID: 17,
      status: "pending",
      amountRequested: 84000,
      name: "Jenny Jakes",
      applicationYear: 2023,
      isLocked: true,
    },
    {
      applicationID: 18,
      status: "pending",
      amountRequested: 180000,
      name: "Riri Wreck",
      applicationYear: 2023,
      isLocked: true,
    },
    {
      applicationID: 19,
      status: "pending",
      amountRequested: 96000,
      name: "Riri Wreck",
      applicationYear: 2023,
      isLocked: true,
    },
    {
      applicationID: 20,
      status: "pending",
      amountRequested: 84000,
      name: "Naoimi Wes",
      applicationYear: 2023,
      isLocked: true,
    },
  ];
  
  const table = document.getElementById("dataTable");
  
  students.forEach((uni, i) => {
    rowAdder(table, i, uni);
  });
  
  statusColorCoder();
  
  const userDataInserter = ({ name, element, data }) => {
    element.innerHTML = ` <form action="">
        <h1>${name}(${data.applicationYear})</h1>
        <section class="formInput">
          <label for="status">Application Status:</label>
          <select disabled name="Status" id="status">
          <option ${
            data.status == "pending" && "selected"
          } value="1">Pending</option>
          <option ${
            data.status == "approved" && "selected"
          } value="2">Approved</option>
          <option ${
            data.status == "rejected" && "selected"
          } value="3">Rejected</option>
        </select>
        </section>
        <section class="formInput">
          <label for="name">Amount Requested:</label>
          <input class="userData" disabled placeholder=${
            data.amountRequested
          }  type="number" name="name">
        </section>
        <section class="dataModButtons">
        <button class="deleteData" type="submit">Delete</button>
        <button class="updateData" type="submit">Update</button>
        </section>
      </form>`;
  };
  
  const viewUniversityButtons = document.getElementsByClassName("viewUniversity");
  
  const redirectToStudentInfo = (e) => {
    const tableRow = e.target.parentNode.parentNode;
    const uniName = tableRow.childNodes[0].textContent;
    const rowPos = parseInt(tableRow.id) + 2;
  
    if (e.target.textContent == "View") {
      for (const b of viewUniversityButtons) b.setAttribute("disabled", "");
      e.target.textContent = "Close";
      const infoCell = table.insertRow(rowPos).insertCell(0);
      infoCell.classList.add("info");
      infoCell.setAttribute("colspan", 3);
      infoCell.parentNode.id = `info-${rowPos}`;
      userDataInserter({
        name: uniName,
        element: infoCell,
        data: students[tableRow.id],
      });
      setTimeout(() => {
        infoCell.style.height = "max-content";
        infoCell.style.padding = "10vh 5vw";
        infoCell.style.opacity = "1";
      }, 100);
      e.target.removeAttribute("disabled");
    } else if (e.target.textContent == "Close") {
      for (const b of viewUniversityButtons) b.removeAttribute("disabled");
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
  
  for (const b of viewUniversityButtons)
    b.addEventListener("click", redirectToStudentInfo);
  