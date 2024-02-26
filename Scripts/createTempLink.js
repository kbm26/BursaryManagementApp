const tempLink = document.getElementById("createTempLink");
const assignReviewer = document.getElementById("assignReviewer");

assignReviewer.addEventListener("click", () => {
  if (tempLink.style.display === "none") tempLink.style.display = "flex";
  else tempLink.style.display = "none";
});