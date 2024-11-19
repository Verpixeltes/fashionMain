"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import './imageComponentsStyles/NoLand.css';

const SelectImages = ({ imageSrc, topText, bottomRightText }) => {
    const imageContainerRef = useRef(null);
    const circleRef = useRef(null);

    useEffect(() => {
        const imageContainer = imageContainerRef.current;
        const circle = document.querySelector('.circle');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    } else if (window.scrollY === 0) {
                        entry.target.classList.remove('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (imageContainer) {
            observer.observe(imageContainer);
        }

        const handleScroll = () => {
            if (window.scrollY === 0 && imageContainer) {
                imageContainer.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleScroll);

        const handleMouseEnter = () => {
            if (circle) {
                circle.classList.add('hover');
            }
        };

        const handleMouseLeave = () => {
            if (circle) {
                circle.classList.remove('hover');
            }
        };

        if (imageContainer) {
            imageContainer.addEventListener('mouseenter', handleMouseEnter);
            imageContainer.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (imageContainer) {
                observer.unobserve(imageContainer);
                imageContainer.removeEventListener('mouseenter', handleMouseEnter);
                imageContainer.removeEventListener('mouseleave', handleMouseLeave);
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div ref={imageContainerRef} className="image-container">
            <Image src={imageSrc} alt="Selected Image" className="responsive-image select-none" layout="fill" objectFit="cover" />
            <div className="text-overlay top font-Outfit font-bold">{topText}</div>
            <div className="text-overlay bottom-right font-Outfit">{bottomRightText}</div>
        </div>
    );
};

export default SelectImages;