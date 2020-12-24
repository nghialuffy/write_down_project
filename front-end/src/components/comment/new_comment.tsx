import React, { useContext, useState } from 'react';
import { DataAccess } from '../../access';
import { UserContext } from '../../context';
import { Button, Comment, Form, notification } from 'antd';
import { UserAvatar } from '..';
import TextArea from 'antd/lib/input/TextArea';
import { useHistory } from 'react-router-dom';

type NewCommentProps = {
    onSubmit: () => void
    parent_id?: string
    post_id: string,
}

export function NewComment({ onSubmit, parent_id, post_id }: NewCommentProps) {
    const history = useHistory();
    const userContext = useContext(UserContext);
    const [value, setValue] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = () => {
        if (!value) {
            return;
        }
        setSubmitting(true);
        const payload = parent_id ? {
            parent: parent_id,
            content: value
        } : { content: value };
        DataAccess.Post(`post/${post_id}/comment`, JSON.stringify(payload)).then(() => {
            setValue('');
            setSubmitting(false);
            onSubmit();
        }).catch(e => {
            if (e.response) {
                if (e.response.status === 401) {
                    history.push('/login');
                }
            }
            setSubmitting(false);
        });

    };

    const handleChange = (e: any) => {
        setValue(e.target.value);
    };

    return (
    <Comment
        avatar={
            <UserAvatar data={userContext} />
        }
        content={
            <div>
                <Form.Item>
                    <TextArea rows={3} onChange={handleChange} value={value} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
                        Add Comment
                    </Button>
                </Form.Item>
            </div>
        }
    />
    );
}