import React, { useEffect } from 'react';
import './imageComponentsStyles/ai.css';

const AiImage = ({ imageSrc, topText, bottomRightText }) => {
    useEffect(() => {
        const handleScroll = () => {
            const imageContainer = document.querySelector('.image-container-ai');
            const rect = imageContainer.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                imageContainer.classList.add('visible');
            } else {
                imageContainer.classList.remove('visible');
            }
        };

        const handleMouseEnter = () => {
            const circle = document.querySelector('.circle');
            if (circle) {
                circle.classList.add('hover');
            }
        };

        const handleMouseLeave = () => {
            const circle = document.querySelector('.circle');
            if (circle) {
                circle.classList.remove('hover');
            }
        };

        window.addEventListener('scroll', handleScroll);
        const imageContainer = document.querySelector('.image-container-ai');
        imageContainer.addEventListener('mouseenter', handleMouseEnter);
        imageContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            imageContainer.removeEventListener('mouseenter', handleMouseEnter);
            imageContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="image-container-ai mt-[75%] ml-[1000px]">
            <img src={imageSrc} alt="Selected Image" className="responsive-image" />
            <div className="text-overlay top font-Outfit font-bold">{topText}</div>
            <div className="text-overlay bottom-right font-Outfit">{bottomRightText}</div>
        </div>
    );
};

export default AiImage;