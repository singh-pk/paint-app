import {
  type PaintAppProps,
  type CanvasEventListener,
  type State,
  PaintTool
} from './lib';
import { convertStringToPx, getInitialState } from './utils';

export function paintApp({ canvas }: PaintAppProps) {
  let state: State;

  const _canvasEvents: CanvasEventListener[] = [
    { type: 'mousedown', listener: onMouseDown },
    { type: 'mouseup', listener: onMouseUp },
    { type: 'mousemove', listener: onMouseMove as EventListener }
  ];

  const _globalEvents: CanvasEventListener[] = [
    { type: 'resize', listener: onResize }
  ];

  function onMouseDown() {
    const { ctx } = state;

    if (!ctx) return;

    updateState({ isDrawing: true });
    ctx.beginPath();
    updateCursor('MOUSEDOWN');
  }

  function onMouseUp() {
    const { ctx, tempCtx, tempCanvas } = state;

    if (!ctx || !tempCtx || !tempCanvas) return;

    updateState({ isDrawing: false });
    ctx.closePath();
    updateCursor('MOUSEUP');
    drawGrid();
  }

  function onMouseMove(e: MouseEvent) {
    const { isDrawing, ctx, paintTool, tempCtx, tempCanvas } = state;

    if (!isDrawing || !ctx || !tempCtx || !tempCanvas) return;

    if (paintTool === PaintTool['BRUSH']) {
      handleBrush(e.offsetX, e.offsetY);
    } else if (paintTool === PaintTool['ERASER']) {
      handlerEraser(e.offsetX, e.offsetY);
    }
  }

  function onResize() {
    const { tempCanvas } = state;

    if (!tempCanvas) return;

    const { top, left } = canvas.getBoundingClientRect();

    tempCanvas.style.top = convertStringToPx(top);
    tempCanvas.style.left = convertStringToPx(left);

    drawGrid();
  }

  function handleBrush(x: number, y: number) {
    const { ctx } = state;

    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function handlerEraser(x: number, y: number) {
    const { tempCanvas, tempCtx, ctx } = state;

    if (!tempCanvas || !tempCtx || !ctx) return;

    drawGrid();
    tempCtx.strokeRect(x - 4, y - 4, 8, 8);
    ctx.clearRect(x - 4, y - 4, 8, 8);
  }

  function clearCanvas(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawGrid() {
    const { tempCtx, tempCanvas } = state;
    const gridSize = 10;

    if (!tempCtx || !tempCanvas) return;

    tempCtx.save();

    clearCanvas(tempCtx, tempCanvas);

    tempCtx.lineWidth = window.devicePixelRatio / 2;
    tempCtx.strokeStyle = '#ccc'; // Grid line color

    for (let x = 0; x <= tempCanvas.width; x += gridSize) {
      tempCtx.beginPath();
      tempCtx.moveTo(x, 0);
      tempCtx.lineTo(x, tempCanvas.height);
      tempCtx.stroke();
    }

    for (let y = 0; y <= tempCanvas.height; y += gridSize) {
      tempCtx.beginPath();
      tempCtx.moveTo(0, y);
      tempCtx.lineTo(tempCanvas.width, y);
      tempCtx.stroke();
    }

    tempCtx.restore();
  }

  function updateCursor(event: 'MOUSEUP' | 'MOUSEDOWN') {
    const { tempCanvas, paintTool } = state;

    if (!tempCanvas) return;

    let cursor = 'default';

    if (event === 'MOUSEDOWN') {
      switch (paintTool) {
        case PaintTool['BRUSH']:
          cursor = 'pointer';
          break;
        case PaintTool['ERASER']:
          cursor = 'crosshair';
          break;
        default:
          cursor = 'default';
      }
    }

    tempCanvas.style.cursor = cursor;
  }

  function registerEventListeners() {
    _canvasEvents.forEach(d => {
      canvas.addEventListener(d.type, d.listener);
    });

    _globalEvents.forEach(d => {
      window.addEventListener(d.type, d.listener);
    });
  }

  function removeEventListeners() {
    _canvasEvents.forEach(d => {
      canvas.removeEventListener(d.type, d.listener);
    });

    _globalEvents.forEach(d => {
      window.removeEventListener(d.type, d.listener);
    });
  }

  function updateState(newState: Partial<State>) {
    for (const key in newState) {
      (state[key as keyof State] as unknown) = newState[key as keyof State];
    }
  }

  function addTempCanvas() {
    const { tempCanvas } = state;

    if (tempCanvas) return;

    const scale = window.devicePixelRatio;

    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    canvas.style.zIndex = `2`;

    const newCanvas = document.createElement('canvas');

    const { top, left, right, bottom } = canvas.getBoundingClientRect();

    newCanvas.width = canvas.width / scale;
    newCanvas.height = canvas.height / scale;

    newCanvas.style.position = 'absolute';
    newCanvas.style.top = convertStringToPx(top);
    newCanvas.style.left = convertStringToPx(left);
    newCanvas.style.right = convertStringToPx(right);
    newCanvas.style.bottom = convertStringToPx(bottom);
    newCanvas.style.zIndex = `1`;

    const ctx = canvas.getContext('2d');
    const tempCtx = newCanvas.getContext('2d');

    updateState({ tempCanvas: newCanvas, tempCtx, ctx });

    if (ctx && tempCtx) {
      ctx.scale(scale, scale);
      ctx.lineWidth = 2;
      tempCtx.lineWidth = 2;
    }

    if (canvas.parentElement) {
      canvas.parentElement.appendChild(newCanvas);
    }
  }

  function removeTempCanvas() {
    const { tempCanvas } = state;

    if (!tempCanvas) return;

    tempCanvas.remove();
  }

  function updateToolMode(paintTool: PaintTool) {
    updateState({ paintTool });
  }

  function updateCanvasStyle({
    strokeStyle,
    lineWidth
  }: Partial<{ strokeStyle: string; lineWidth: number }>) {
    const { ctx } = state;

    if (!ctx) return;

    if (strokeStyle !== undefined) {
      ctx.strokeStyle = strokeStyle;
    }

    if (lineWidth !== undefined) {
      ctx.lineWidth = lineWidth;
    }
  }

  function resetCanvas() {
    drawGrid();

    const { ctx } = state;

    if (!ctx) return;
    clearCanvas(ctx, canvas);
  }

  function downloadCanvas() {
    const { ctx, tempCanvas } = state;

    if (!ctx || !tempCanvas) return;

    const combinedCanvas = document.createElement('canvas');

    const { width, height } = canvas.getBoundingClientRect();

    combinedCanvas.width = width;
    combinedCanvas.height = height;

    const newCtx = combinedCanvas.getContext('2d');

    if (newCtx) {
      newCtx.drawImage(tempCanvas, 0, 0);
      newCtx.drawImage(canvas, 0, 0);
    }

    const a = document.createElement('a');
    a.download = `${Date.now()}.jpg`;
    a.href = combinedCanvas.toDataURL();
    a.click();
    a.remove();
    combinedCanvas.remove();
  }

  function init() {
    state = getInitialState();
    addTempCanvas();
    registerEventListeners();
    drawGrid();
  }

  function dispose() {
    removeEventListeners();
    removeTempCanvas();
  }

  return {
    init,
    dispose,
    updateToolMode,
    updateCanvasStyle,
    resetCanvas,
    downloadCanvas
  };
}

export type PaintApp = ReturnType<typeof paintApp>;
