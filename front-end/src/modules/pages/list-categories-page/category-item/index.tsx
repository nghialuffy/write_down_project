import { url } from 'inspector';
import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryImage } from '../../../../assets/Images';
import { BaseButton } from '../../../../components';
import './style.scss';

type CategoryType = {
    value: keyof typeof CategoryImage
    label: string
    follow: boolean
    _id: string
}

export function CategoryItem({ data }: { data: CategoryType }) {
    console.log('image', CategoryImage[data.value].default)
    return (
        <Link 
            to={`/posts/${data.value}`}
            className='category-item' 
            style={{backgroundImage: `url(${CategoryImage[data.value].default})`}}
        >
            <div className='category-label'>{data.label}</div>
            <BaseButton type={data.follow ? 'primary' : 'default'} className='btn-follow'>
                {data.follow ? 'Huỷ theo dõi' : 'Theo dõi'}
            </BaseButton>
        </Link>
    )
} 