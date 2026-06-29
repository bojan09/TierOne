import { createContext } from 'react';
import type { AuthContextValue } from './types';

/** Auth context. Kept in its own module so component files only export components. */
export const AuthContext = createContext<AuthContextValue | null>(null);
