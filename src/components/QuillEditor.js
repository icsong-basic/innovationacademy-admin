import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ReactQuillImageUploader, {
    saveImageSrc,
} from 'react-quill-image-uploader'
import apis from '../apis'

class QuillEditor extends React.Component {
    state = {}

    modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [
                    {
                        'color': [
                            '#000000',
                            '#FFFFFF',
                            '#0074D9',
                            '#7FDBFF',
                            '#39CCCC',
                            '#3D9970',
                            '#2ECC40',
                            '#01FF70',
                            '#FFDC00',
                            '#FF851B',
                            '#FF4136',
                            '#85144b',
                            '#F012BE',
                            '#B10DC9',
                            '#111111',
                            '#AAAAAA',
                            '#DDDDDD',
                        ]
                    },
                    {
                        'background': [
                            '#000000',
                            '#FFFFFF',
                            '#0074D9',
                            '#7FDBFF',
                            '#39CCCC',
                            '#3D9970',
                            '#2ECC40',
                            '#01FF70',
                            '#FFDC00',
                            '#FF851B',
                            '#FF4136',
                            '#85144b',
                            '#F012BE',
                            '#B10DC9',
                            '#111111',
                            '#AAAAAA',
                            '#DDDDDD',
                        ]
                    }],
                [
                    { align: '' }, { align: 'center' }, { align: 'right' },
                    { 'list': 'ordered' }, { 'list': 'bullet' },
                    { 'indent': '-1' }, { 'indent': '+1' }
                ],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: () => {
                    const { clientX, y: clientY } = window.event
                    const position = { x: clientX, y: clientY } // position the plugin to show
                    this.ReactQuillImageUploaderRef.toggle(position) // show or hide the plugin
                    // toggle() is also ok
                    // this.ReactQuillImageUploaderRef.toggle()
                },
            },
        },
    }

    formats = [
        'align',
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'color', 'background',
    ];

    componentDidMount() {
        this.quill = this.quillRef.getEditor()
        this.setState({ quill: this.quill })
    }

    uploadImageCallBack = (file, base64) => {
        // check file.size
        // check file type by file.name

        return new Promise((resolve, reject) => {
            if (base64) {
                this.ReactQuillImageUploaderRef.insertImg(base64)
                resolve();
                return;
            }
            apis.dataController.uploadData('images', file).then(response => {
                this.ReactQuillImageUploaderRef.insertImg(response.data.url)
                resolve()
            }).catch(error => {
                reject()
            })
        })
    }
    render() {
        const { modules, className = '', placeholder = '이미지 업로드 최대용량은 20MB입니다.' } = this.props
        return (
            <div>
                <ReactQuill
                    ref={el => {
                        this.quillRef = el
                    }}
                    placeholder={placeholder}
                    modules={modules || this.modules}
                    formats={this.formats}
                    className={className}
                    value={this.props.value}
                    onChange={this.props.onChange}
                />
                <ReactQuillImageUploader
                    ref={el => {
                        this.ReactQuillImageUploaderRef = el
                    }}

                    isShowUploadFail={true}
                    isShowHistory={false}
                    quill={this.state.quill}
                    uploadCallback={this.uploadImageCallBack}
                />
            </div>
        )
    }
}
export default QuillEditor;