import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

type BaseTagProps = {
    value: string
    label: string
    type?: 'primary' | 'normal'
    className?: string
    containerProps?: React.HTMLAttributes<HTMLElement>
}

export function BaseTag({
    type = 'primary',
    label,
    className,
    containerProps,
    value,
} : BaseTagProps) {
    return (
        <Link className={['base-tag', type, className].filter(Boolean).join(' ')}
            to={`/posts/tags/${value}`}
            {...containerProps}
            >
            {label}
        </Link>
    )
}