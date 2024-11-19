"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../components/navbar.js";
import ScrollContext from "@/components/SmoothScrool";
import FillingText from "../components/FillingText";
import ImageEffect from "@/components/image_man_side";
import SelectImages from "@/components/imageComponents/NoLand";
import AiImage from "@/components/imageComponents/ai";

export default function Home() {
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            const circle = document.querySelector(".circle");
            if (circle) {
                const circleSize = circle.offsetWidth / 2;
                circle.style.transform = `translate3d(${clientX - circleSize}px, ${clientY - circleSize}px, 0)`;
            }
        };

        const handleScroll = () => {
            setIsAtTop(window.scrollY === 0);
        };

        document.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <ScrollContext>
                <div className="w-screen h-screen bg-transparent relative">
                    <Navbar/>
                    <div className="circle z-20"></div>
                    <div className="grid place-items-center gap-5">
                        <span
                            className="title font-AudioNugget text-[160px] mt-32 select-none flex justify-center z-10">
                            STYLEEASE
                        </span>
                    </div>

                    <div
                        className={`absolute bottom-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-transparent border-solid border-black border-2 rounded-full flex items-center justify-center z-30 animate-bounce ${
                            isAtTop ? "block" : "hidden"
                        }`}
                    >
                        <span className="text-black text-2xl">&#x2193;</span>
                    </div>
                    <div className="w-screen h-[100vw] bg-[#5E6A51] mt-[580px]">
                        <div
                            className="flex items-center justify-center text-center p-4"
                            style={{position: "relative", top: "100px"}}
                        >
                            <FillingText
                                text={
                                    "Unleash your unique style with our Fashion Configurator!\n" +
                                    "Find perfect-fitting pieces for everyday looks or bold statements,\n" +
                                    "tailored to express who you are. Start curating a wardrobe\n" +
                                    "that reflects your individuality with ease."
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <SelectImages
                            imageSrc={"/noland.webp"}
                            topText="Configure your style"
                            bottomRightText="Find out more"
                        />
                    </div>




                </div>
            </ScrollContext>
        </>
    );
}