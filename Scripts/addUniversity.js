const addUniversityButton = document.querySelector('.add');

addUniversityButton.addEventListener("click", () => {
    window.location.pathname = `/${
     window.location.pathname.split("/")[1] 
    }/newUniversity`;
});



