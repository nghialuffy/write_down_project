import React, { useState } from 'react';
import './style.scss';

export function HoverProfile () {
    const [showInfo, setShowInfo] = useState(false);
    return (
        <span onMouseOver={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)}>
            <a href={`/profile/username`} className='username'>
                Username
            </a>
            {showInfo && <div className='user-info'>
                
            </div>}
        </span>
    );
}