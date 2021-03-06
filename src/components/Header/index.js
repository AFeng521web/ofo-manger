import React from 'react'
import { Row,Col } from "antd"
import './index.less'
import Util from '../../utils/utils'
import axios from '../../axios/index.js'

export default class Header extends React.Component{
    state = {
        dayPictureUrl: '',
        weather: ''
    };
    componentWillMount(){
        this.getWeatherAPIData();
        this.setState({
            userName:'AFeng'
        });
        setInterval(()=>{
            let sysTime = Util.formateDate(new Date().getTime());
            this.setState({
                sysTime
            })
        },1000);
        setInterval(()=>{
            this.getWeatherAPIData();
        },3600000)

    }

    //JsonP报错代码
    getWeatherAPIData(){
        const city = '西安';
        axios.jsonp({
            url: 'http://api.map.baidu.com/telematics/v3/weather?location='+encodeURIComponent(city)+'&output=json&ak=3p49MVra6urFRGOT9s8UBWr2',
        }).then((res)=>{
            if(res.status == 'success'){
                let data = res.results[0].weather_data[0];
                this.setState({
                    dayPictureUrl: data.dayPictureUrl,
                    weather: data.weather
                })
            }
        })
    }

    render(){
        const { menuType } = this.props;
        return (
            <div className="header">
                <Row className="header-top">
                    {
                        menuType?
                            <Col span="6" className="logo">
                                <img src="/assets/logo-ant.svg" alt=""/>
                                <span>IMooc 通用管理系统</span>
                            </Col>:''
                    }
                    <Col span={menuType?18:24}>
                        <span>欢迎，{this.state.userName}</span>
                        <a href="#">退出</a>
                    </Col>
                </Row>
                {
                    menuType?'':
                        <Row className="breadcrumb">
                            <Col span="6" className="breadcrumb-title">首页</Col>
                            <Col span="10" className="desc">欢迎使用ofo后台管理系统</Col>
                            <Col span="8" className="weather">
                                <span className="date">{this.state.sysTime}</span>
                                <span className="weather-img">
                                    <img src={this.state.dayPictureUrl} alt="" />
                                </span>
                                <span className="weather-detail">
                                    西安 {this.state.weather}
                                </span>
                            </Col>
                        </Row>
                }
            </div>
        );
    }
}
