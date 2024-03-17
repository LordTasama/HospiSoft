(() => {
  async function login() {
    try {
      const response = await fetch("http://localhost:3000/user/login/status", {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener el recurso");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  (async () => {
    try {
      const response = await login();

      if (response.status) {
        location.href = "./";
      } else {
        fetch(
          "http://localhost:3000/user/find/" +
            response.respuesta.identificacion +
            "/---",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res[0].estado == 0) {
              localStorage.setItem("token", "");
              location.reload();
            } else {
              if (
                (res[0].id_rol != 0 &&
                  res[0].id_rol != 1 &&
                  document.querySelector("#addUser")) ||
                (res[0].id_rol != 0 &&
                  res[0].id_rol != 1 &&
                  document.querySelector("#addDoctor"))
              ) {
                location.href = "./dashboard.html";
              }
              document.querySelector("#usernameLbl").innerHTML =
                res[0].nombres + " " + res[0].apellidos;
              document.querySelector("#rolLbl").innerHTML =
                res[0].id_rol == 0
                  ? "Owner"
                  : res[0].id_rol == 1
                  ? "Administrador"
                  : res[0].id_rol == 2
                  ? "Médico"
                  : res[0].id_rol == 3
                  ? "Secretaria"
                  : "Dispensario";
            }
          });
      }
    } catch (error) {
      console.log(error);
    }

    document.querySelector("#logOut").addEventListener("click", () => {
      localStorage.setItem("token", "");
      location.reload();
    });
  })();
  // FLEXIBILIDAD
  if (window.innerWidth < 480) {
    $("body").addClass("sidebar-toggled");
    $(".sidebar").addClass("toggled");
    $(".sidebar .collapse").collapse("hide");
  }

  if (document.querySelector("#dataTable")) {
    const sidebarToggleTop = document.querySelector("#sidebarToggleTop");

    sidebarToggleTop.addEventListener("click", () => {
      const headerTable = document.querySelector("#headerTable");

      if (headerTable.classList.contains("d-flex")) {
        headerTable.classList.remove("d-flex");
        headerTable.classList.add("d-column");
        headerTable.firstElementChild.classList.add("mb-3");
      } else {
        headerTable.classList.remove("d-column");
        headerTable.classList.add("d-flex");
        headerTable.firstElementChild.classList.remove("mb-3");
      }
    });
  }
})();
