window.onload = init;

//Verificar si existe un token
function init() {
  if (!localStorage.getItem("token")) {
    window.location.href = "index.html";
  }
  document.querySelector(".register-button").addEventListener("click", signin);
}

//Registrar empleados
function signin() {
  var name = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var address = document.getElementById("address").value;
  var phone = document.getElementById("phone").value;
  var mail = document.getElementById("email").value;
  var pass = document.getElementById("password").value;

  const token = localStorage.getItem("token");

  axios({
    method: "post",
    url: "http://localhost:3000/user/signin",
    data: {
      user_name: name,
      user_last_name: lastName,
      user_phone: phone,
      user_mail: mail,
      user_address: address,
      user_password: pass,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(function (res) {
      console.log(res);
      if (res.status === 201) {
        alert("User registered");
        window.location.href = "user.html";
      } else {
        alert("Registration failed");
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}
