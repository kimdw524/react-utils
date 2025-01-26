import { useContext, useEffect, useRef } from 'react';
import OverlayContext from './OverlayContext';
import type { OverlayProps } from './types';

const Overlay = ({
  children,
  id,
  isActive,
  className,
  closeOnBackdropClick,
  unmountOn,
  requestUnmount,
}: OverlayProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);

  const overlayContext = useContext(OverlayContext);

  if (!overlayContext) {
    throw new Error('OverlayContext is not defined.');
  }

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    if (isActive) {
      if (className?.base) {
        wrapperRef.current.classList.add(className.base);
      }

      if (className?.enter) {
        // eslint-disable-next-line
        wrapperRef.current.offsetTop;
        wrapperRef.current.classList.add(className.enter);
      }
      return;
    }

    switch (unmountOn) {
      case 'exit': {
        requestUnmount();
        break;
      }
      case 'transitionEnd': {
        if (className?.enter) {
          wrapperRef.current.classList.add(className.exit);
        }
        break;
      }
      default: {
        timerRef.current = setTimeout(() => {
          requestUnmount();
        }, Number(unmountOn));
      }
    }
  }, [wrapperRef, isActive]);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== wrapperRef.current || isActive || unmountOn !== 'transitionEnd') {
      return;
    }

    requestUnmount();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.target !== wrapperRef.current || !isActive || !closeOnBackdropClick) {
      return;
    }

    overlayContext.close(id);
  };

  return (
    <div ref={wrapperRef} onTransitionEnd={handleTransitionEnd} onClick={handleClick}>
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
};

export default Overlay;
