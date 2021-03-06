import React from 'react';
import { useParams } from 'react-router-dom';
import { useEntityData } from '../../access';
import { ListCommentType } from '../../model';
import { LoadingFullView } from '../loading';
import { OldComment } from './comment';
import { NewComment } from './new_comment';
import './style.scss';


export function ListComment () {
    let { postId } = useParams<{ postId: string }>();
    const {loading, data, status, reload} = useEntityData<ListCommentType>(`post/${postId}/comment`);

    return (
        <>
        <div className='list-comment'>
            {loading && <LoadingFullView className='opacity'/>}
            {data && data.list_comment.length !== 0 &&
                data.list_comment.map(item => {
                    return <OldComment data={{...item, post_id: postId}} onReply={reload}/>;
                })
            }  
        </div>
        <NewComment post_id={postId} onSubmit={reload} />
        </>
    );
}