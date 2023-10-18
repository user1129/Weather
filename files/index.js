const form = document.getElementById("img-form");
const img = document.getElementById("img");
const output_path = document.getElementById("output-path");
const filename = document.getElementById("filename");
const height_input = document.getElementById("height");
const width_input = document.getElementById("width");
const title = document.getElementById("selecting");

function load_image(e) {
  const file = e.target.files[0];
  if (!is_file_image(file)) {
    alert_error("Please select image");
    return;
  }

  //Get original dimensions
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    width_input.value = this.width;
    height_input.value = this.height;
  };

  form.style.display = "block";
  filename.innerText = file.name;
  output_path.innerText = path.join(os.homedir(), "imageresizer");
}

function is_file_image(file) {
  const accepted_types = ["image/png", "image/gif", "image/jpeg", "image/jpg"];

  return file && accepted_types.includes(file["type"]);
}

function alert_error(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  });
}
function alert_success(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  });
}

function send_image(e) {
  e.preventDefault();

  const img_path = img.files[0].path;

  if (!img.files[0]) {
    alert_error("Please upload an image");
    return;
  }

  if (width_input.value === "" || height_input.value === "") {
    alert_error("Please fill in a height and width");
    return;
  }

  //Sending to main using ipcRenderer
  ipcRenderer.send("image:resize", {
    img_path,
    width: width_input.value,
    height: height_input.value,
  });
}

ipcRenderer.on("image:done", () => {
  alert_success(
    `Image resized to ${width_input.value} x ${height_input.value}`
  );
});

img.addEventListener("change", load_image);
form.addEventListener("submit", send_image);
