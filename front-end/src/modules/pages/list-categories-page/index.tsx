import React from 'react';
import { useParams } from 'react-router-dom';
import { AppWrap } from '../../../components';
import { UserCategory } from '../../../constants';
import { CategoryItem } from './category-item';
import './style.scss';

export function ListCategoriesPage() {
    return (
        <AppWrap>
            <div className='list-categories'>
                {UserCategory.map(item => <CategoryItem data={item as any} />)}
            </div>
        </AppWrap>
    )
}