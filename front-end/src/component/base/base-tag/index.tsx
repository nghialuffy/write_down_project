import React from 'react';
import './style.scss';

type BaseTagProps = {
    text: string
    link: string
    type?: 'primary' | 'normal'
    className?: string
    containerProps?: React.HTMLAttributes<HTMLElement>
}

export function BaseTag({
    type = 'normal',
    className,
    containerProps,
    text,
    link
} : BaseTagProps) {
    return (
        <a className={['base-tag', type, className].filter(Boolean).join(' ')}
            href={link}
            {...containerProps}
            >
            {text}
        </a>
    )
}