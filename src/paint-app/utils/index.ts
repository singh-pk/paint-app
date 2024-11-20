import { PaintTool, type State } from '../lib';

export function getInitialState(): State {
  return {
    isDrawing: false,
    tempCanvas: null,
    tempCtx: null,
    ctx: null,
    paintTool: PaintTool['BRUSH']
  };
}

export function convertStringToPx(value: string | number) {
  return value + 'px';
}
