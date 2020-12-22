import React from 'react';
import { useEntityDataList } from '../../../access';
import { AppWrap, BaseList, LoadingFullView } from '../../../components';
import { TopUserType } from '../../../model';

export function TopWriterPage () {
    const {loading, data} = useEntityDataList<TopUserType>('topuser');
    return(
        <AppWrap>
            {loading && <LoadingFullView />}
            {data && <BaseList<TopUserType> data={data as any} Item={TopWriterPage}/>}
        </AppWrap>
    )
}