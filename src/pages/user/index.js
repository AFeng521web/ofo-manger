import React from 'react';
import { Card, Button, Table, Form, Input, Checkbox,Select,Radio, Icon, message, Modal, DatePicker } from 'antd';
import axios from './../../axios';
import Utils from './../../utils/utils';
import BaseForm from './../../components/BaseForm';
import ETable from './../../components/ETable';
import Moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.Area;
const Option = Select.Option;

export default class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        }
    }


    params = {
        page: 1
    };

    formList = [
        {
            type: 'INPUT',
            label: '用户名',
            field: 'user_name',
            placeholder: '请输入用户名称',
            width: 140,
        },
        {
            type: 'INPUT',
            label: '手机号',
            field: 'user_mobile',
            placeholder: '请输入用户手机号',
            width: 140,
        },
        {
            type: 'DATE',
            label: '入职日期',
            field: 'offer_data',
            placeholder: '请输入入职日期',
        }
    ];

    componentDidMount() {
        this.requestList();
    }

    handleFilter = (params) => {
        this.params = params;
        this.requestList();
    };

    requestList = () => {
        axios.requestList(this, '/table/basic/list.json', this.params)
    };

    //功能区操作
    handleOperate = (type) => {
        let item = this.state.selectedItem;
        if(type == 'create') {
            this.setState({
                type: type,
                isVisible: true,
                title: '创建员工'
            });
        } else if(type == 'edit') {
            if(!item) {
                Modal.info({
                    title: '提示',
                    content: '请选择一个用户'
                });
                return;
            }
            this.setState({
                type,
                isVisible: true,
                title: '编辑员工',
                userInfo: item
            })
        } else if(type == 'detail') {
            this.setState({
                type,
                isVisible: true,
                title: '员工详情',
                userInfo: item
            })
        } else if(type=="delete"){
            if(!item){
                Modal.info({
                    title: '信息',
                    content: '请选择一个用户'
                });
                return;
            }
            Modal.confirm({
                title: '删除用户',
                content: '您确定要删除此用户吗',
                onOk:()=>{
                    axios.ajax({
                        url:'/table/basic/list.json',
                        data:{
                            params:{
                                id:item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.code == 0){
                            this.setState({
                                isVisible:false
                            });
                            this.requestList();
                        }
                    })
                }
            })
        }
    };

    //创建员工提交
    handleSubmit = () => {
        let type = this.state.type;
        let data = this.userForm.props.form.getFieldsValue();
        axios.ajax({
            url:type == 'create'?'/table/basic/list.json':'/table/basic/list.json',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res.code ==0){
                this.setState({
                    isVisible:false
                });
                this.requestList();
            }
        })
    };

    render() {
        const columns = [{
            title: 'id',
            dataIndex: 'id'
        }, {
            title: '用户名',
            dataIndex: 'userName'
        }, {
            title: '性别',
            dataIndex: 'sex',
            render(sex){
                return sex ==1 ?'男':'女'
            }
        }, {
            title: '状态',
            dataIndex: 'state',
            render(state){
                let config = {
                    '1':'咸鱼一条',
                    '2':'风华浪子',
                    '3':'北大才子一枚',
                    '4':'百度FE',
                    '5':'创业者'
                };
                return config[state];
            }
        },{
            title: '爱好',
            dataIndex: 'interest',
            render(interest){
                let config = {
                    '1':'游泳',
                    '2':'打篮球',
                    '3':'踢足球',
                    '4':'跑步',
                    '5':'爬山',
                    '6':'骑行',
                    '7':'桌球',
                    '8':'麦霸'
                };
                return config[interest];
            }
        },{
            title: '爱好',
            dataIndex: 'isMarried',
            render(isMarried){
                return isMarried?'已婚':'未婚'
            }
        },{
            title: '生日',
            dataIndex: 'birthday'
        },{
            title: '联系地址',
            dataIndex: 'address'
        },{
            title: '早起时间',
            dataIndex: 'time'
        }
        ];

        //控制模态框的底部显示或隐藏
        let footer = {};
        if(this.state.type == 'detail') {
            footer = {
                footer: null
            }
        }

        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
                </Card>
                <Card style={{marginTop: 10}}>
                    <Button type="primary" icon="plus" onClick={()=>this.handleOperate('create')}>创建员工</Button>
                    <Button type="primary" icon="edit" onClick={()=>this.handleOperate('edit')}>编辑员工</Button>
                    <Button type="primary" onClick={()=>this.handleOperate('detail')}>员工详情</Button>
                    <Button type="primary" icon="delete" onClick={()=>this.handleOperate('delete')}>删除员工</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        columns={columns}
                        dataSource={this.state.list}
                        selectedItem={this.state.selectedItem}
                        pagination={this.state.pagination}
                        selectedRowKeys={this.state.selectedRowKeys}
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    width={600}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible: false,
                            userInfo:''
                        })
                    }}
                    {...footer}
                >
                    <UserForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst } />
                </Modal>
            </div>
        )
    }
}


