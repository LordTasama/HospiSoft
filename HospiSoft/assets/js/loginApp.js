(() => {
  async function login() {
    try {
      const response = await fetch("http://localhost:3000/user/login/status", {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-type": "application/json",
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
      return ""; // Devuelve un valor predeterminado en caso de error
    }
  }

  (async () => {
    try {
      const response = await login();
      if (response.respuesta) {
        location.href = "./dashboard.html";
      }
    } catch (error) {
      console.log(error);
    }
  })();

  const btnLogin = document.querySelector("#btnLogin");

  btnLogin.addEventListener("click", () => {
    const email = document.querySelector("#postEmail");
    const password = document.querySelector("#postPassword");
    const rol = document.querySelector("#postRol");

    if (!email.value || !password.value) {
      alert("Comprueba si hay campos vacíos");
      return;
    }
    if (rol.selectedIndex == -1) {
      alert("Selecciona un rol");
      return;
    }

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      alert("El correo electrónico ingresado no es válido.");
      return;
    }
    try {
      fetch("http://localhost:3000/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: email.value,
          password: password.value,
          rol: rol.value,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            normalAlert("error", res.error, 1500, "");
          } else if (res.length == 0) {
            normalAlert("error", "Datos incorrectos", 1500, "");
          } else if (res.token) {
            if (res.estado == 0) {
              normalAlert("error", "Su usuario está inactivo", 1500, "");
            } else {
              localStorage.setItem("token", res.token);
              normalAlert(
                "success",
                "Sesión iniciada",
                1500,
                "./dashboard.html"
              );
            }
          }
        });
    } catch (error) {
      console.log(error);
      return "";
    }
  });
})();
