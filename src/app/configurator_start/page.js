"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const containerRef = useRef(null);
    const [activeNumber, setActiveNumber] = useState(1); // Start with number 1 as active
    const lastScrollTime = useRef(0);

    useEffect(() => {
        const container = containerRef.current;

        const handleWheel = (event) => {
            event.preventDefault(); // Prevent normal scrolling behavior

            const currentTime = Date.now();
            const timeDiff = currentTime - lastScrollTime.current;
            lastScrollTime.current = currentTime;

            // Adjust multipliers for faster scrolling
            const fastScroll = timeDiff < 100; // Less than 100ms between scrolls → fast scrolling
            const baseSpeed = 1; // Base speed for each scroll movement
            const fastScrollMultiplier = fastScroll ? 1.0 : 0.3; // More speed for fast scrolling
            const slowScrollMultiplier = 0.1; // Standard speed for slow scrolling

            // Calculate the step size used for scrolling
            const scrollSpeed =
                Math.abs(event.deltaY) * baseSpeed * (fastScroll ? fastScrollMultiplier : slowScrollMultiplier);

            // Calculate the new scroll value based on the scroll direction
            const newScrollLeft =
                container.scrollLeft + (event.deltaY > 0 ? scrollSpeed : -scrollSpeed);

            // Set the scroll value within the bounds of the container
            container.scrollLeft = Math.max(
                0,
                Math.min(newScrollLeft, container.scrollWidth - container.clientWidth)
            );
        };

        const handleScroll = () => {
            const containerRect = container.getBoundingClientRect();
            const containerCenter = containerRect.left + containerRect.width / 2;
            const children = Array.from(container.children);
            let closestChild = null;
            let closestDistance = Infinity;

            // Determine the number closest to the current position
            for (let child of children) {
                const childRect = child.getBoundingClientRect();
                const childCenter = childRect.left + childRect.width / 2;
                const distance = Math.abs(containerCenter - childCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestChild = child;
                }
            }

            if (closestChild) {
                const activeNum = parseInt(closestChild.textContent);
                if (!isNaN(activeNum)) {
                    setActiveNumber(activeNum);
                }
            }
        };

        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
            container.addEventListener("scroll", handleScroll);

            handleScroll();

            return () => {
                container.removeEventListener("wheel", handleWheel);
                container.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    const numbers = Array.from({ length: 99 }, (_, i) => i + 1);

    return (
        <div>
            <h1>Horizontal Scroll with Mouse Wheel (1-99)</h1>
            <div
                ref={containerRef}
                style={{
                    userSelect: "none",
                    width: "100%",
                    height: "400px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                {/* Dynamically calculated padding */}
                <div
                    style={{
                        width: "50%", // Padding equals half the width of the container
                        flexShrink: 0,
                    }}
                ></div>
                {numbers.map((number) => {
                    const distance = Math.abs(number - activeNumber); // Distance from active number
                    const opacity =
                        distance > 3 ? 0 : 1 - distance * 0.33; // Fully hidden after 3, gradual fade for 1-3

                    return (
                        <div
                            key={number}
                            style={{
                                width: "200%", // Adjusted to the number size
                                fontSize: "150px",
                                fontWeight: "bold",
                                color: number === activeNumber ? "black" : "gray",
                                display: "inline-block",
                                textAlign: "center",
                                margin: "0 30px",
                                transform: number === activeNumber ? "scale(2)" : "scale(1)",
                                transition: "transform 0.2s, opacity 0.2s", // Smooth opacity transition
                                opacity: opacity, // Apply calculated opacity
                            }}
                        >
                            {number}
                        </div>
                    );
                })}
                <div
                    style={{
                        width: "50%", // Padding equals half the width of the container
                        flexShrink: 0,
                    }}
                ></div>
            </div>
        </div>
    );
}