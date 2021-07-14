import { useParams } from 'react-router-dom';
import { Tabs, Card, Space, Row, Col, Button } from 'antd';
import { useEffect } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { BanJiView } from '../../customtypes';
import { observer } from 'mobx-react';
import { useState } from 'react';
import Loading from '../../components/loading/Loading';
import { huoQuBanJiXiangQing } from '../../services/banji';
import PaiKeXinXiTab from './components/paikexinxi/PaiKeXinXiTab';

const { TabPane } = Tabs;

type ParamsType = {
    id: string,
    tab: TabNamesBanJiXiangQing
}

export enum TabNamesBanJiXiangQing {
    paikexinxi = "paikexinxi",
    banjixueyuan = "banjixueyuan",
    dianmingqingkuang = "dianmingqingkuang"
}

class BanJiStore {
    constructor(id: string, tab: string) {
        this.banJiId = id;
        this.setCurrentTab(tab);
        makeObservable(this);
    }

    @observable
    loading: boolean = false;

    @observable
    banJiId: string = "";

    @observable
    banJiXiangQing: BanJiView | undefined = undefined;

    @observable
    currentTab: TabNamesBanJiXiangQing | undefined = undefined;

    @action
    setId(id: string) {
        this.banJiId = id;
    }

    @action
    getBanJiXiangQing = async (): Promise<void> => {
        if (this.banJiId) {
            this.toggleLoading();
            try {
                const xiangQing: BanJiView = await huoQuBanJiXiangQing(this.banJiId);
                this.banJiXiangQing = xiangQing;
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
            case TabNamesBanJiXiangQing.paikexinxi:
                this.currentTab = TabNamesBanJiXiangQing.paikexinxi;
                break;
            case TabNamesBanJiXiangQing.banjixueyuan:
                this.currentTab = TabNamesBanJiXiangQing.banjixueyuan;
                break;
            case TabNamesBanJiXiangQing.dianmingqingkuang:
                this.currentTab = TabNamesBanJiXiangQing.dianmingqingkuang;
                break;
            default:
                this.currentTab = TabNamesBanJiXiangQing.paikexinxi;
        }
    }
}

const BanJiXiangQing = () => {
    const { id, tab } = useParams<ParamsType>();
    const [viewStore] = useState<BanJiStore>(new BanJiStore(id, tab));

    const { banJiId, loading, banJiXiangQing, currentTab } = viewStore;

    useEffect(() => {
        viewStore.getBanJiXiangQing();
    }, [banJiId])

    const onTabChange = (key: string) => {
        viewStore.setCurrentTab(key);
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
                    <Card title={banJiXiangQing?.mingCheng} extra={<Button type="primary">班级编辑</Button>} bordered={false}>
                        <Row gutter={[10, 15]}>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>班级容量:</span>
                                    <span>{banJiXiangQing?.rongLiang || 0}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>班级老师:</span>
                                    <span>{banJiXiangQing?.banJiLaoShiXingMing}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>默认授课课时:</span>
                                    <span>{banJiXiangQing?.moRenShouKeKeShi}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>在读人数:</span>
                                    <span>{banJiXiangQing?.renShu}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>上课教室:</span>
                                    <span>{banJiXiangQing?.shangKeJiaoShi}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>班级分类:</span>
                                    <span>{banJiXiangQing?.banJiFenLeiMingCheng}</span>
                                </Space>
                            </Col>
                            <Col offset={2} span={6}>
                                <Space size="middle" style={{ width: '100%' }}>
                                    <span>备注:</span>
                                    <span>{banJiXiangQing?.beiZhu}</span>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Card>
                    <Tabs defaultActiveKey={tab} onChange={onTabChange}>
                        <TabPane tab="排课信息" key={TabNamesBanJiXiangQing.paikexinxi}>
                            {
                                currentTab === TabNamesBanJiXiangQing.paikexinxi ?
                                    <PaiKeXinXiTab
                                        banJiXiangQing={banJiXiangQing}
                                    />
                                    : ""
                            }
                        </TabPane>
                        <TabPane tab="班级学员" key={TabNamesBanJiXiangQing.banjixueyuan}>
                            {currentTab === TabNamesBanJiXiangQing.banjixueyuan ? <>班级学员i</> : ""}
                        </TabPane>
                        <TabPane tab="点名情况" key={TabNamesBanJiXiangQing.dianmingqingkuang}>
                            {currentTab === TabNamesBanJiXiangQing.dianmingqingkuang ? <>点名情况</> : ""}
                        </TabPane>
                    </Tabs>
                </Card>
            </Space>
        </div >
    )
}

export default observer(BanJiXiangQing)
