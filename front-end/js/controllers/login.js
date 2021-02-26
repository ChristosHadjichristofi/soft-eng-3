function login() {
    event.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var email = document.getElementById("inputEmail");
    var password = document.getElementById("inputPassword");
    var role = document.getElementById("userType").value;
    var url;

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", email.value);
    urlencoded.append("password", password.value);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
    };

    if (role === 'user') url = "http://localhost:8765/evcharge/api/login?isAdministrator=false"
    else url = "http://localhost:8765/evcharge/api/login?isAdministrator=true"

    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result.token)
        document.cookie = "token=" + result.token;
    })
    .catch(error => console.log('error', error));
}