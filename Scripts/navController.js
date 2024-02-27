const nav = document.getElementsByClassName("navigation")[0];
const burgerMenu = document.getElementById("burger");

burgerMenu.addEventListener("click", () => {
  if (nav.style.display !== "flex") {
    nav.style.display = "flex";
    setTimeout(() => {
      nav.style.opacity = 1;
      nav.style.height = "100vh";
    }, 200);
  } else {
    nav.style.height = "0vh";
    nav.style.opacity = 0;
    setTimeout(() => {
      nav.style.display = "none";
    }, 900);
  }
});
