const tempLink = document.getElementById("createTempLink");
const assignReviewer = document.getElementById("assignReviewer");

assignReviewer.addEventListener("click", () => {
  window.location.pathname = `/${
    window.location.pathname.split("/")[1]
  }/studenttemporarylink`;
});
