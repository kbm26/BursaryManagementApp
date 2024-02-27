const tempLink = document.getElementById("createTempLink");
const assignReviewer = document.getElementById("assignReviewer");

assignReviewer.addEventListener("click", () => {
  if (tempLink.style.display === "none") {
    tempLink.style.display = "flex";
    setTimeout(() => {
      tempLink.style.opacity = 1;
    }, 200);
  } else {
    tempLink.style.opacity = 0;
    setTimeout(() => {
      tempLink.style.display = "none";
    }, 600);
  }
});
