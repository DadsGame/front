import { useEffect, useState } from 'react';

const breakpoints = {
    550:  'sml',
    1920: 'large',
}

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

        if (windowSize.width <= 550) {
            setBreakPoint({breakPointName: breakpoints[550], slides: parseInt( windowSize.width / 280)});
        }
        if (windowSize.width >= 550 ) {
            setBreakPoint({breakPointName: breakpoints[1920], slides: parseInt( windowSize.width / 280)});
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [windowSize.width]);
    return breakpoint;
};

export default useBreakpoint;
