import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import './OutfitDiv.css';

const OutfitDiv = forwardRef((props, ref) => {
    const [outfitImages, setOutfitImages] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useImperativeHandle(ref, () => ({
        addImageToOutfit(imageUrl, articleID, price) {
            const existingImage = outfitImages.find(image => image.articleID === articleID);
            if (existingImage) {
                if (window.confirm("You have already added this article. Do you want to add it again?")) {
                    addImage(imageUrl, articleID, price);
                }
            } else {
                addImage(imageUrl, articleID, price);
            }
        }
    }));

    const addImage = (imageUrl, articleID, price) => {
        setOutfitImages(prevImages => {
            const newImages = [...prevImages, { imageUrl, articleID, price }];
            localStorage.setItem('outfitImages', JSON.stringify(newImages));
            return newImages;
        });
        setTotalPrice(prevPrice => prevPrice + price);
    };

    const removeImage = (articleID) => {
        setOutfitImages(prevImages => {
            const imageToRemove = prevImages.find(image => image.articleID === articleID);
            const newImages = prevImages.filter(image => image.articleID !== articleID);
            localStorage.setItem('outfitImages', JSON.stringify(newImages));
            setTotalPrice(prevPrice => prevPrice - imageToRemove.price);
            return newImages;
        });
    };

    useEffect(() => {
        const savedImages = JSON.parse(localStorage.getItem('outfitImages')) || [];
        setOutfitImages(savedImages);
        const savedTotalPrice = savedImages.reduce((sum, image) => sum + image.price, 0);
        setTotalPrice(savedTotalPrice);
    }, []);

    return (
        <div className="outfit-container">
            <div className="outfit-div">
                {outfitImages.length > 0 ? (
                    outfitImages.map((image, index) => (
                        <Image
                            key={index}
                            src={image.imageUrl}
                            alt={`Outfit Image ${index}`}
                            width={200}
                            height={200}
                            onClick={() => removeImage(image.articleID)}
                        />
                    ))
                ) : (
                    <p>No pieces selected</p>
                )}
            </div>
        </div>
    );
});

OutfitDiv.displayName = 'OutfitDiv';

export default OutfitDiv;