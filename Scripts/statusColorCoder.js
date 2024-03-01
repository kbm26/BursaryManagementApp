const statusColorCoder = () => {
  const statuses = document.querySelectorAll(".status");
  for (const status of statuses) {
    switch (status.innerHTML) {
      case "pending":
        status.style.color = "#f2953fc6";
        break;
      case "approved":
        status.style.color = "#23c68b";
        break;
      case "rejected":
        status.style.color = "#ea3a4b";
        break;
    }
  }
};
