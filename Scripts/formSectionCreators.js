function generateOptions(statusId) {
  const options = [
    { value: "1", text: "Pending" },
    { value: "2", text: "Approved" },
    { value: "3", text: "Rejected" },
  ];
  return options.map((option) => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.text = option.text;
    if (statusId == option.value) {
      opt.selected = true;
    }
    return opt;
  });
}

const inputSectionCreator = (className, inputObject, status) => {
  const formInput = document.createElement("section");
  formInput.className = className;
  for (const input of inputObject) {
    const { identifier, textContent, placeholder, type } = input;
    const elementLabel = document.createElement("label");
    elementLabel.htmlFor = identifier;
    elementLabel.textContent = textContent;
    formInput.appendChild(elementLabel);

    const inputElement = document.createElement("input");
    inputElement.className = "universalInput";
    inputElement.name = identifier;
    inputElement.id = identifier;
    inputElement.placeholder = placeholder;
    inputElement.type = type;
    if (status !== 1) {
      inputElement.disabled = true;
    }
    formInput.appendChild(inputElement);
  }
  return formInput;
};

const dropDownStatusSectionCreator = (className, inputObject, status) => {
  const statusSection = document.createElement("section");
  statusSection.className = className;
  for (const input of inputObject) {
    const { identifier, textContent } = input;
    const statusLabel = document.createElement("label");
    statusLabel.htmlFor = identifier;
    statusLabel.textContent = textContent;
    statusSection.appendChild(statusLabel);

    const statusSelect = document.createElement("select");
    statusSelect.className = "universalSelect";
    statusSelect.name = identifier;
    statusSelect.id = identifier;
    if (status !== 1) {
      statusSelect.disabled = true;
    }
    generateOptions(status).forEach((option) =>
      statusSelect.appendChild(option)
    );

    statusSection.appendChild(statusSelect);
  }

  return statusSection;
};

const buttonSectionCreator = (className, inputObject, status) => {
  const formInput = document.createElement("section");
  formInput.className = className;

  for (const input of inputObject) {
    const { buttonClass, textContent } = input;
    const buttonElement = document.createElement("button");
    buttonElement.className = buttonClass;
    buttonElement.textContent = textContent;
    buttonElement.type = "submit";
    formInput.appendChild(buttonElement);
    formInput.appendChild(buttonElement);
  }
  return formInput;
};
