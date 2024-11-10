window.onload = init;
var headers = {};
var url = "http://localhost:3000/user";
var empleados = [];
let token = null;

//Obtener token
function init() {
  token = localStorage.getItem("token");
  if (token) {
    headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + localStorage.getItem("token"),
      },
    };
    const user = getUserFromToken();
    fetchUserInfo(user.user_id);
    loadEmpleados();
  } else {
    window.location.href = "index.html";
  }
}

function getUserFromToken() {
  if (!token) return null;

  //Obtener id del usuario
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload;
}

//Función para validar y obtener datos del usuario mediante el id de su token.
function fetchUserInfo(user_id) {
  axios
    .get(`${url}/getUserInfo/${user_id}`, headers)
    .then(function (response) {
      const user = response.data.user;
      displayWelcomeMessage(user);
    })
    .catch(function (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 404) {
        //Se elimina el token si su id no coincide con alguno de la base de datos cerrando su sesión.
        localStorage.removeItem("token");
        alert("Credentials expired, you need to log in again.");
        window.location.href = "index.html";
      } else {
        alert("Error eith user information.");
      }
    });
}

//Mensaje de bienvenida + ususario
function displayWelcomeMessage(user) {
  var container = document.querySelector(".welcome-container");
  container.innerHTML = `
        <h1 id="welcomeMessage">Bienvenido, ${user.user_name} ${user.user_last_name}</h1>
        <a href="signin.html" class="register-link">Registra un Nuevo Usuario</a>
        <button id="logoutButton" class="logout-button">Cerrar Sesión</button>
    `;
  document.getElementById("logoutButton").addEventListener("click", logout);
}

function logout() {
  token = null;
  localStorage.removeItem("token");
  alert("Sesión cecrrada correctamente.");
  window.location.href = "index.html";
}

//Caragar datos de los empleados ya existentes
function loadEmpleados() {
  axios
    .get(url + "/empleados", headers)
    .then(function (res) {
      console.log(res);
      empleados = res.data.message;
    })
    .catch(function (err) {
      console.log(err);
    });
}

//Función de autocompletado para la barra de búsqueda.
function autoComplete() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const autocompleteList = document.getElementById("autocompleteList");

  autocompleteList.innerHTML = "";

  if (searchTerm.length === 0) {
    return;
  }

  const filteredEmpleados = empleados.filter((empleado) =>
    (empleado.user_name + " " + empleado.user_last_name)
      .toLowerCase()
      .includes(searchTerm)
  );

  filteredEmpleados.forEach((empleado) => {
    const li = document.createElement("li");
    li.textContent = `${empleado.user_name} ${empleado.user_last_name}`;
    li.addEventListener("click", () => {
      document.getElementById("searchInput").value = li.textContent;
      autocompleteList.innerHTML = "";
    });
    autocompleteList.appendChild(li);
  });
}

//Boton de buscar empleado
function searchEmpleados() {
  const searchTerm = document.getElementById("searchInput").value;
  const empleado = empleados.find(
    (e) => `${e.user_name} ${e.user_last_name}` === searchTerm
  );

  if (empleado) {
    displayEmpleadoForm(empleado);
  } else {
    document.getElementById("empleadoFormContainer").innerHTML =
      "<p>Empleado no encontrado.</p>";
  }
}

//Formulario de datos del empleado para actualizar o modificar
function displayEmpleadoForm(empleado) {
  var container = document.getElementById("empleadoFormContainer");
  container.innerHTML = `
        <form>
            <label for="id_empleado">ID del empleado:</label>
            <input type="text" id="id_empleado" value="${empleado.user_id}" readonly><br>
            <label for="userName">Nombre:</label>
            <input type="text" id="userName" value="${empleado.user_name}"><br>
            <label for="userLastName">Apellido:</label>
            <input type="text" id="userLastName" value="${empleado.user_last_name}"><br>
            <label for="userPhone">Teléfono:</label>
            <input type="text" id="userPhone" value="${empleado.user_phone}"><br>
            <label for="userAddress">Dirección:</label>
            <input type="text" id="userAddress" value="${empleado.user_address}"><br>
            <label for="userMail">Correo:</label>
            <input type="text" id="userMail" value="${empleado.user_mail}"><br>
            <div class="buttons">
                <button type="button" class="modify-btn" onclick="updateEmpleado()">Modificar datos</button>
                <button type="button" class="delete-btn" onclick="deleteEmpleado()">Eliminar empleado</button>
                <button type="button" class="cancel-btn" onclick="window.location.href='index.html'">Cancelar</button>
            </div>
        </form>
    `;
}

//Función para actulizar los datos de un empleado:
function updateEmpleado() {
  // Obtiene el ID del empleado del input de sólo lectura
  const user_id = document.getElementById("id_empleado").value;
  const user_name = document.getElementById("userName").value;
  const user_last_name = document.getElementById("userLastName").value;
  const user_phone = document.getElementById("userPhone").value;
  const user_mail = document.getElementById("userMail").value;
  const user_address = document.getElementById("userAddress").value;

  // Realiza la solicitud PUT 
  axios
    .put(
      `${url}/update`,
      {
        user_id,
        user_name,
        user_last_name,
        user_phone,
        user_mail,
        user_address,
      },
      headers
    )
    .then(function (response) {
      console.log(response.data.message);
      alert(response.data.message);
      window.location.href = "index.html";
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("Error updating user data.");
    });
}

//Eliminar empleado
function deleteEmpleado() {
  const user_id = document.getElementById("id_empleado").value;

  axios
    .delete(`${url}/delete`, {
      data: { user_id },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      console.log(response.data.message);
      alert(response.data.message);
      window.location.href = "index.html";
    })
    .catch(function (error) {
      console.error("Error:", error.message);
    });
}
