import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Card, Space, Row, Col, Button } from 'antd'
import { action, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react';
import { XingBie, XueYuanXinXi } from '../../customtypes';
import Loading from '../../components/loading/Loading';
import { huoQuXueYaunXinXi } from '../../services/xueyuan';
import IconMan from '../../components/customicons/gender/IconMan';
import IconWoman from '../../components/customicons/gender/IconWonman';
import MyAvatar from '../../components/customicons/avatar/MyAvatar';
import TagXueYuanZhuangTai from '../../components/tagxuyuanzhuangtai/TagXueYuanZhuangTai';
import MyGender from '../../components/customicons/gender/MyGender';
import BaoDuBanJiTab from './xueyuanxiangqing/BaoDuBanJiTab';

const { TabPane } = Tabs;

type ParamsType = {
    id: string,
    tab: TabNamesXueYuanXiangQing
}

export enum TabNamesXueYuanXiangQing {
    baodubanji = "baodubanji",
    genjinjilu = "genjinjilu",
    xiaofeijilu = "xiaofeijilu",
    shangkejilu = "shangkejilu",
    chengzhangjilu = "chengzhangjilu"
}

class XueYuanStore {
    constructor(id: string, tab: string) {
        this.xueYuanId = id;
        this.setCurrentTab(tab);
        makeObservable(this);
    }

    @observable
    loading: boolean = false;

    @observable
    xueYuanId: string = "";

    @observable
    xueYuanXinXi: XueYuanXinXi | undefined = undefined;

    @observable
    currentTab: TabNamesXueYuanXiangQing | undefined = undefined;

    @action
    setId(id: string) {
        this.xueYuanId = id;
    }

    @action
    setXueYuanXinXin = (v: XueYuanXinXi) => {
        this.xueYuanXinXi = v;
    }

    @action
    getXueYuanXiangQing = async (): Promise<void> => {
        if (this.xueYuanId) {
            this.toggleLoading();
            try {
                const xueYuanXinXi: XueYuanXinXi = await huoQuXueYaunXinXi(this.xueYuanId);
                this.setXueYuanXinXin(xueYuanXinXi);
            } catch (e) { }
            this.toggleLoading();
        }
    }

    @action
    toggleLoading = () => {
        this.loading = !this.loading;
    }

    @action
    setCurrentTab = (tabName: string): void => {
        switch (tabName) {
            case TabNamesXueYuanXiangQing.baodubanji:
                this.currentTab = TabNamesXueYuanXiangQing.baodubanji;
                break;
            case TabNamesXueYuanXiangQing.genjinjilu:
                this.currentTab = TabNamesXueYuanXiangQing.genjinjilu;
                break;
            case TabNamesXueYuanXiangQing.xiaofeijilu:
                this.currentTab = TabNamesXueYuanXiangQing.xiaofeijilu;
                break;
            case TabNamesXueYuanXiangQing.shangkejilu:
                this.currentTab = TabNamesXueYuanXiangQing.shangkejilu;
                break;
            case TabNamesXueYuanXiangQing.chengzhangjilu:
                this.currentTab = TabNamesXueYuanXiangQing.chengzhangjilu;
                break;
            default:
                this.currentTab = TabNamesXueYuanXiangQing.baodubanji;
        }
    }
}

const XueYuanXiangQing = () => {
    const { id, tab } = useParams<ParamsType>();
    const [viewStore] = useState<XueYuanStore>(new XueYuanStore(id, tab));

    const { xueYuanId, loading, xueYuanXinXi, currentTab } = viewStore;

    useEffect(() => {
        viewStore.getXueYuanXiangQing();
    }, [xueYuanId])

    const onTabChange = (key: string) => {
        viewStore.setCurrentTab(key);
    }

    // 获取学员详情Card title信息
    const getXueYuanInfoCardTitle = (): React.ReactNode => {
        if (!xueYuanXinXi) {
            return <></>;
        }
        return (<>
            <Row>
                <Col span={2}>
                    <MyAvatar url={xueYuanXinXi.touXiang} />
                </Col>
                <Col>
                    <Row>
                        <Space>
                            {xueYuanXinXi.xingMing}
                            <MyGender xingBie={xueYuanXinXi.xingBie} />
                            {xueYuanXinXi.nanLing ? <span style={{ fontWeight: "normal", fontSize: "0.75rem" }}>{xueYuanXinXi.nanLing + "岁"}</span> : ""}
                        </Space>
                    </Row>
                    <Row>
                        <TagXueYuanZhuangTai xueYuanZhuangTai={xueYuanXinXi.xueYuanZhuangTai} />
                    </Row>
                </Col>
            </Row>
        </>);
    }

    // 获取学员详情Card 操作
    const getXueYuanInfoCardExtra = (): React.ReactNode => {
        if (!xueYuanXinXi) {
            return <></>;
        }
        return (
            <>
                <Space size="small">
                    <Button type="primary">编辑学员资料</Button>
                    <Button>报名</Button>
                    <Button>试听</Button>
                </Space>
            </>
        );
    }

    return (
        <div
            style={{
                margin: 0,
                minHeight: "85vh"
            }}
        >
            {loading ? <Loading /> : ""}
            <Space size="large" direction="vertical" style={{ width: "100%" }}>
                <Col span={24}>
                    <Card
                        title={getXueYuanInfoCardTitle()}
                        extra={getXueYuanInfoCardExtra()}
                        bordered={false}
                    >
                        <Row gutter={[10, 15]}>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>年龄:</span>
                                    <span>{xueYuanXinXi?.nanLing}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>手机号码:</span>
                                    <span>{xueYuanXinXi?.zhangHaoShouJi}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>跟进人:</span>
                                    <span>{xueYuanXinXi?.genJinRenXingMing}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>就读学校:</span>
                                    <span>{xueYuanXinXi?.jiuDuXueXiao}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>标签:</span>
                                    <span>{["aaa", "bbb"]}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>当前年级:</span>
                                    <span>{xueYuanXinXi?.danqQianNianJi}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>家庭住址:</span>
                                    <span>{xueYuanXinXi?.jiaTingZhuZhi}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>备注:</span>
                                    <span>{xueYuanXinXi?.beiZhuXinXi}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>学号:</span>
                                    <span>{xueYuanXinXi?.id}</span>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Card>
                    <Tabs defaultActiveKey={tab} onChange={onTabChange}>
                        <TabPane tab="报读班级" key={TabNamesXueYuanXiangQing.baodubanji}>
                            {
                                currentTab === TabNamesXueYuanXiangQing.baodubanji ?
                                    <BaoDuBanJiTab xueYuanXinXi={xueYuanXinXi} />
                                    : ""
                            }
                        </TabPane>
                        <TabPane tab="跟进记录" key={TabNamesXueYuanXiangQing.genjinjilu}>
                            {
                                currentTab === TabNamesXueYuanXiangQing.genjinjilu ?
                                    <span>跟进记录</span>
                                    : ""
                            }
                        </TabPane>
                        <TabPane tab="消费记录" key={TabNamesXueYuanXiangQing.xiaofeijilu}>
                            {
                                currentTab === TabNamesXueYuanXiangQing.xiaofeijilu ?
                                    <span>消费记录</span>
                                    : ""
                            }
                        </TabPane>
                        <TabPane tab="上课记录" key={TabNamesXueYuanXiangQing.shangkejilu}>
                            {
                                currentTab === TabNamesXueYuanXiangQing.shangkejilu ?
                                    <span>上课记录</span>
                                    : ""
                            }
                        </TabPane>
                        <TabPane tab="成长记录" key={TabNamesXueYuanXiangQing.chengzhangjilu}>
                            {
                                currentTab === TabNamesXueYuanXiangQing.chengzhangjilu ?
                                    <span>成长记录</span>
                                    : ""
                            }
                        </TabPane>
                    </Tabs>
                </Card>
            </Space>
        </div >
    )
}

export default observer(XueYuanXiangQing)
