"use client";

import React from 'react';
import CustomDiv from './desktop_selector';
import './desktop selector.css';

export default function Page() {
    const texts = [
        "Discover <br/> Clothes",
        "Find <br/> Outfits",
        "Discover  <br/>Finds",
        "Configure<br/> Style",
        "New <br/> Arrivals"
    ];

    const linkTexts = [
        "SHOP NOW",
        "EXPLORE ",
        "EXPLORE ",
        "CONFIGURE ",
        "EXPLORE"
    ];

    return (
        <div>
            <h1 className="title">We are the way to your next Outfit</h1>
            <div className="flex-container">
                {texts.map((text, index) => (
                    <CustomDiv key={index} text={text} linkText={linkTexts[index]} />
                ))}
            </div>
        </div>
    );
}