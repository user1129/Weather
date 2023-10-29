const { app, BrowserWindow } = require("electron");

function create_main_window() {
  main_window = new BrowserWindow({
    title: "Weather App",
    width: 1000,
    height: 800,
    resizable: false,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  main_window.loadFile("./files/index.html");
}

app.on("ready", () => {
  create_main_window();
});
