import React from 'react';
import { useParams } from 'react-router-dom';
import { useEntityData } from '../../access';
import { PostDetailType } from '../../model';
import { LoadingFullView } from '../loading';
import { OldComment } from './comment';
import { NewComment } from './new_comment';
import './style.scss';


export function ListComment () {
    let { postId } = useParams<{ postId: string }>();
    const {loading, data, status, reload} = useEntityData<PostDetailType>(`post/${postId}`);

    return (
        <>
        <div className='list-comment'>
            {loading && <LoadingFullView />}
            {data && data.list_comment.length !== 0 &&
                data.list_comment.map(item => {
                    return <OldComment data={{...item, post_id: data._id}} onReply={reload}/>;
                })
            }  
        </div>
        <NewComment post_id={postId} onSubmit={reload} />
        </>
    );
}