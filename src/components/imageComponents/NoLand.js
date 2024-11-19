import React, { useEffect } from 'react';
import './imageComponentsStyles/NoLand.css';

const SelectImages = ({ imageSrc, topText, bottomRightText }) => {
    useEffect(() => {
        const imageContainer = document.querySelector('.image-container');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    } else {
                        entry.target.classList.remove('visible');
                    }
                });
            },
            { threshold: 0.1 } // Adjust the threshold as needed
        );

        if (imageContainer) {
            observer.observe(imageContainer);
        }

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
        };
    }, []);

    return (
        <div className="image-container mt-[70%] ml-20">
            <img src={imageSrc} alt="Selected Image" className="responsive-image" />
            <div className="text-overlay top font-Outfit font-bold">{topText}</div>
            <div className="text-overlay bottom-right font-Outfit">{bottomRightText}</div>
        </div>
    );
};

export default SelectImages;