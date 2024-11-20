import { forwardRef, memo } from 'react';

export const PaintApp = memo(
  forwardRef(
    (
      props: JSX.IntrinsicElements['canvas'],
      ref: React.ForwardedRef<HTMLCanvasElement>
    ) => {
      return (
        <canvas
          ref={ref}
          {...props}
        ></canvas>
      );
    }
  )
);
