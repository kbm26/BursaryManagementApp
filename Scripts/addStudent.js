
const addStudentButton = document.querySelector('.add');

addStudentButton.addEventListener("click", () => {
    window.location.pathname = `/${
     window.location.pathname.split("/")[1] 
    }/studentapplicationindex`;
});
