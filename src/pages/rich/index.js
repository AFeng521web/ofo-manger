import React from 'react';
import { Button, Card, Modal } from 'antd';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Editor } from 'react-draft-wysiwyg';
import draftjs from 'draftjs-to-html';

export default class RichText extends React.Component {

    state = {
        showRichText: false,
        editorContent: '',
        editorState: ''
    };

    render() {
        const { editorContent, editorState } = this.state;
        return(
            <div>
                <Card style={{marginTop: 10}}>
                    <Button type="primary" onClick={this.handleClearContent}>清空内容</Button>
                    <Button type="primary" onClick={this.handleGetText}>获取HTML文本</Button>
                </Card>
                <Card title="富文本编辑器">
                    <Editor
                        editorState={editorState}
                        onContentStateChange={this.onContentStateChange}
                        onEditorStateChange={this.onEditorStateChange}
                    />
                </Card>
                <Modal
                    title="富文本"
                    visible={this.state.showRichText}
                    onCancel={()=>{
                        this.setState({
                            showRichText: false
                        })
                    }}
                    footer={null}
                >
                    {draftjs(editorContent)}
                </Modal>
            </div>
        )
    }

    //清空富文本编辑器中的内容
    handleClearContent = ()=> {
        this.setState({
            editorState: '',
        })
    };

    //控制模态框的显示
    handleGetText = ()=> {
        this.setState({
            showRichText: true
        })
    };

    //每当编辑器状态发生变化时调用函数，传递的函数参数是RawDraftContentState类型的对象。
    onContentStateChange = (editorContent)=> {
        console.log("onContentStateChange");
        this.setState({
            editorContent: editorContent,
        })
    };

    //每次编辑器状态发生变化时调用函数，传递的函数参数是EditorState类型的对象。
    onEditorStateChange = (editorState)=> {
        console.log("onEditorStateChange");
        this.setState({
            editorState: editorState
        })
    };
}
