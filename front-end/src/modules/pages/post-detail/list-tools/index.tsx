import React from 'react';
import { CaretUpOutlined, CaretDownOutlined, EyeOutlined, MessageOutlined } from '@ant-design/icons';
import { useEntityData } from '../../../../access';
import { PostDetailType } from '../../../../model';
import { useParams } from 'react-router-dom';
import './style.scss';

export function ListTool() {
    let { postId } = useParams<{ postId: string }>();
    const {loading, data, status, reload} = useEntityData<PostDetailType>(`post/${postId}`);

    const voteHandler = () => {

        reload();
    };

    return data ? (
        <div className='list-tools'>
            <div className='tool'>
                <CaretUpOutlined disabled onClick={voteHandler}/>
                {data.vote}
                <CaretDownOutlined onClick={voteHandler}/>
            </div>
            <div className='tool'>
                <EyeOutlined />
                {data.views}
            </div>
            <div className='tool'>
                <MessageOutlined />
                {data.list_comment.length}
            </div>
        </div>
    ): null;
};