class UserForm extends React.Component{

    getState = (state)=>{
        return {
            '1':'咸鱼一条',
            '2':'风华浪子',
            '3':'北大才子一枚',
            '4':'百度FE',
            '5':'创业者'
        }[state]
    };

    render() {

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}

        };
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};

        /*return (
            <Form layout="horizontal">
                <FormItem label="用户名" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.username:
                        getFieldDecorator('user_name',{
                            initialValue: userInfo.username
                        })(
                            <Input type="text" placeholder="请输入用户名" />
                        )
                    }
                </FormItem>
                <FormItem label="性别" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.sex==1?'男':'女':
                        getFieldDecorator('sex',{
                            initialValue: userInfo.sex
                        })(
                            <RadioGroup>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                            </RadioGroup>
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?this.getState(userInfo.state):
                        getFieldDecorator('state', {
                            initialValue: userInfo.state
                        })(
                            <Select>
                                <Option value={1}>咸鱼一条</Option>
                                <Option value={2}>风华浪子</Option>
                                <Option value={3}>北大才子</Option>
                                <Option value={4}>百度FE</Option>
                                <Option value={5}>创业者</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="生日" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.birthday:
                        getFieldDecorator('birthday', {
                            initialValue: Moment(userInfo.birthday)
                        })(
                            <DatePicker />
                        )
                    }
                </FormItem>
                <FormItem label="联系地址" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.address:
                        getFieldDecorator('address', {
                            initialValue: userInfo.address,
                        })(
                            <TextArea rows={3} placeholder="请输入联系地址"/>
                        )
                    }
                </FormItem>
            </Form>
        )*/
        return (
            <Form layout="horizontal">
                <FormItem label="姓名" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.userName:
                            getFieldDecorator('userName',{
                                initialValue:userInfo.userName
                            })(
                                <Input type="text" placeholder="请输入姓名"/>
                            )
                    }
                </FormItem>
                <FormItem label="性别" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.sex==1?'男':'女':
                            getFieldDecorator('sex',{
                                initialValue:userInfo.sex
                            })(
                                <RadioGroup>
                                    <Radio value={1}>男</Radio>
                                    <Radio value={2}>女</Radio>
                                </RadioGroup>
                            )}
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?this.getState(userInfo.state):
                            getFieldDecorator('state',{
                                initialValue:userInfo.state
                            })(
                                <Select>
                                    <Option value={1}>咸鱼一条</Option>
                                    <Option value={2}>风华浪子</Option>
                                    <Option value={3}>北大才子一枚</Option>
                                    <Option value={4}>百度FE</Option>
                                    <Option value={5}>创业者</Option>
                                </Select>
                            )}
                </FormItem>
                <FormItem label="生日" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.birthday:
                            getFieldDecorator('birthday',{
                                initialValue:Moment(userInfo.birthday)
                            })(
                                <DatePicker />
                            )}
                </FormItem>
                <FormItem label="联系地址" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.address:
                            getFieldDecorator('address',{
                                initialValue:userInfo.address
                            })(
                                <Input.TextArea rows={3} placeholder="请输入联系地址"/>
                            )}
                </FormItem>
            </Form>
        );
    }
}
UserForm = Form.create({})(UserForm);