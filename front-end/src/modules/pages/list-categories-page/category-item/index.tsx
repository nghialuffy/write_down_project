import { url } from 'inspector';
import React from 'react';
import CategoryImage from '../../../../assets/Images';
import { BaseButton } from '../../../../components';
import './style.scss';

type CategoryType = {
    value: keyof typeof CategoryImage
    label: string
    follow: boolean
}

export function CategoryItem({ data }: { data: CategoryType }) {
    console.log('image', CategoryImage[data.value].default)
    return (
        <div className='category-item' style={{backgroundImage: `url(${CategoryImage[data.value].default})`}}>
            <div className='category-label'>{data.label}</div>
            <BaseButton type={data.follow ? 'primary' : 'default'} className='btn-follow'>
                {data.follow ? 'Huỷ theo dõi' : 'Theo dõi'}
            </BaseButton>
        </div>
    )
} 