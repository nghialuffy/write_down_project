import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
function handleEditorChange(e: any) {
    console.log(
        'Content was updated:',
        e.target.getContent()
    );
}
export function NewPostPage() {
    return (
        <Editor
            apiKey="unjo0maub5xvytcqn7sb3ilawv9s91yy05kwktk2f3sbzaiw"
            initialValue="<p>Initial content</p>"
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image',
                    'charmap print preview anchor help',
                    'searchreplace visualblocks code',
                    'insertdatetime media table paste wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic |  alignleft aligncenter alignright | bullist numlist outdent indent | help'
            }}
            onChange={handleEditorChange}
        />
    )
}