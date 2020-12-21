import React from 'react';
import { AppWrap, BaseList } from '../../../components';
import { UserCategory } from '../../../constants';
import { CategoryItem } from './category-item';
import './style.scss';

export function ListCategoriesPage() {
    return (
        <AppWrap>
            <BaseList<typeof UserCategory[0]> 
                data={UserCategory} 
                Item={CategoryItem as any} 
                className='list-categories layout-container'
            />
        </AppWrap>
    )
}