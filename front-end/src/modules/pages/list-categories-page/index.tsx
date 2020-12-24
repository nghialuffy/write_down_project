import { Empty } from 'antd';
import React, { useContext } from 'react';
import { useEntityData } from '../../../access';
import { AppWrap, BaseList, LoadingFullView } from '../../../components';
import { UserContext } from '../../../context';
import { CategoryType, ListCategoryType } from '../../../model';
import { CategoryItem } from './category-item';
import './style.scss';

export function ListCategoriesPage() {
    const {loading, data, status} = useEntityData<ListCategoryType>('categories/');
    return (
        <AppWrap>
            {loading && <LoadingFullView size='large'/>}
            {data ? <BaseList<CategoryType> 
                data={data.data as any} 
                Item={CategoryItem} 
                className='list-categories layout-container'
            /> : <Empty description='Sorry,something went wrong!' />}
        </AppWrap>
    )
}