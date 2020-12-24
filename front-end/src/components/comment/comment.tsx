import React, { useState } from 'react';
import { Comment } from 'antd';
import { CommentType, ReplyType } from '../../model';
import { UserAvatar } from '../user-avatar';
import { BaseList } from '../base';
import { NewComment } from './new_comment';
import { useParams } from 'react-router-dom';


type CommmentProps = {
    data: CommentType & { post_id: string },
    onReply: () => void
}

export function OldComment({ data, onReply }: CommmentProps) {
    let { postId } = useParams<{ postId: string }>();
    const [showNewComment, setShowNewComment] = useState(false);

    const submitHandler = () => {
        setShowNewComment(false);
        onReply();
    }

    return (
        <Comment
            content={data.content}
            author={data.created_by.display_name}
            avatar={<UserAvatar data={data.created_by} />}
            datetime={data.created_date}
            actions={[<span key="comment-basic-reply-to" onClick={() => setShowNewComment(true)}>Reply to</span>]}
            className='old-content'
        >
            {data.list_comment.length !== 0 &&
                <BaseList<ReplyType>
                    data={data.list_comment}
                    Item={Reply}
                />
            }
            {showNewComment && <NewComment parent_id={data._id} onSubmit={submitHandler} post_id={postId}/>}
        </Comment>
    );
}

export function Reply({ data }: { data: ReplyType }) {
    return (
        <Comment
            content={data.content}
            author={data.created_by.display_name}
            avatar={<UserAvatar data={data.created_by} />}
            datetime={data.created_date}
        />
    );
}


