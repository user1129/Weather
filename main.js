const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const path = require("path");
const os = require("os");
const resizeImg = require("resize-img");
const fs = require("fs");
const is_dev_mode = process.env.NODE_ENV !== "production";

let main_window;
const menu = [
  {
    label: "About",
    click: () => create_about_window(),
  },
  {
    label: "Quit",
    click: () => app.quit(),
  },
];

function create_main_window() {
  main_window = new BrowserWindow({
    title: "Image Resizer",
    width: 1000,
    height: 800,
    resizable: false,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // main_window.webContents.openDevTools();

  main_window.loadFile("./files/index.html");
}

function create_about_window() {
  const about_window = new BrowserWindow({
    title: "About Image Resizer",
    width: 300,
    height: 200,
    resizable: false,
  });

  about_window.loadFile("./files/about.html");
}

//Respond to ipcRenderer resize
ipcMain.on("image:resize", (e, opt) => {
  opt.dest = path.join(os.homedir(), "imageresizer");
  resize_image(opt);
});

async function resize_image({ img_path, width, height, dest }) {
  try {
    const new_path = await resizeImg(fs.readFileSync(img_path), {
      width: +width,
      height: +height,
    });

    // create filename
    const filename = path.basename(img_path);

    // create dest folder if it does not exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // Write the file to the destination
    fs.writeFileSync(path.join(dest, filename), new_path);

    // Send success message
    main_window.webContents.send("image:done");

    shell.openPath(dest);
  } catch (e) {
    console.error(e);
  }
}

app.on("ready", () => {
  create_main_window();
  main_window.on("closed", () => (main_window = null));
  const main_menu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(main_menu);
});
