import React from 'react';
import './navbar.css';

const Navbar = () => {
    const handleServiceClick = (event) => {
        event.preventDefault();
        const serviceSection = document.getElementById('service-section');
        if (serviceSection) {
            serviceSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar ml-[400px]">
            <a className="font-Outfit" href="#service-section" onClick={handleServiceClick}>Service</a>
            <a className="font-Outfit">About us</a>
            <a className="font-Outfit">ClothAI</a>
            <a className="font-Outfit">Contact</a>
            <button className="bg-[#0F0F0F] font-Outfit text-white rounded-full px-4 py-2 mt-[-8px] w-36 h-10 text-sm">Shop now</button>
        </nav>
    );
};

export default Navbar;