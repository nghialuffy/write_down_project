import React from 'react';
import { BaseTag, ComposeHeader } from '../../index';
import './styles.scss';

export function FeatutedTags() {
    return (
        <div className='featured-tags'>
            <ComposeHeader>Tags nổi bật</ComposeHeader>
            <div className='list-tags'>
                <BaseTag label='Quan điểm' value='quan-diem' />
                <BaseTag label='Sách' value='sach' />
                <BaseTag label='Review sách' value='review-sach' />
            </div>
        </div>
    );
} 