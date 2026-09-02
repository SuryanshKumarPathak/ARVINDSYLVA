import { useEffect } from 'react';
import { captureAttribution } from '../utils/attribution';

/**
 * Captures UTM params on mount and persists them in sessionStorage.
 * Call this once at the top of the app (LandingPage).
 */
const useUTMCapture = () => {
  useEffect(() => {
    captureAttribution();
  }, []);
};

export default useUTMCapture;
