const statusColorCoder = () => {
    const statuses = document.querySelectorAll(".status");
    for (const status of statuses) {
      switch (status.innerHTML) {
        case "pending":
          status.style.backgroundColor = "#f2953fc6";
          status.style.color = "white";
          break;
        case "approved":
          status.style.backgroundColor = "#23c68b";
          status.style.color = "white";
          break;
        case "rejected":
          status.style.backgroundColor = "#ea3a4b";
          status.style.color = "white";
          break;
      }
    }
  };