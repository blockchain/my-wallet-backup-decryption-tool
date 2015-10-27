var app           = require('app')
  , BrowserWindow = require('browser-window')
  , Menu          = require('menu')
  , env           = require('node-env-file');

var mainWindow = null;

loadEnv('.env');

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  if (process.env.ENV === 'dev') mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  var template = [{
    label: "Application",
    submenu: [
        { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        { label: "Quit", accelerator: "CmdOrCtrl+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" }
    ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});

function loadEnv(file) {
  try { env(file) } catch (e) {};
}
