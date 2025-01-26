import type { ReactNode } from 'react';

export interface OverlayStyle {
  base?: string;
  enter?: string;
  exit?: string;
}

export interface OverlayOption {
  className?: OverlayStyle;
  closeOnBack?: boolean;
  closeOnBackdropClick?: boolean;
  unmountOn?: 'exit' | 'transitionEnd' | number;
}

export interface OverlayPushOption extends OverlayOption {
  onExit?: () => void;
  onClose?: () => void;
}

export type OverlayPush = (children: ReactNode, option?: OverlayPushOption) => void;

export interface UseOverlay {
  pop: (isBack?: boolean) => boolean;
  push: OverlayPush;
}

export type OverlayContextType = (UseOverlay & OverlayOption & { close: (id: number) => void }) | undefined;

export interface OverlayProps extends OverlayPushOption {
  children: ReactNode;
  isActive: boolean;
  id: number;
  requestUnmount?: () => void;
}

export interface OverlayProviderProps extends OverlayOption {
  children: ReactNode;
}
