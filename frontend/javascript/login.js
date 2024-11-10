window.onload = init;

//Sesion previa?
function init() {
  if (!localStorage.getItem("token")) {
    document.querySelector(".login-button").addEventListener("click", login);
  } else {
    window.location.href = "user.html";
  }
}

//Comprobar credenciales
function login() {
  var mail = document.getElementById("username").value;
  var pass = document.getElementById("password").value;

  axios({
    method: "post",
    url: "http://localhost:3000/user/login",
    data: {
      user_mail: mail,
      user_password: pass,
    },
  })
    .then(function (res) {
      if (res.data.code === 200) {
        localStorage.setItem("token", res.data.message);
        window.location.href = "user.html";
      } else {
        alert("Log in failed");
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}
