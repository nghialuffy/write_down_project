import React, { useEffect, useState } from 'react';
import Icon from '@ant-design/icons';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Icon as IconImage } from '../../assets/Images';
import './style.scss';

export function MenuSideBar() {
    const location = useLocation();
    let { type } = useParams<{type: string}>();

    const processPath = (type: string) => {
        const currentPath = location.pathname;
        const path = currentPath.split('/');
        return `${path.slice(0, path.length - 1).join('/')}${type}`
    }
    console.log("processPath('hot')", processPath('hot'));

    return (
        <div className='menu-side-bar'>
            <div className={`item ${type === 'hot' && 'active'}`}>
                <div className='menu-icon' >
                    <Icon component={IconImage.fire} />
                </div>
                <Link to={processPath('hot')}>Đang hot</Link>
            </div>
            <div className={`item ${type === 'new' && 'active'}`}>
                <div className='menu-icon'>
                    <Icon component={IconImage.star} />
                </div>
                <Link to={processPath('new')}>Mới nhất</Link>
            </div>
            <div className={`item ${type === 'controversial' && 'active'}`}>
                <div className='menu-icon'>
                    <Icon component={IconImage.heart_beat} />
                </div>
                <Link to={processPath('controversial')}>Sôi nổi</Link>
            </div>
            <div className={`item ${type === 'top' && 'active'}`}>
                <div className='menu-icon'>
                    <Icon component={IconImage.crown} />
                </div>
                <Link to={processPath('top')}>Top</Link>
            </div>
        </div>
    );
}