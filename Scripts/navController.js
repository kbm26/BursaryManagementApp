const nav = document.getElementsByClassName("navigation")[0];
const burgerMenu = document.getElementById("burger");
const logout = document.getElementById("logout");

logout.addEventListener("click", () => {
  let token = JSON.parse(localStorage.getItem("authInfo"));
  fetch(
    "https://accounts.google.com/o/oauth2/revoke?token=" +
      token["access_token"],
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  ).then((data) => {
    localStorage.clear();
    location.href = "/";
  });
});

burgerMenu.addEventListener("click", () => {
  if (nav.style.display !== "flex") {
    nav.style.display = "flex";
    setTimeout(() => {
      nav.style.opacity = 1;
      nav.style.height = "50vh";
    }, 200);
  } else {
    nav.style.height = "0vh";
    nav.style.opacity = 0;
    setTimeout(() => {
      nav.style.display = "none";
    }, 900);
  }
});
