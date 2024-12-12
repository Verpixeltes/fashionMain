import React from 'react';
import PropTypes from 'prop-types';
import './desktop selector.css';

const CustomDiv = ({ text, linkText }) => {
    return (
        <div className="container">
            <p className="text" dangerouslySetInnerHTML={{ __html: text }}></p>
            <a href="/shopping" className="link">{linkText}&rarr;</a>
        </div>
    );
};

CustomDiv.propTypes = {
    text: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
};

export default CustomDiv;