import { Empty } from 'antd';
import React from 'react';
import { useEntityData } from '../../../access';
import { AppWrap, BaseList, LoadingFullView, SideBarRight } from '../../../components';
import { TopUserType } from '../../../model';
import { TopWriterItem } from './top-writer-item';
import './style.scss';

export function TopWriterPage() {
    const { loading, data } = useEntityData<{ data: TopUserType[] }>('topuser/');
    return (
        <AppWrap>
            {loading && <LoadingFullView />}
            <div className='layout-container'>
                <div className='left-content'/>
                <div className='main-content'>
                    {data ? <BaseList<TopUserType> data={data.data as any} Item={TopWriterItem} className='top-writer' /> :
                        <Empty description='Sorry, something went wrong!' />}
                </div>
                <div className='right-content'>
                    <SideBarRight />
                </div>
            </div>
        </AppWrap>
    )
}