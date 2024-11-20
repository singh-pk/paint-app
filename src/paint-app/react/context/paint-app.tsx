import type { PaintApp } from '../../paint-app';
import { createOptimizedContext } from './createOptimizedContext';

interface PaintAppContext {
  paintInstance: PaintApp | null;
}

export const {
  Provider: PaintAppProvider,
  useStoreSelector: usePaintAppSelector,
  useStoreDispatch: usePaintAppDispatch
} = createOptimizedContext<PaintAppContext>({ paintInstance: null });
