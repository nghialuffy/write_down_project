import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { AppWrap } from '../../../components';

import { Input, Form, Select } from 'antd';
import { Categories } from '../../../constants';



export function NewPostPage() {
    let [value, setValue] = useState("");
    let [category, setCategory] = useState(Categories[0].value);
    let [tags, setTags] = useState([]);
    let handleCategoryChange = (e: any) => {
        console.log(e);
        setCategory(e);
        console.log(category);
    }
    let handleEditorChange = (e: any) => {
        setValue(e.target.getContent());
        console.log(value);
    }
    let handleTagsChange = (value:any) =>{
        setTags(value);
        console.log(tags);
    }
    return (
        <AppWrap>
            <Form className='new-post-form'>
                <Input type="text" placeholder="Title"></Input>
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
                <Form.Item
                    label="Tags"
                    hasFeedback
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select at least 3 tags"
                        onChange={handleTagsChange}
                        options={Categories}
                    />
                </Form.Item>
                <Form.Item
                    label="Category"
                    hasFeedback
                >
                    <Select allowClear options={Categories} style={{ width: 200 }} value = {category} onChange={handleCategoryChange} />
                </Form.Item>
            </Form>
        </AppWrap>

    )
}
