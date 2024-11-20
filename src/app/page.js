"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../components/navbar.js";
import ScrollContext from "@/components/SmoothScrool";
import FillingText from "../components/FillingText";
import ImageEffect from "@/components/image_man_side";
import SelectImages from "@/components/imageComponents/NoLand";
import ImageAI from "@/components/imageComponents/ai";
import RoundedImage from "@/components/imageComponents/RoundedImage";
import "./styles/page.texts.css";

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
                <div className="w-full h-screen bg-transparent relative">
                    <Navbar/>
                    <div className="circle z-20"></div>
                    <div className="grid place-items-center gap-5 w-full">
                        <span
                            className="title font-AudioNugget mt-32 select-none flex justify-center z-10">
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
                    <div className="w-full h-[110vw] bg-[#5E6A51] mt-[750px]">
                        <div
                            className="flex items-center justify-center text-center p-4 w-full"
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

                        <div className="w-full h-full flex flex-col items-center">
                            <span id="service-section"
                                  className="text-sm text-white tracking-[5px] absolute mr-[80%] mt-[8%] font-Outfit">Service</span>
                            <p className={"text-white font-Outfit text-4xl mr-[54%] mt-[10%] font-bold"}>The Fashion
                                World is a Universe<br/>
                                Let Us Be Your Guide to Discovering<br/>
                                Your Style!</p>
                            <p className={"text-[50vw] absolute ml-[50%] select-none mt-[-15%] text-[#F4F0E5] text-bold font-Outfit"}>*</p>
                            <div
                                className="w-10 h-[250px] mr-[82%] mt-[5%] grid grid-rows-2">
                                <SelectImages
                                    imageSrc={"/noland.webp"}
                                    topText="Configure your style"
                                    bottomRightText="Find out more"
                                />
                            </div>
                            <div
                                className="w-10 h-[250px] ml-[-10%] mt-[20%] grid grid-rows-2 gap-8">
                                <ImageAI
                                    imageSrc={"/ai.jpg"}
                                    topText="Find Fashion with AI"
                                    bottomRightText="Find out more"
                                />
                            </div>
                            <div className={"mt-[-40%] ml-[10%]"}>
                                <RoundedImage
                                    imageSrc="/men_side.jpg"
                                    alt="Description of the image"
                                    animationDirection="right" // or "right"
                                />
                            </div>
                            <div className={"mt-[30%] ml-[-80%]"}>
                                <RoundedImage
                                    imageSrc="/image.jpg"
                                    alt="Description of the image"
                                    animationDirection="left"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[100vw] bg-[#EBE7E4] relative">
                        <div className="absolute w-full">
                            <p className="text-black font-Outfit text-[250px] font-bold leading-tight mt-44 ml-32">
                                Digital
                            </p>
                            <p className="text-black font-Outfit text-[250px] font-bold leading-tight mt-44 ml-[80%]">
                                Fashion
                            </p>

                            <p className="text-gray-500 font-Outfit text-lg mt-4">
                                Skip the endless scrolling and embrace smart, customized fashion. Let our AI
                                elevate your wardrobe with recommendations tailored just for you!
                            </p>
                        </div>
                        <div
                            className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gray-300 rounded-[30px] -z-10"></div>
                    </div>
                </div>
            </ScrollContext>
        </>
    );
}