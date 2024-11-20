"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import './imageComponentsStyles/RoundedImage.css';

const RoundedImage = ({ imageSrc, animationDirection }) => {
    const imageContainerRef = useRef(null);

    useEffect(() => {
        const imageContainer = imageContainerRef.current;

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

        return () => {
            if (imageContainer) {
                observer.unobserve(imageContainer);
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div ref={imageContainerRef} className={`image-container-round ${animationDirection === 'right' ? 'slide-in-right' : 'slide-in-left'}`}>
            <Image src={imageSrc} alt="Selected Image" className="responsive-image-round select-none" layout="fill" objectFit="cover" />
        </div>
    );
};

export default RoundedImage;