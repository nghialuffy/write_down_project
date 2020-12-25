import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Input, Form, Select, Button, notification } from 'antd';
import { Categories } from '../../constants';
import { DataAccess } from '../../access';
import { useHistory } from 'react-router-dom';
import { HTTPCodeLabel } from '../../const';

type PostEditorProps = {
    title?: string,
    oldContent?: string,
    category?: string,
    postId?: string,
}

export function PostEditor({title, oldContent, category, postId}: PostEditorProps) {
    const [new_post_form] = Form.useForm();
    let history = useHistory();
    let [content, setContent] = useState(oldContent ?? '');
    console.log('content', content);

    let handleEditorChange = (e: any) => {
        setContent(e);
    }

    const onFinish = (value: any) => {
        let data = {
            "title": value.title ?? title,
            "content": content,
            "list_hashtag": [],
            "category": value.category ?? category,
        };
        if (!postId) {
            DataAccess.Post('post', JSON.stringify(data))
            .then(
                res => {
                    if (res) history.push(`/post-detail/${res.data}`);
                    notification.success({
                        message: "Post successfully!"
                    });
                }
            )
            .catch(e => {
                notification.error({
                    message: "Error",
                    description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                });
            });
        } else {
            DataAccess.Put(`post/${postId}`, JSON.stringify(data))
            .then(
                res => {
                    if (res) history.go(0);
                    notification.success({
                        message: "Edit succesfully!"
                    });
                }
            )
            .catch(e => {
                notification.error({
                    message: "Error",
                    description: e.response ? `[${e.response.status}] ${HTTPCodeLabel(e.response.status)}` : `[${500}] ${HTTPCodeLabel('500')}`
                });
            });
        }
       
    }
    return (
        <Form form={new_post_form}
            className="new-post-form"
            onFinish={onFinish}>
            <Form.Item
                name="title"
                rules={[{message: 'Please input Title!' }]}>
                <Input type="text" placeholder="Title" defaultValue={title}></Input>
            </Form.Item>
            <Form.Item
                name="editor">
                <Editor
                    apiKey="unjo0maub5xvytcqn7sb3ilawv9s91yy05kwktk2f3sbzaiw"
                    initialValue={oldContent}
                    init={{
                        height: 500,
                        paste_data_images: true,
                        menubar: false,
                        plugins: [
                            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                            "searchreplace wordcount visualblocks visualchars code fullscreen",
                            "insertdatetime media nonbreaking save table contextmenu directionality",
                            "emoticons template paste textcolor colorpicker textpattern powerpaste"
                        ],
                        toolbar:
                            "insertfile undo redo | fontselect fontsizeselect formatselect | forecolor backcolor |bold italic underline "
                            + "| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image "
                    }}
                    onEditorChange={handleEditorChange}
                />
            </Form.Item>
            <Form.Item
                label="Category"
                name="category"
                hasFeedback
            >
                <Select
                    options={Categories} style={{ width: 200 }} defaultValue={category}/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit"  >Submit</Button>
            </Form.Item>
        </Form>
    )
}
