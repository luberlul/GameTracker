import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { searchGames as igdbSearch, getGame as igdbGetGame } from "./igdb";
import { searchHltb } from "./hltb";
import {
  listGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
} from "./game-repository";

const isDev = !app.isPackaged;

// __dirname is available because we compile to CommonJS
const ROOT = path.join(__dirname, "..");
const RENDERER_DIST = path.join(ROOT, "out");
const PRELOAD = path.join(__dirname, "preload.js");
const ICON = path.join(ROOT, "build", "icon.ico");

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    backgroundColor: "#0a0a0f",
    icon: ICON,
    frame: false,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once("ready-to-show", () => mainWindow?.show());

  // Forward maximize state to renderer (so the title bar can swap icons)
  const broadcastMaximize = () =>
    mainWindow?.webContents.send(
      "window:maximize-changed",
      mainWindow.isMaximized(),
    );
  mainWindow.on("maximize", broadcastMaximize);
  mainWindow.on("unmaximize", broadcastMaximize);

  // Open external links in the user's default browser, never inside the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  if (isDev) {
    await mainWindow.loadURL("http://localhost:3000");
    // DevTools available via F12 / Ctrl+Shift+I — not auto-opened, since
    // a detached DevTools window can steal OS focus from the main window
    // and leave inputs/buttons unresponsive until you click outside-and-back.
  } else {
    await mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Single-instance lock so launching twice focuses the existing window
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

// ---- IPC: window controls ------------------------------------------------

ipcMain.handle("window:minimize", () => mainWindow?.minimize());
ipcMain.handle("window:toggle-maximize", () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.handle("window:close", () => mainWindow?.close());
ipcMain.handle("window:is-maximized", () => mainWindow?.isMaximized() ?? false);
ipcMain.handle("window:focus", () => {
  if (!mainWindow) return;
  // BrowserWindow.focus() restores OS-level keyboard focus to the window,
  // which clears any "stuck input" state where the DOM looks focused but
  // keystrokes aren't being delivered to the renderer.
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
  mainWindow.webContents.focus();
});

// ---- IPC: IGDB fallback (used when packaged — Next API routes absent) ----

ipcMain.handle("igdb:search", async (_event, query: string) => {
  return igdbSearch(query);
});
ipcMain.handle("igdb:get-game", async (_event, id: string | number) => {
  return igdbGetGame(id);
});

// ---- IPC: HLTB fallback (used when packaged — Next API routes absent) ----

ipcMain.handle("hltb:search", async (_event, query: string) => {
  return searchHltb(query);
});

// ---- IPC: Game database -----------------------------------------------

ipcMain.handle("db:games:list", async () => listGames());
ipcMain.handle("db:games:get", async (_event, id: string) => getGame(id));
ipcMain.handle("db:games:create", async (_event, input) => createGame(input));
ipcMain.handle("db:games:update", async (_event, id: string, input) =>
  updateGame(id, input),
);
ipcMain.handle("db:games:delete", async (_event, id: string) =>
  deleteGame(id),
);

// Suppress unused-import warning for fileURLToPath (kept for future ESM migration)
void fileURLToPath;
