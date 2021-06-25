import React, { Component } from 'react'
import { Layout, Menu } from 'antd';
import { Switch, Route, Link } from 'react-router-dom';
import PrivateRouter from '../../components/privateRotuer';
import ContextContainer from './components/ContentContainer';
import './index.css';
import XueYuanLieBiao from '../xueyuan/XueYuanLieBiao';
import YuanGongLieBiao from '../yuangong/YuanGongLieBiao';

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

export class Index extends Component {
    render() {
        return (
            <div className="App">
                <Layout>
                    <Header className="header">
                        <div className="logo" />
                        {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                            <Menu.Item key="1">nav 1</Menu.Item>
                            <Menu.Item key="2">nav 2</Menu.Item>
                            <Menu.Item key="3">nav 3</Menu.Item>
                        </Menu> */}
                    </Header>
                    <Layout>
                        <Sider width={200} className="site-layout-background">
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['index']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%', borderRight: 0 }}
                            >
                                <Menu.Item key="index" icon>
                                    首页
                                </Menu.Item>
                                <SubMenu key="jiaowuzhongxin" icon title="教务中心">
                                    <Menu.Item key="xueyuangaunli">学员管理</Menu.Item>
                                    <Menu.Item key="banjigaunli">班级管理</Menu.Item>
                                    <Menu.Item key="laoshiguanli">老师管理</Menu.Item>
                                    <Menu.Item key="kechengguanli">课程管理</Menu.Item>
                                    <Menu.Item key="shangkejilu">上课记录</Menu.Item>
                                </SubMenu>

                                <SubMenu key="xiaoshouzhongxin" icon title="销售中心">
                                    <Menu.Item key="xueyuandangan">学员档案</Menu.Item>
                                    <Menu.Item key="xueyuanbaoming">学员报名</Menu.Item>
                                    <Menu.Item key="xufeiyujing">续费预警</Menu.Item>
                                    <Menu.Item key="shitingjilu">试听记录</Menu.Item>
                                    <Menu.Item key="chengzhangjilu">成长记录</Menu.Item>
                                </SubMenu>

                                <SubMenu key="caiwuzhongxin" icon title="财务中心">
                                    <Menu.Item key="jiaofeijilu">缴费记录</Menu.Item>
                                    <Menu.Item key="tuizhuankejilu">退转课记录</Menu.Item>
                                    <Menu.Item key="laoshikeshijilu">老师课时记录</Menu.Item>
                                </SubMenu>

                                <SubMenu key="jigoushezhi" icon title="机构设置">
                                    <Menu.Item key="yuangongguanli">
                                        <Link to="/sys/yuangongguanli"></Link>员工管理</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '24px 24px 24px' }}>
                            {/* <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                                <Breadcrumb.Item>List</Breadcrumb.Item>
                                <Breadcrumb.Item>App</Breadcrumb.Item>
                                </Breadcrumb> */}
                            <ContextContainer>
                                <Switch>
                                    <Route exact key="xueyuanliebiao" path="/sys/xueyuanliebiao" component={XueYuanLieBiao} />
                                    <Route exact key="yuangongliebiao" path="/sys/yuangongguanli" component={YuanGongLieBiao} />
                                </Switch>
                            </ContextContainer>
                        </Layout>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default Index;
