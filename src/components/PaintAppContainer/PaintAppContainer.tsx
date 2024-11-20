import { useEffect, useRef } from 'react';

import {
  PaintApp,
  usePaintAppDispatch,
  usePaintAppSelector
} from 'paint-app/react';
import { paintApp } from 'paint-app';

import styles from './PaintAppContainer.module.css';

export const PaintAppContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = usePaintAppDispatch();
  const paintInstance = usePaintAppSelector(store => store.paintInstance);

  useEffect(() => {
    if (canvasRef.current) {
      dispatch({ paintInstance: paintApp({ canvas: canvasRef.current }) });
    }
  }, []);

  useEffect(() => {
    if (paintInstance) {
      paintInstance.init();
      return paintInstance.dispose;
    }
  }, [paintInstance]);

  return (
    <PaintApp
      ref={canvasRef}
      className={styles.canvas}
    />
  );
};
