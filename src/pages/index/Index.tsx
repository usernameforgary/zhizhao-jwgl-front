import { Layout, Menu, Button, Row, Col, Space, BackTop, Badge } from 'antd';
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
import { CloudServerOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { getDefinedRouteByRouteName, routeName } from '../../router';
import PaiKeJiLuDianPing from '../shangkejilu/dianping/PaiKeJiLuDianPing';
import ChaKanDianPing from '../shangkejilu/dianping/ChaKanDianPing';
import XueYuanDangAn from '../xueyuandangan/XueYuanDangAn';
import LaoShiLieBiao from '../laoshi/LaoShiLieBiao';

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

const Index = () => {
    const userStore = getStore<IMainStore>();

    const history = useHistory();
    const [menuNodes, setMenuNodes] = useState<OrderableDataNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [parentMenuKeySelected, setParentMenuKeySelected] = useState<string[]>([]);
    const [childMenuKeySelected, setChildMenuKeySelected] = useState<string[]>([]);

    // ??????Url???????????????????????????????????????????????????????????????????????????
    useEffect(() => {
        const currentPath = window.location.pathname;
        let selectedParentKey: string[] = [];
        let selectedChildKey: string[] = [];

        menuNodes.forEach(p => {
            // ??????path?????????url
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
        // TODO???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????)
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
     * ??????????????????
     * @param key ?????????key
     */
    const onSubMenueTitleClicked = (key: string) => {
        setParentMenuKeySelected([key])
    }

    /**
     * ??????????????????????????????????????????????????????????????????
     */
    const initialize = async () => {
        setLoading(true);
        await userStore.loadProfile();
        await userStore.huoQuDaiXiaZaiWenJianShu();
        setLoading(false);
        const nodes = convertCaiDanList2TreeData(userStore.user.xiTongCaiDanZu ?? []);
        setMenuNodes(nodes);
    }

    useEffect(() => {
        initialize();
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
                                <Space size={30}>
                                    <Col>
                                        <Link to={getDefinedRouteByRouteName(routeName.dashboard)?.path || "#"}>
                                            <Badge count={userStore.daiXiaZaiWenJianShu}>
                                                <CloudServerOutlined style={{ fontSize: '200%', color: 'white', verticalAlign: "middle" }} />
                                                &nbsp;<span style={{ color: 'white', verticalAlign: "middle" }} >????????????</span>
                                            </Badge>
                                        </Link>
                                    </Col>
                                    <Button disabled type="primary">??????</Button>
                                    <Button disabled type="primary">????????????</Button>
                                    <Button onClick={logout} type="primary">????????????</Button>
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
                            {/* ?????????????????? */}
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
                                {/* ????????????, ???????????? */}
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
                                <PrivateRouter exact key="paikejiludianping" path="/sys/paikejiludianping/:paiKeJiLuId" component={PaiKeJiLuDianPing} />
                                <PrivateRouter exact key="chakandianping" path="/sys/chakandianping/:paiKeJiLuId" component={ChaKanDianPing} />
                                <PrivateRouter exact key="xueyuandangan" path="/sys/xueyuandangan" component={XueYuanDangAn} />
                                <PrivateRouter exact key="laoshiliebiao" path="/sys/laoshiliebiao" component={LaoShiLieBiao} />
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

export default observer(Index);
