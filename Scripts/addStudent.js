const newStudent = document.getElementById("add");


assignReviewer.addEventListener("click", () => {
  window.location.pathname = `/${
    window.location.pathname.split("/")[1]
  }/studenttemporarylink`;
});