import React from 'react';
import { Card, Row, Col, Modal } from 'antd';
import './ui.less'

export default class Gallery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            imgList: [],
            currentImg: ''
        }
    }

    componentWillMount() {
        const imgs = [
            ['1.png', '2.png', '3.png', '4.png', '5.png'],
            ['6.png', '7.png', '8.png', '9.png', '10.png'],
            ['11.png', '12.png', '13.png', '14.png', '15.png'],
            ['16.png', '17.png', '18.png', '19.png', '20.png'],
            ['21.png', '22.png', '23.png', '24.png', '25.png']
        ];

        const imgList = imgs.map((list) => list.map((item) =>
            <Card
                style={{marginBottom: 10}}
                cover={<img src={"/gallery/" + item} onClick={()=>this.openGallery(item)} />}
            >
                <Card.Meta
                    title="my life"
                    description="大学美好时光"
                />
            </Card>
        ));

        this.setState({
            imgList: imgList,
        })
    }

    render () {
        return(
            <div className="card-wrap">
                <Row gutter={10}>
                    {this.state.imgList.map((item)=><Col md={5}>{item}</Col>)}
                </Row>
                <Modal
                    width={350}
                    height={500}
                    visible={this.state.visible}
                    title="图片画廊"
                    onCancel={()=>{
                        this.setState({
                            visible:false
                        })
                    }}
                    footer={null}
                >
                    {<img src={this.state.currentImg} alt="" style={{width:'100%'}}/>}
                </Modal>
            </div>
        )
    }

    openGallery = (imgSrc) => {
        this.setState(
            {
                visible: true,
                currentImg: "/gallery/" + imgSrc,
            }
        )
    }
}
