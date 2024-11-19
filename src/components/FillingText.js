"use client";
import { useState, useEffect } from "react";

export default function FillingText({ text }) {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            const totalScroll = (scrollTop / (docHeight - windowHeight)) * 100;
            setScrollProgress(Math.min(totalScroll, 100));
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const lines = text.split("\n");

    return (
        <div className="flex flex-col items-center w-full px-4">
            {lines.map((line, index) => {
                const startThreshold = index * 10;
                const endThreshold = startThreshold + 10;
                const progress = Math.min(
                    Math.max((scrollProgress - startThreshold) / (endThreshold - startThreshold), 0),
                    1
                );

                return (
                    <span
                        key={index}
                        className="text-[34px] font-bold tracking-wider text-center"
                        style={{
                            backgroundImage: `linear-gradient(90deg, white ${progress * 100}%, transparent ${progress * 100}%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            WebkitTextStroke: "1px white", // Umrandung
                            backgroundClip: "text", // Sicherheitshalber für andere Browser
                            display: "inline-block",
                            width: "100%", // Volle Breite nutzen
                            whiteSpace: "nowrap", // Verhindert Zeilenumbrüche
                        }}
                    >
                        {line}
                    </span>
                );
            })}
        </div>
    );
}
