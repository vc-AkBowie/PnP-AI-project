const EXPORT_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>畫中畫網頁檔 (響應式尺寸版)</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; overflow: hidden; color: #0f172a; }
    .layout { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; width: 100vw; position: relative; }
    
    /* 頂部資訊面板 */
    .info-panel { 
      position: absolute; top: 20px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px); color: #f8fafc; padding: 10px 38px 10px 24px; border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; z-index: 10; user-select: none; text-align: center; line-height: 1.6; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15); transition: background 0.3s; 
    }

    .info-close-btn {
      position: absolute; top: 7px; right: 7px; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25); color: #ffffff; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 13px; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; line-height: 1; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    .info-close-btn:hover { background: #ef4444; border-color: #ef4444; color: #ffffff; transform: scale(1.15); box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
    
    .size-controls { position: absolute; top: 20px; right: 24px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px); padding: 6px; border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; gap: 4px; z-index: 10; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15); }
    .size-btn { background: transparent; border: none; color: #94a3b8; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; user-select: none; }
    .size-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .size-btn.active { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }

    .svg-container { box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08); background: #ffffff; border-radius: 12px; position: relative; border: 1px solid #e2e8f0; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1), aspect-ratio 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    .svg-container.size-small { height: 85vh; width: calc(85vh * 9 / 16); max-width: 90vw; aspect-ratio: 9 / 16; }
    .svg-container.size-medium { width: 80vw; max-width: 850px; height: auto; aspect-ratio: 1 / 1; }
    .svg-container.size-large { width: 95vw; height: 95vh; max-width: none; overflow: hidden; }

    svg { border: none; width: 100%; height: 100%; cursor: grab; display: block; border-radius: 12px; }
    svg:active { cursor: grabbing; }

    .remote-wrapper { position: absolute; top: 50%; right: calc(100% + 20px); transform: translateY(-50%); z-index: 20; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
    .remote-wrapper.collapsed { transform: translateY(-50%) translateX(-50px); }
    .remote-wrapper.collapsed .remote-controller { opacity: 0; pointer-events: none; }
    
    .remote-controller { background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.12); padding: 8px; border-radius: 28px; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.3), 0 0 1px rgba(255, 255, 255, 0.2) inset; width: 48px; transition: opacity 0.25s ease; }
    .remote-btn { width: 32px; height: 32px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12); color: #f8fafc; cursor: pointer; border-radius: 50%; font-weight: 500; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); user-select: none; line-height: 1; }
    .remote-btn:hover { background: rgba(255, 255, 255, 0.22); border-color: rgba(255, 255, 255, 0.3); color: #ffffff; transform: scale(1.1); box-shadow: 0 0 12px rgba(255, 255, 255, 0.15); }
    .remote-btn:active { transform: scale(0.92); }
    .remote-btn.reset { font-size: 15px; color: #38bdf8; background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.25); }
    .remote-btn.reset:hover { background: #0284c7; color: #ffffff; border-color: #38bdf8; box-shadow: 0 0 12px rgba(56, 189, 248, 0.4); }

    .remote-btn.close { font-size: 12px; font-weight: bold; color: #f43f5e; background: rgba(244, 63, 94, 0.12); border-color: rgba(244, 63, 94, 0.3); }
    .remote-btn.close:hover { background: #ef4444; color: #ffffff; border-color: #ef4444; box-shadow: 0 0 12px rgba(239, 68, 68, 0.5); }

    .toggle-remote-btn { position: absolute; left: -24px; top: 50%; transform: translateY(-50%); width: 20px; height: 32px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.15); color: #94a3b8; border-radius: 10px 0 0 10px; border-right: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 9px; transition: all 0.2s; box-shadow: -4px 0 10px rgba(0,0,0,0.15); z-index: 25; }
    .toggle-remote-btn:hover { color: #f8fafc; background: #0f172a; transform: translateY(-50%) scale(1.1); }

    .svg-container.size-large .remote-wrapper { top: 20px; left: 20px; right: auto; transform: none; }
    .svg-container.size-large .remote-wrapper.collapsed { transform: translateX(-56px); }
    .svg-container.size-large .toggle-remote-btn { left: auto; right: -20px; border-radius: 0 10px 10px 0; border-left: none; border-right: 1px solid rgba(255, 255, 255, 0.15); transform: none; box-shadow: 4px 0 10px rgba(0,0,0,0.15); }
    .svg-container.size-large .toggle-remote-btn:hover { transform: scale(1.1); }
  </style>
</head>
<body>
<div class="layout">
  <div class="info-panel" id="infoPanel">
    <div id="infoText">目前階段：Stage 1<br>X: 0 | Y: 0 | Zoom: 1.00x</div>
    <button class="info-close-btn" id="btnCloseInfo" title="關閉面板">✕</button>
  </div>
  
  <div class="size-controls">
    <button class="size-btn" data-size="size-small" title="IG Story 比例 (9:16)">📱</button>
    <button class="size-btn active" data-size="size-medium" title="標準正方比例 (預設)">💻</button>
    <button class="size-btn" data-size="size-large" title="全螢幕模式">🖥️</button>
  </div>

  <div class="svg-container size-medium" id="svgContainer">
<!-- {{SVG_ELEMENTS}} -->

    <div class="remote-wrapper" id="remoteWrapper">
      <button class="toggle-remote-btn" id="btnToggleRemote" title="展開/收合遙控器">❮</button>
      <div class="remote-controller">
        <button class="remote-btn close" id="btnCloseRemote" title="關閉遙控器">✕</button>
        <button class="remote-btn reset" id="btnReset" title="重設檢視">↺</button>
        <button class="remote-btn" id="btnZoomIn" title="放大">＋</button>
        <button class="remote-btn" id="btnZoomOut" title="縮小">－</button>
      </div>
    </div>
  </div>
</div>

<script>
const STAGE_CONFIG = [
/* {{STAGE_CONFIG}} */
];

const container = document.getElementById("svgContainer");
const infoPanel = document.getElementById("infoPanel");
const infoText = document.getElementById("infoText");
const btnCloseInfo = document.getElementById("btnCloseInfo");
const remoteWrapper = document.getElementById("remoteWrapper");
const btnToggleRemote = document.getElementById("btnToggleRemote");
const btnCloseRemote = document.getElementById("btnCloseRemote");

let currentStage = 1;
let zoom = 1.0;
let displayZoom = 1.0;
let focusX = STAGE_CONFIG[0].baseSize/2, focusY = STAGE_CONFIG[0].baseSize/2;
let isDragging = false, lastX, lastY, needsUpdate = false;

btnCloseInfo.addEventListener("click", () => { infoPanel.style.display = "none"; });
btnCloseRemote.addEventListener("click", () => { remoteWrapper.style.display = "none"; });

function getConfig() { return STAGE_CONFIG[currentStage - 1]; }
function getActiveSvg() { return document.getElementById("mysvg" + currentStage); }

function getViewBoxSizes() {
  const rect = container.getBoundingClientRect();
  const width = rect.width || 1;
  const height = rect.height || 1;
  const aspect = width / height;
  const base = getConfig().baseSize / zoom;
  let sizeX = base, sizeY = base;
  
  if (aspect > 1) { sizeX = base * aspect; } 
  else { sizeY = base / aspect; }
  return { sizeX, sizeY };
}

function updateViewBox() {
  if (!needsUpdate) return;
  needsUpdate = false;
  const config = getConfig();

  // 1. 向前切換階段 (Zoom In)
  if (zoom > config.transitionTrigger) {
    const nextConfig = STAGE_CONFIG[currentStage]; 
    if (nextConfig) {
      const nextState = config.calculateNext(focusX, focusY, zoom);
      focusX = nextState.x; focusY = nextState.y; zoom = nextState.zoom;
      getActiveSvg().style.display = "none";
      currentStage++;
      getActiveSvg().style.display = "block";
      infoPanel.style.background = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      needsUpdate = true; updateViewBox(); return; 
    }
  }

  // 2. 向後切換階段 (Zoom Out) - 關鍵修正點！
  if (zoom < config.minZoom) {
    if (currentStage > 1) {
      const prevState = config.calculatePrev(focusX, focusY, zoom);
      focusX = prevState.x; focusY = prevState.y; zoom = prevState.zoom;
      getActiveSvg().style.display = "none";
      currentStage--;
      getActiveSvg().style.display = "block";
      infoPanel.style.background = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      needsUpdate = true; updateViewBox(); return;
    } else {
      // 已經到達第一階段底限，鎖定 zoom 不再縮小
      zoom = config.minZoom;
    }
  }

  const { sizeX, sizeY } = getViewBoxSizes();
  getActiveSvg().setAttribute("viewBox", (focusX - sizeX / 2) + " " + (focusY - sizeY / 2) + " " + sizeX + " " + sizeY);


//debug mode
//infoPanel.innerHTML = "目前階段：Stage " + currentStage + "<br>X: " + focusX.toFixed(1) + " | Y: " + focusY.toFixed(1) + " | Zoom: " + displayZoom.toFixed(2) + "x";}
  
//demo mode
infoText.innerHTML = "X: " + focusX.toFixed(1) + " | Y: " + focusY.toFixed(1) + " | Zoom: " + displayZoom.toFixed(2) + "x";}

function zoomAt(factor, mouseX=null, mouseY=null) {
  const config = getConfig();
  const rect = container.getBoundingClientRect();
  const { sizeX: oldSizeX, sizeY: oldSizeY } = getViewBoxSizes();
  
  const viewX = focusX - oldSizeX / 2;
  const viewY = focusY - oldSizeY / 2;
  
  let svgX = mouseX !== null ? viewX + (mouseX / rect.width) * oldSizeX : focusX;
  let svgY = mouseY !== null ? viewY + (mouseY / rect.height) * oldSizeY : focusY;

  // 移除強制的 Math.max 鎖定，允許數值低於 minZoom 以便觸發後退切換
  zoom = zoom * factor;
  displayZoom = displayZoom * factor; 
  
  const { sizeX: newSizeX, sizeY: newSizeY } = getViewBoxSizes();
  
  if (mouseX !== null && mouseY !== null) {
    focusX = svgX - (mouseX / rect.width) * newSizeX + newSizeX / 2;
    focusY = svgY - (mouseY / rect.height) * newSizeY + newSizeY / 2;
  }
  
  needsUpdate = true;
  requestAnimationFrame(updateViewBox);
}

document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    const targetSize = e.currentTarget.getAttribute('data-size');
    container.classList.remove('size-small', 'size-medium', 'size-large');
    container.classList.add(targetSize);
    
    let start = performance.now();
    function animateResize(time) {
      needsUpdate = true; updateViewBox();
      if (time - start < 450) requestAnimationFrame(animateResize);
    }
    requestAnimationFrame(animateResize);
  });
});

window.addEventListener("resize", () => { needsUpdate = true; requestAnimationFrame(updateViewBox); });

btnToggleRemote.addEventListener("click", () => {
  const isCollapsed = remoteWrapper.classList.toggle("collapsed");
  btnToggleRemote.textContent = isCollapsed ? "❯" : "❮";
});

document.getElementById("btnReset").addEventListener("click", () => { window.location.reload(); });
document.getElementById("btnZoomIn").addEventListener("click", () => { zoomAt(1.5); });
document.getElementById("btnZoomOut").addEventListener("click", () => { zoomAt(1/1.5); });

container.addEventListener("dblclick", (e) => {
  if (e.target.closest('#remoteWrapper')) return;
  e.preventDefault();
  const rect = container.getBoundingClientRect();
  zoomAt(1.3, e.clientX - rect.left, e.clientY - rect.top);
});

container.addEventListener("wheel", (e) => {
  e.preventDefault();
  const rect = container.getBoundingClientRect();
  zoomAt(e.deltaY < 0 ? 1.1 : 0.9, e.clientX - rect.left, e.clientY - rect.top);
});

container.addEventListener("mousedown", (e) => { 
  if (e.target.closest('#remoteWrapper')) return;
  isDragging = true; lastX = e.clientX; lastY = e.clientY; 
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const rect = container.getBoundingClientRect();
    const { sizeX, sizeY } = getViewBoxSizes();
    focusX -= ((e.clientX - lastX) / rect.width) * sizeX; 
    focusY -= ((e.clientY - lastY) / rect.height) * sizeY;
    lastX = e.clientX; lastY = e.clientY;
    needsUpdate = true; requestAnimationFrame(updateViewBox);
  }
});
window.addEventListener("mouseup", () => isDragging = false);

needsUpdate = true; updateViewBox();
<\/script>
</body>
</html>`;