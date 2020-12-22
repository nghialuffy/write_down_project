import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { AppWrap } from '../../../components';

import { Input, Form, Select, Button, notification } from 'antd';
import { Categories } from '../../../constants';
import { DataAccess } from '../../../access';
import { useHistory } from 'react-router-dom';
import { HTTPCodeLabel } from '../../../const';



export function NewPostPage() {
    const [new_post_form] = Form.useForm();
    let history = useHistory();
    let [value, setValue] = useState("");
    let [category, setCategory] = useState(Categories[0].value);
    let [tags, setTags] = useState([]);
    let handleCategoryChange = (e: string) => {
        console.log(e);
        setCategory(e);
        console.log(category);
    }
    let handleEditorChange = (e: any) => {
        setValue(e.target.getContent());
        console.log(value);
    }
    let handleTagsChange = (value: any) => {
        setTags(value);
        console.log(tags);
    }
    const onFinish = (value: any) => {
        let data = {
            "title": value.title,
            "content": value.editor.level.content,
            "list_hashtag": value.tags,
            "category": value.category,
        };
        console.log(data);
        DataAccess.Post('post', JSON.stringify(data))
            .then(
                res => {
                    if (res) history.push(`/post/${res}`);
                    notification.success({
                        message: "Post success!"
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
    return (
        <AppWrap>
            <Form form={new_post_form}
                name="new_post_form"
                onFinish={onFinish}>
                <Form.Item
                    name="title"
                    rules={[{ required: true, message: 'Please input Title!' }]}>
                    <Input type="text" placeholder="Title"></Input>
                </Form.Item>
                <Form.Item
                    name="editor">
                    <Editor
                        apiKey="unjo0maub5xvytcqn7sb3ilawv9s91yy05kwktk2f3sbzaiw"
                        initialValue="<div><div/>"
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
                        onChange={handleEditorChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Tags"
                    name="tags"
                    hasFeedback
                >
                    <Select
                        mode="multiple"
                        placeholder="Please select at least 3 tags"

                        onSelect={handleTagsChange}
                        options={Categories}
                    />
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="category"
                    hasFeedback
                >
                    <Select
                        options={Categories} style={{ width: 200 }}
                        // value={category} 
                        onChange={handleCategoryChange} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit"  >Submit</Button>
                </Form.Item>
            </Form>
        </AppWrap>

    )
}
