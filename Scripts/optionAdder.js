// const unis = [
//   { uniName: "ste" },
//   { uniName: "ste" },
//   { uniName: "ste" },
//   { uniName: "ste" },
//   { uniName: "ste" },
// ];
//select element
const selectButton = document.getElementById("universityID");

const selectDropDownDataInserter = ({
  listOfData,
  select,
  optionalkey = "",
  dataKey,
  optionalAttribute = "",
}) => {
  for (let i = 0; i < listOfData.length; i++) {
    const uni = listOfData[i];

    //creating a option for the select drop down
    const optionElement = document.createElement("option");
    //dataKey is the name of the key, so in my case it was uniName, in our case it would be UniversityName of something
    const optionName = document.createTextNode(
      optionalkey.length > 0
        ? `${uni[dataKey]} ${uni[optionalkey]}`
        : uni[dataKey]
    );
    optionElement.appendChild(optionName);
    // optionElement.setAttribute("value", i + 1)
    optionalAttribute.length > 0
      ? optionElement.setAttribute("info", uni[optionalAttribute])
      : optionElement.setAttribute("value", i + 1);
    select.appendChild(optionElement);
  }
};

//only change the values, keep the keys the same
// selectDropDownDataInserter({
//   listOfData: unis,
//   select: selectButton,
//   dataKey: "uniName",
// });
