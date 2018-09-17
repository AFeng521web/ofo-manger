import React from 'react';
import { Card, Form } from 'antd';
import axios from './../../axios';
import BaseForm from './../../components/BaseForm';

export default class BikeMap extends React.Component {

    state = {};
    map = {};
    params = {
        page:1
    };

    formList = [
        {
            type: '城市'
        },
        {
            type: '时间查询'
        },
        {
            type: 'SELECT',
            label: '订单状态',
            field: 'order-status',
            placeholder: '全部',
            initialValue: '0',
            list: [{id:'0', name:'全部'},{id:'1', name:'进行中'},{id:'2', name:'结束行程'}]
        },
    ];

    handleFilterSubmit = (filterParams)=> {
        this.params = filterParams;
        this.requestList()
    };

    componentDidMount() {
        this.requestList();
    }

    requestList = ()=> {
        axios.ajax({
            url: '/map/bike_list.json',
            data: {
                params: this.params
            }
        }).then((res)=>{
            if(res.code == 0) {
                this.setState({
                    total_count: res.result.total_count
                });
                this.renderMap(res)
            }
        })
    };

    //渲染地图数据
    renderMap = (res)=> {
        let list = res.result.route_list;
        this.map = new window.BMap.Map('container');
        let gps1 = list[0];
        let startPoint = new window.BMap.Point(gps1[0], gps1[1]);
        let gps2 = list[list.length-1];
        let endPoint = new window.BMap.Point(gps2[0], gps2[1]);
        this.map.centerAndZoom(endPoint, 11);

        //添加起始图标
        let startPointIcon = new window.BMap.Icon("/assets/start_point.png", new window.BMap.Size(36, 42), {
            imageSize: new window.BMap.Size(36, 42),
            anchor: new window.BMap.Size(18, 42)
        });
        let bikeMarkerStart = new window.BMap.Marker(startPoint, {icon: startPointIcon});
        this.map.addOverlay(bikeMarkerStart);

        let endPointIcon = new window.BMap.Icon("/assets/end_point.png", new window.BMap.Size(36, 42), {
            imageSize: new window.BMap.Size(36, 42),
            anchor: new window.BMap.Size(18, 42)
        });
        let bikeMarkerEnd = new window.BMap.Marker(endPoint, {icon: endPointIcon});
        this.map.addOverlay(bikeMarkerEnd);

        //第二步：绘制车辆行驶路线
        let routeList = [];
        list.forEach((item)=>{
            routeList.push(new window.BMap.Point(item[0], item[1]));
        });

        let polyLine = new window.BMap.Polyline(routeList,{
            strokeColor: '#ef4136',
            strokeWidth: 3,
            strokeOpacity: 1,
        });
        this.map.addOverlay(polyLine);

        //绘制服务区
        let servicePointList = [];
        let serviceList = res.result.service_list;
        serviceList.forEach((item)=>{
            servicePointList.push(new window.BMap.Point(item.lon, item.lat));
        });
        let polyServiceLine = new window.BMap.Polyline(servicePointList,{
            strokeColor: '#ff8605',
            strokeWidth: 3,
            strokeOpacity: 1,
        });
        this.map.addOverlay(polyServiceLine);

        //绘制自行车分布图
        let bikeList = res.result.bike_list;
        let bikeIcon = new window.BMap.Icon("/assets/bike.jpg", new window.BMap.Size(36, 42), {
            imageSize: new window.BMap.Size(36, 42),
            anchor: new window.BMap.Size(18, 42)
        });
        bikeList.forEach((item) => {
            let point = new window.BMap.Point(item[0], item[1]);
            let bikeMarker = new window.BMap.Marker(point, { icon: bikeIcon });
            this.map.addOverlay(bikeMarker);
        });

        //添加地图控件
        this.addMapControl();
    };

    addMapControl = ()=> {
        let map = this.map;
        let top_right_control = new window.BMap.ScaleControl({anchor: window.BMAP_ANCHOR_TOP_TIGHT});
        let top_right_navigation = new window.BMap.NavigationControl({anchor: window.BMAP_ANCHOR_TOP_RIGHT});
        //添加控件与比例尺
        map.addControl(top_right_control);
        map.addControl(top_right_navigation);
        map.enableScrollWheelZoom(true);
    };

    render() {
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilterSubmit}/>
                </Card>
                <Card style={{marginTop: 10}}>
                    <div>共{this.state.total_count}辆车</div>
                    <div id="container" style={{height: 500}}></div>
                </Card>
            </div>
        )
    }
}
