import { useCallback, useContext, useMemo } from 'react';
import OverlayContext from './OverlayContext';
import type { OverlayPush } from './types';

const useOverlay = () => {
  const overlayContext = useContext(OverlayContext);

  if (!overlayContext) {
    throw new Error('OverlayContext is not defined.');
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

  return useMemo(
    () => ({
      push,
      pop,
    }),
    [pop, push],
  );
};

export default useOverlay;
