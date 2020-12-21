import React from 'react';
import './style.scss';

type BaseButtonProps = {
    children: React.ReactNode
    type?: 'primary' | 'default' | 'danger'
    className?: string
    containerProps?: React.HTMLAttributes<HTMLButtonElement>
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export function BaseButton ({
    children,
    type = 'default',
    className,
    onClick,
    containerProps
}: BaseButtonProps) {
    return (
        <button className={['base-button', className, `btn-${type}`].filter(Boolean).join(' ')}
            onClick={(e) => {
                onClick && onClick(e);
                if (e) e.stopPropagation();
            }}
            {...containerProps}
        >
            {children}
        </button>
    );
}