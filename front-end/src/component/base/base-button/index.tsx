import { BaseButtonProps } from 'antd/lib/button/button';
import React from  'react';
import './style.scss';

type BaseButton = {
    children: React.ReactNode
    type?: 'primary' | 'default' | 'danger'
    className?: string
    containerProps?: React.HTMLAttributes<HTMLDivElement>
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

export function BaseButton ({
    children,
    type = 'default',
    className,
    onClick,
    containerProps
}: BaseButton) {
    return (
        <button className={['base-button', className, `btn-${type}`].filter(Boolean).join(' ')}>
            {children}
        </button>
    )
}