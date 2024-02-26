const btn = document.querySelector('.button')

const YOUR_CLIENT_ID = '701328728829-c507ja8sc0q410m1bg250l7spinh0g5m.apps.googleusercontent.com';
const YOUR_REDIRECT_URI = 'http://localhost:5500';
let fragmentString = location.hash.substring(1);
let email =""
let params = {};
let regex = /([^&=]+)=([^&]*)/g, m;

while (m = regex.exec(fragmentString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}

if (Object.keys(params).length > 0) {
    localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
    if (params['state'] && params['state'] == 'try_sample_request') {
        trySampleRequest();
    }
}

function trySampleRequest() {
    let params = JSON.parse(localStorage.getItem('oauth2-test-params'));
    if (params && params['access_token']) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET',
            'https://www.googleapis.com/oauth2/v3/userinfo?' +
            'access_token=' + params['access_token']);
        xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            email = JSON.parse(xhr.response)["email"]
            verifyrole()
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
    // Google's OAuth 2.0 endpoint for requesting an access token
    let oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create element to open OAuth 2.0 endpoint in new window.
    let form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    let params = {'client_id': YOUR_CLIENT_ID,
                    'redirect_uri': YOUR_REDIRECT_URI,
                    'scope': 'https://www.googleapis.com/auth/userinfo.email',
                    'state': 'try_sample_request',
                    'include_granted_scopes': 'true',
                    'response_type': 'token'};

    // Add form parameters as hidden input values.
    for (let p in params) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit()
}

async function verifyrole(){

    try{
    const response = await fetch("https://bursarywebapp.azurewebsites.net/api/Login/byEmail?userEmail="+email)
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    roleFinder(data["roleID"])
    } catch (error) {
    // Handle errors
    console.error('There was a problem with your fetch operation:', error);
}

/**
 * 
 * @param {int} role 
 * @returns {string} roleInfo
 */
function roleFinder(role ){
    return (role === 1) ? window.location.href = "./BBD.html" : (role === 2) ? window.location.href = "./HOD.html"  : "None";
}
    

}

btn.addEventListener("click", trySampleRequest);




