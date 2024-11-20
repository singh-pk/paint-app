import { useCallback, useMemo, useState } from 'react';

import { usePaintAppSelector } from 'paint-app/react';
import { PaintTool } from 'paint-app';

import styles from './PaintToolSelector.module.css';

export const PaintToolSelector = () => {
  const [isSelected, setIsSelected] = useState<PaintTool>(PaintTool['BRUSH']);
  const paintInstance = usePaintAppSelector(store => store.paintInstance);

  const drawingOptions: { id: PaintTool; label: string }[] = useMemo(
    () => [
      { id: PaintTool['BRUSH'], label: 'Brush' },
      { id: PaintTool['ERASER'], label: 'Eraser' }
    ],
    []
  );

  const actions = useMemo(
    () => [
      {
        id: 'reset',
        label: 'Reset',
        onClick: () => paintInstance?.resetCanvas()
      },
      {
        id: 'export',
        label: 'Export',
        onClick: () => paintInstance?.downloadCanvas()
      }
    ],
    [paintInstance]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const id = (e.target as HTMLButtonElement).getAttribute(
        'id'
      ) as PaintTool | null;

      if (id && paintInstance) {
        setIsSelected(id);
        paintInstance.updateToolMode(id);
      }
    },
    [paintInstance]
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      paintInstance?.updateCanvasStyle({ strokeStyle: e.target.value });
    },
    [paintInstance]
  );

  return (
    <div
      onClick={handleClick}
      className={styles.paintToolSelector}
    >
      {drawingOptions.map(d => (
        <button
          id={d.id}
          key={d.id}
          aria-selected={d.id === isSelected}
          className={styles.btn}
        >
          {d.label}
        </button>
      ))}

      <input
        type='color'
        className={styles.input}
        onChange={handleColorChange}
      />

      {actions.map(d => (
        <button
          key={d.id}
          className={styles.btn}
          onClick={d.onClick}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
};
