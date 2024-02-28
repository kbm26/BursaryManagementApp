const table = document.getElementById("dataTable");
const viewUniversityButtons = document.getElementsByClassName("viewUniversity");

let unis

function tableMaker(list){
  list.forEach((uni, i) => {
    rowAdder(table, i, {name: uni.universityName, status: uni.applicationStatusID === 1 ?
       "pending" : uni.applicationStatusID === 2?
      "approved" : "rejected" });
  });
}

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


const redirectToUniInfo = (e) => {
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
      data: unis[tableRow.id],
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


async function getAllApplications(){

  fetch("https://bursarywebapp.azurewebsites.net/api/UniversityApplication/getAllUniversityApplicationsWithName")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(jsonData => {
      unis = jsonData
      tableMaker(jsonData);
      statusColorCoder();
      for (const b of viewUniversityButtons)
      b.addEventListener("click", redirectToUniInfo);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

getAllApplications()














