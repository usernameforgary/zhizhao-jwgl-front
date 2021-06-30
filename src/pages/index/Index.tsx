import { Layout, Menu, Button, Row, Col, Space, BackTop } from 'antd';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import ContextContainer from './components/ContentContainer';
import './index.css';
import XueYuanLieBiao from '../xueyuan/XueYuanLieBiao';
import YuanGongLieBiao from '../yuangong/YuanGongLieBiao';
import { getStore } from '../../store/useStore';
import { IMainStore } from '../../customtypes';
import XinJianYuanGong from '../yuangong/xinjianyuangong/XinJianYuanGong';
import PrivateRouter from '../../components/privateRotuer';
import Page404 from '../page404/Page404';
import DashBord from '../dashbord/DashBord';
import { useEffect } from 'react';

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

const Index = () => {
    const userStore = getStore<IMainStore>();
    const history = useHistory();

    useEffect(() => {
        userStore.loadProfile();
    }, []);

    const logout = () => {
        userStore.logout();
        history.push("/");
    }

    return (
        <div className="App" style={{ height: '100vh' }}>
            <Layout>
                <Header className="header">
                    <Row align="middle">
                        <Col span={8}>
                            <div className="logo" />
                        </Col>
                        {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                            <Menu.Item key="1">nav 1</Menu.Item>
                            <Menu.Item key="2">nav 2</Menu.Item>
                            <Menu.Item key="3">nav 3</Menu.Item>
                        </Menu> */}
                        <Col span={16} >
                            <Row justify="end">
                                <Space>
                                    <Button type="primary">导入导出</Button>
                                    <Button type="primary">帮助</Button>
                                    <Button type="primary">修改密码</Button>
                                    <Button onClick={logout} type="primary">退出登录</Button>
                                </Space>
                            </Row>
                        </Col>
                    </Row>
                </Header>
                <Layout>
                    <Sider width={200} className="site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['index']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <Menu.Item key="dashborad" icon>
                                <Link to="/sys">首页</Link>
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
                                    <Link to="/sys/yuangongguanli">员工管理</Link>
                                </Menu.Item>
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
                                <PrivateRouter exact key="xueyuanliebiao" path="/sys/xueyuanliebiao" component={XueYuanLieBiao} />
                                <PrivateRouter exact key="yuangongliebiao" path="/sys/yuangongguanli" component={YuanGongLieBiao} />
                                <PrivateRouter exact key="xinjianyuangong" path="/sys/xinjianyuangong" component={XinJianYuanGong} />
                                <PrivateRouter exact key="dashboard" path="/sys" component={DashBord}></PrivateRouter>
                                <Route path="*" component={Page404} />
                            </Switch>
                        </ContextContainer>

                    </Layout>
                </Layout>
            </Layout>
            <BackTop visibilityHeight={64}>
            </BackTop>
        </div>
    )
}

export default Index;
