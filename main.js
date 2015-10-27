var app           = require('app')
  , BrowserWindow = require('browser-window')
  , env           = require('node-env-file');

var mainWindow = null;

loadEnv('.env');

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  if (process.env.ENV === 'dev') mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

function loadEnv(file) {
  try { env(file) } catch (e) {};
}
