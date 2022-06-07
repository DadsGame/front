import { useEffect, useState } from 'react';

const breakpoints = {
  550: 'sml',
  1920: 'large',
};

const useBreakpoint = () => {
  const [breakpoint, setBreakPoint] = useState({});
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    if (windowSize.width <= 700) {
      setBreakPoint({
        breakPointName: breakpoints[700],
        slides: 2,
        width: Math.ceil(windowSize.height / 5),
        height: windowSize.height / 4,
      });
    }
    if (windowSize.width >= 700) {
      setBreakPoint({
        breakPointName: breakpoints[1920],
        slides: Math.ceil(windowSize.width / (windowSize.height / 4)),
        width: Math.ceil(windowSize.height / 5),
        height: Math.ceil(windowSize.height / 4),
      });
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [windowSize.width]);
  return breakpoint;
};

export default useBreakpoint;
