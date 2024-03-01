const btn = document.getElementById("submitLogIn");
const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

document.getElementById("logInForm").setAttribute("method", "GET");
document.getElementById("logInForm").setAttribute("action", oauth2Endpoint);
const YOUR_CLIENT_ID =
  "701328728829-c507ja8sc0q410m1bg250l7spinh0g5m.apps.googleusercontent.com";
const YOUR_REDIRECT_URI = "https://ukukhulabursary.netlify.app";
let fragmentString = location.hash.substring(1);
let email = "";
let params = {};
let regex = /([^&=]+)=([^&]*)/g,
  m;

while ((m = regex.exec(fragmentString))) {
  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}

if (Object.keys(params).length > 0) {
  localStorage.setItem("oauth2-test-params", JSON.stringify(params));
  if (params["state"] && params["state"] == "try_sample_request") {
    TokenHandler();
  }
}

function TokenHandler() {
  let params = JSON.parse(localStorage.getItem("oauth2-test-params"));
  if (params && params["access_token"]) {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://www.googleapis.com/oauth2/v3/userinfo?" +
        "access_token=" +
        params["access_token"]
    );
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        email = JSON.parse(xhr.response)["email"];
        verifyRole();
      } else if (xhr.readyState === 4 && xhr.status === 401) {
        oauth2SignIn();
      }
    };
    xhr.send(null);
  } else {
    oauth2SignIn();
  }
}

function oauth2SignIn() {
  let params = {
    client_id: YOUR_CLIENT_ID,
    redirect_uri: YOUR_REDIRECT_URI,
    scope: "https://www.googleapis.com/auth/userinfo.email",
    state: "try_sample_request",
    include_granted_scopes: "true",
    response_type: "token",
  };

  for (let p in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    document.getElementById("logInForm").appendChild(input);
  }
  document.getElementById("logInForm").submit();
}

async function verifyRole() {
  try {
    const response = await fetch(
      "https://bursarywebapp.azurewebsites.net/api/Login/byEmail?userEmail=" +
        email
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const userID = data["userID"];
    const roleID = data["roleID"];
    roleFinder(data["roleID"]);
    sessionStorage.setItem("userID", window.btoa(userID));
    sessionStorage.setItem("roleID", window.btoa(roleID));
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
  }

  function roleFinder(role) {
    return role === 1
      ? (window.location.href = "/bbd")
      : role === 2
      ? (window.location.href = "/hod")
      : (window.location.href = "/error");
  }
}

btn.addEventListener("click", TokenHandler);
