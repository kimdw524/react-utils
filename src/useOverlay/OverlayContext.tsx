import { createContext } from 'react';

import type { OverlayContextType } from '@/useOverlay/types';

const OverlayContext = createContext<OverlayContextType>(undefined);

export default OverlayContext;
