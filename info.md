Это создание Electron приложения который получает картинку
и потом отдает сжатую или увеличенную версию

Вот такие зависимости я установил:
    electron
    resize-img
    toastify-js


Внедрил скрипт "start":"electron ." в package.json который запускает программу через electron и запускает она main.js файл

Electron под капотом использует Chromium

app, BrowserWindow - это главные модули для создания оболочки


Для создание отдельных окон вызываем конструктор BrowserWindow через new в
которой передаем объект с опциями. Например размеры окна, настройка меню и 
многое другое

и в конце у инстанса окна вызываем метод loadFile куда передаем путь до штмл
файла которую наш инстанс отрисует у себя

app это энтри поинт который запускает нашу апликуху
у него есть ивент слушатель on('ready', () => {}) который обрабатывает
колбек по разным событиям

Еще при запуске приложении можно задать Кастомный менюбар через модуль
Menu в 'electron'
Сначала делаешь темплейт:

const menu = [
  {
    label: "File",
    submenu: [
      { label: "Quit", click: () => app.quit(), accelerator: "Ctrl+W" },
    ],
  },
  {
    label: "About",
    click: () => create_about_window(),
  },
];

И потом через метод buildFromTemplate(menu) получаешь заготовку
и сетишь этот меню Menu.setApplicationMenu(ready_menu)




ивенты для картинки это change и e.target.files лежат картинки


Нельзя просто взять и импортировать модули Ноды внутри скриптах Electron
Для этого нужно создать отдельный файл preload.js внутри написать так

const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});
