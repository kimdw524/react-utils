'use client';

import { createContext } from 'react';
import type { OverlayContextType } from './types';

const OverlayContext = createContext<OverlayContextType>(undefined);

export default OverlayContext;
