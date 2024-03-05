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

    const optionElement = document.createElement("option");
    const optionName = document.createTextNode(
      optionalkey.length > 0
        ? `${uni[dataKey]} ${uni[optionalkey]}`
        : uni[dataKey]
    );
    optionElement.appendChild(optionName);
    optionalAttribute.length > 0
      ? optionElement.setAttribute("info", uni[optionalAttribute])
      : optionElement.setAttribute("value", i + 1);
    select.appendChild(optionElement);
  }
};
