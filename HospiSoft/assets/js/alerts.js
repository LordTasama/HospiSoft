const normalAlert = (icon, title, timer, reload) => {
  Swal.fire({
    position: "center",
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: timer,
  }).then(() => {
    if (reload != "") {
      if (reload == "reload") {
        location.reload();
      } else {
        location.href = reload;
      }
    }
  });
};
