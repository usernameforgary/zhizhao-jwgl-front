import { Layout, Menu, Button, Row, Col, Space, BackTop } from 'antd';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import ContextContainer from './components/ContentContainer';
import XueYuanLieBiao from '../xueyuan/XueYuanLieBiao';
import YuanGongLieBiao from '../yuangong/YuanGongLieBiao';
import { getStore } from '../../store/useStore';
import { IMainStore, OrderableDataNode } from '../../customtypes';
import XinJianYuanGong from '../yuangong/xinjianyuangong/XinJianYuanGong';
import PrivateRouter from '../../components/privateRotuer';
import Page404 from '../page404/Page404';
import DashBord from '../dashbord/DashBord';
import { useEffect } from 'react';
import { useState } from 'react';
import Loading from '../../components/loading/Loading';
import { convertCaiDanList2TreeData } from '../../utils/converter';
import KeChengLieBiao from '../kecheng/KeChengLieBiao';
import XinJianKeCheng from '../kecheng/xinzengkecheng/XinJianKeCheng';
import XueYuanBaoMing from '../xueyuan/XueYuanBaoMing';
import BanJiLieBiao from '../banji/BanJiLieBiao';

import './index.css';

import logo from '../../images/u128.png'
import BanJiXiangQing from '../banji/BanJiXiangQing';
import JiaoFenJiLu from '../jiaofeijilu/JiaoFenJiLu';
import JiaoFeiJiLuXiangQing from '../jiaofeijilu/jiaofeijiluxiangqing/JiaoFeiJiLuXiangQing';
import XueYuanXiangQing from '../xueyuan/XueYuanXiangQing';
import XueYuanXuanBan from '../xueyuan/xueyuanxuanban/XueYuanXuanBan';
import ShangKeJiLuLieBiao from '../shangkejilu/ShangKeJiLuLieBiao';

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

const Index = () => {
    const userStore = getStore<IMainStore>();

    const history = useHistory();
    const [menuNodes, setMenuNodes] = useState<OrderableDataNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [parentMenuKeySelected, setParentMenuKeySelected] = useState<string[]>([]);
    const [childMenuKeySelected, setChildMenuKeySelected] = useState<string[]>([]);

    // 页面Url发生变化时，重新设定左侧菜单展开项，选中子菜单项目
    useEffect(() => {
        const currentPath = window.location.pathname;
        let selectedParentKey: string[] = [];
        let selectedChildKey: string[] = [];

        menuNodes.forEach(p => {
            // 当前path为父级url
            if (p.url === currentPath) {
                selectedChildKey = [p.key + ""]
                selectedParentKey = [p.key + ""];
                return;
            } else {
                p.children?.forEach(c => {
                    if (c.url === window.location.pathname) {
                        selectedParentKey = [p.key + ""];
                        selectedChildKey = [c.key + ""];
                        return;
                    }
                })
            }
        })
        // TODO子菜单不在左侧显示菜单中的时候，临时解决方案（不重置左侧菜单展开项，选中子菜单项目)
        if (selectedChildKey.length > 0) {
            setParentMenuKeySelected(selectedParentKey);
            setChildMenuKeySelected(selectedChildKey);
        } else {
            if (parentMenuKeySelected.length <= 0) {
                setChildMenuKeySelected(selectedChildKey);
            }
        }
    }, [window.location.pathname]);


    /**
     * 父级菜单点击
     * @param key 选中的key
     */
    const onSubMenueTitleClicked = (key: string) => {
        setParentMenuKeySelected([key])
    }


    const loadProfile = async () => {
        setLoading(true);
        await userStore.loadProfile();
        setLoading(false);
        const nodes = convertCaiDanList2TreeData(userStore.user.xiTongCaiDanZu ?? []);
        setMenuNodes(nodes);
    }

    useEffect(() => {
        loadProfile();
    }, []);

    const logout = () => {
        userStore.logout();
        history.push("/");
    }

    return (
        <div className="App" style={{ height: '100vh' }}>
            {loading ? <Loading /> : ""}
            <Layout>
                <Header className="header">
                    <Row align="middle">
                        <Col span={8}>
                            <img src={logo} style={{ height: 50, width: 100 }} />
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
                            selectedKeys={childMenuKeySelected || ['1408985939801493504']}
                            openKeys={parentMenuKeySelected}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            {/* 左侧菜单列表 */}
                            {menuNodes ? (
                                menuNodes.map(n => {
                                    if (!n.children || n.children.length === 0) {
                                        return (
                                            <Menu.Item key={n.key} icon>
                                                <Link to={n.url ?? ""}>{n.title}</Link>
                                            </Menu.Item>
                                        );
                                    }
                                    return (
                                        <SubMenu
                                            onTitleClick={e => { onSubMenueTitleClicked(e.key) }}
                                            key={n.key} icon title={n.title}
                                        >
                                            {
                                                n.children?.map(cn => {
                                                    return (
                                                        <Menu.Item key={cn.key} icon>
                                                            <Link to={cn.url ?? ""}>{cn.title}</Link>
                                                        </Menu.Item>
                                                    )
                                                })
                                            }
                                        </SubMenu>
                                    );
                                })
                            ) : ""}
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
                                {/* 生成路由, 临时方案 */}
                                <PrivateRouter exact key="yuangongliebiao" path="/sys/yuangongliebiao" component={YuanGongLieBiao} />
                                <PrivateRouter exact key="xinjianyuangong" path="/sys/xinjianyuangong" component={XinJianYuanGong} />
                                <PrivateRouter exact key="xueyuanliebiao" path="/sys/xueyuanliebiao" component={XueYuanLieBiao} />
                                <PrivateRouter exact key="xueyuanxiangqing" path="/sys/xueyuanxiangqing/:id/:tab" component={XueYuanXiangQing} />
                                <PrivateRouter exact key="xueyuanxuanban" path="/sys/xueyuanxuanban/:id" component={XueYuanXuanBan} />
                                <PrivateRouter exact key="kechengliebiao" path="/sys/kechengliebiao" component={KeChengLieBiao} />
                                <PrivateRouter exact key="xinjiankecheng" path="/sys/xinjiankecheng" component={XinJianKeCheng} />
                                <PrivateRouter exact key="xueyuanbaoming" path="/sys/xueyuanbaoming/:xueYuanId?" component={XueYuanBaoMing} />
                                <PrivateRouter exact key="banjiliebiao" path="/sys/banjiliebiao" component={BanJiLieBiao} />
                                <PrivateRouter exact key="banjixiangqing" path="/sys/banjixiangqing/:id/:tab" component={BanJiXiangQing} />
                                <PrivateRouter exact key="jiaofeijilu" path="/sys/jiaofeijilu" component={JiaoFenJiLu} />
                                <PrivateRouter exact key="jiaofeijiluxiangqing" path="/sys/jiaofeijiluxiangqing/:id" component={JiaoFeiJiLuXiangQing} />
                                <PrivateRouter exact key="shangkejiluliebiao" path="/sys/shangkejiluliebiao" component={ShangKeJiLuLieBiao} />
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
