import { useCallback, useContext, useMemo } from 'react';

import OverlayContext from './OverlayContext';
import OverlayIdContext from './OverlayIdContext';
import type { OverlayPush } from './types';

const useOverlay = () => {
  const overlayContext = useContext(OverlayContext);
  const overlayIdContext = useContext(OverlayIdContext);

  if (!overlayContext) {
    throw new Error('useOverlay must be used within an OverlayContext.');
  }

  const pop = useCallback(() => {
    return overlayContext.pop();
  }, [overlayContext]);

  const push: OverlayPush = useCallback(
    (children, param) => {
      overlayContext.push(children, {
        className: param?.className || overlayContext.className,
        closeOnBack: param?.closeOnBack || overlayContext.closeOnBack,
        unmountOn: param?.unmountOn || overlayContext.unmountOn,
        closeOnBackdropClick: param?.closeOnBackdropClick || overlayContext.closeOnBackdropClick,
        onExit: param?.onExit,
        onClose: param?.onClose,
      });
    },
    [overlayContext],
  );

  const close = useCallback(() => {
    overlayContext.close(overlayIdContext);
  }, [overlayIdContext]);

  return useMemo(
    () => ({
      push,
      pop,
      close,
    }),
    [pop, push, close],
  );
};

export default useOverlay;
