export interface PaintAppProps {
  canvas: HTMLCanvasElement;
}

export interface CanvasEventListener {
  type: keyof HTMLElementEventMap;
  listener: Parameters<HTMLCanvasElement['addEventListener']>['1'];
}

export enum PaintTool {
  BRUSH = 'brush',
  ERASER = 'eraser'
}

export interface State {
  isDrawing: boolean;
  tempCanvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  tempCtx: CanvasRenderingContext2D | null;
  paintTool: PaintTool;
}
