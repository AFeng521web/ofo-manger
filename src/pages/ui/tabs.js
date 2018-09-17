import React from 'react';
import { Card, Tabs, message, Icon } from 'antd';
import './ui.less';

const TabPane= Tabs.TabPane;

export default class Tab extends React.Component {

    newTabIndex = 0;

    constructor(props) {
        super(props);
        this.state = {
            panes: [
                {
                    title:'Tab 1',
                    content: 'Tab 1',
                    key:'1'
                },
                {
                    title: 'Tab 2',
                    content: 'Tab 2',
                    key: '2'
                },
                {
                    title: 'Tab 3',
                    content: 'Tab 3',
                    key: '3'
                }
            ]
        }
    }

    handleCallback =(key) => {
        message.info("Hi, 您选择了页签" + key);
    };

    componentWillMount() {
        this.setState({
            activeKey: this.state.panes[0].key
        })
    };

    handleTabChange = (activeKey) => {
        this.setState({
            activeKey
        })
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };

    add = () => {
        const panes = this.state.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push({ title: activeKey, content: 'New Tab Pane', key: activeKey });
        this.setState({ panes, activeKey });
    };

    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({ panes, activeKey });
    };

    render() {
        return (
            <div>
                <Card title="Tab标签页" className="card-wrap">
                    <Tabs defaultActiveKey="1" onChange={this.handleCallback}>
                        <TabPane tab="Tab 1" key="1">欢迎学习React进阶实战课程</TabPane>
                        <TabPane tab="Tab 2" key="2">欢迎学习React进阶实战课程</TabPane>
                        <TabPane tab="Tab 3" key="3">欢迎学习React进阶实战课程</TabPane>
                    </Tabs>
                </Card>
                <Card title="Tab带图的页签" className="card-wrap">
                    <Tabs defaultActiveKey="1" onChange={this.handleCallback}>
                        <TabPane tab={<span><Icon type="plus" />Tab 1</span>} key="1">欢迎学习React进阶实战课程</TabPane>
                        <TabPane tab={<span><Icon type="edit" />Tab 2</span>} key="2">欢迎学习React进阶实战课程</TabPane>
                        <TabPane tab={<span><Icon type="delete" />Tab 3</span>} key="3">欢迎学习React进阶实战课程</TabPane>
                    </Tabs>
                </Card>
                <Card title="Tab带图的页签" className="card-wrap">
                    <Tabs
                        onChange={this.handleTabChange}
                        activeKey={this.state.activeKey}
                        type="editable-card"
                        onEdit={this.onEdit}
                    >
                        {
                            this.state.panes.map((pane1)=>{
                                return <TabPane
                                    tab={pane1.title}
                                    key={pane1.key}
                                />
                            })
                        }
                    </Tabs>
                </Card>
            </div>
        )
    }


}
