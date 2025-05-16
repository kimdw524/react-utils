'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Overlay from './Overlay';
import OverlayContext from './OverlayContext';
import OverlayIdContext from './OverlayIdContext';
import type { OverlayProps, OverlayProviderProps, OverlayPush } from './types';

const OverlayProvider = ({
  children,
  className,
  closeOnBack = true,
  closeOnBackdropClick = true,
  unmountOn = 'exit',
}: OverlayProviderProps) => {
  const [overlays, setOverlays] = useState<OverlayProps[]>([]);
  const countRef = useRef<number>(0);

  const removeOverlay = useCallback((id: number) => {
    setOverlays((overlays) => overlays.filter((overlay) => overlay.id !== id));
  }, []);

  const close = useCallback(
    (id: number) => {
      setOverlays((overlays) =>
        overlays.map((overlay) => {
          if (overlay.id === id) {
            return {
              ...overlay,
              isActive: false,
            };
          }

          return overlay;
        }),
      );
    },
    [overlays],
  );

  const pop = useCallback(
    (isBack: boolean = false) => {
      const last = overlays.findLast((overlay) => overlay.isActive && (!isBack || overlay.closeOnBack));

      if (!last) {
        return false;
      }

      close(last.id);

      return true;
    },
    [overlays, close],
  );

  const push: OverlayPush = useCallback(
    (children, option) => {
      const id = ++countRef.current;

      setOverlays((overlays) => [
        ...overlays,
        {
          isActive: true,
          id,
          children,
          requestUnmount() {
            removeOverlay(id);
          },
          ...option,
        },
      ]);

      if (option?.closeOnBack) {
        window.history.pushState({}, '', '');
      }
    },
    [removeOverlay],
  );

  const contextValue = useMemo(
    () => ({ className, closeOnBack, closeOnBackdropClick, unmountOn, push, pop, close }),
    [className, closeOnBack, closeOnBackdropClick, unmountOn, push, pop, close],
  );

  useEffect(() => {
    const handlePopState = () => {
      pop(true);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pop]);

  return (
    <OverlayContext.Provider value={contextValue}>
      {children}
      {overlays.map((overlay) => (
        <OverlayIdContext.Provider key={overlay.id} value={overlay.id}>
          <Overlay {...overlay}>{overlay.children}</Overlay>
        </OverlayIdContext.Provider>
      ))}
    </OverlayContext.Provider>
  );
};

export default OverlayProvider;
