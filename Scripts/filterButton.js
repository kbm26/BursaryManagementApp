const filterButtons = document.querySelectorAll(".viewUniversity");
const filterSection = document.querySelector(".filterSection");
const filterToggle = document.querySelector(".filterButton");

filterToggle.addEventListener("click", (e) => {
  e.preventDefault();
  const display = filterSection.style.display;
  console.log(display);
  if (!display || display === "none") {
    filterSection.style.display = "inherit";
    setTimeout(() => {
      filterSection.style.height = "10vh";
      filterSection.style.opacity = 1;
    }, 100);
  } else {
    filterSection.style.opacity = 0;
    filterSection.style.height = "0vh";
    setTimeout(() => {
      filterSection.style.display = "none";
    }, 300);
  }
});
