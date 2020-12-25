import { Button } from 'antd';
import React from 'react';
import { LoadingFullView } from '../../loading';
import './style.scss';

type BaseButtonProps = {
    children: React.ReactNode
    type?: 'primary' | 'default' | 'danger',
    loading?: boolean,
    className?: string
    containerProps?: React.HTMLAttributes<HTMLButtonElement>
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
}

export function BaseButton ({
    children,
    type = 'default',
    className,
    onClick,
    containerProps,
    loading,
}: BaseButtonProps) {
    return (
        <button className={['base-button', className, `btn-${type}`].filter(Boolean).join(' ')}
            onClick={(e) => {
                onClick && onClick(e);
                if (e) e.stopPropagation();
            }}
            {...containerProps}
        >
            {loading && <LoadingFullView size='small' className='opacity'/>}
            {children}
        </button>
    );
}