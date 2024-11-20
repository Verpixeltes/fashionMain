'use client';

import { useEffect, useState, createContext, useContext } from "react";

import Lenis from "lenis";

const SmoothScrollerContext = createContext();

export const useSmoothScroller = () => useContext(SmoothScrollerContext);

export default function ScrollContext({ children }) {
    const [lenisRef, setLenis] = useState(null);
    const [rafState, setRaf] = useState(null);

    useEffect(() => {
        const scroller = new Lenis(
            {
        });
        let raf;

        function rafTime(time) {
            scroller.raf(time);
            requestAnimationFrame(rafTime);
        }

        raf = requestAnimationFrame(rafTime);
        setRaf(raf);
        setLenis(scroller);

        return () => {
            if (lenisRef) {
                cancelAnimationFrame(rafState);
                lenisRef.destroy();
            }
        };
    }, []);

    return (
        <SmoothScrollerContext.Provider value={lenisRef}>
            {children}
        </SmoothScrollerContext.Provider>
    );
}
