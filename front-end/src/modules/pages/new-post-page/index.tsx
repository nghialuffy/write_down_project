import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { AppWrap, BaseDropDown } from '../../../components';
import Form from 'antd/lib/form/Form';
import { Input } from 'antd';
import { Categories } from '../../../constants';
import { Link } from 'react-router-dom';
function handleEditorChange(e: any) {
    console.log(
        'Content was updated:',
        e.target.value
    );
}

export function NewPostPage() {
    const [value, setValue] = useState("");
    // const handleEditorChange = (e: any) => {
    //     // setValue(e.target.getContent());
    //     console.log("Content:" + value);
    //     setValue(e.target.getContent())
        
    // }
    return (
        <AppWrap>
            <Form>
                <Input type="text" placeholder="Title"></Input>
                <Editor
                    apiKey="unjo0maub5xvytcqn7sb3ilawv9s91yy05kwktk2f3sbzaiw"
                    initialValue="<p>Initial content</p>"
                    value={value}
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
                <div>Tags:<Input type="text" ></Input></div>
                <BaseDropDown
                        button='Chọn chủ đề'
                        data={Categories}
                        Item={CategoryLink}
                    />
            </Form>
        </AppWrap>

    )
}
function CategoryLink({ data }: { data: typeof Categories[0] }) {
    return (
        // <Link to={`/posts/${data.value}`} className='link'>{data.label}</Link>
        <p>{data.label}</p>
    )
}