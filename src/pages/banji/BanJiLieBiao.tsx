import { Row, Col, Input, Button, Space, TablePaginationConfig, TableColumnType, Table } from 'antd';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/loading/Loading';
import { BanJi, BanJiView } from '../../customtypes';
import { getDefinedRouteByRouteName, routeName } from '../../router';
import { chuangJianBanJi, huoQuBanJiLieBiao } from '../../services/banji';
import { TabNamesBanJiXiangQing } from './BanJiXiangQing';

import XinZengBanJi from './components/xinzengbanji/XinZengBanJi';

const { Search } = Input;

class BanJiLieBiaoStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    list: BanJiView[] = [];

    @observable
    pagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 10 };

    @action
    async search(pagination: TablePaginationConfig) {
        const { current, pageSize } = pagination;
        const result = await huoQuBanJiLieBiao(current || 1, pageSize || 10);
        if (result) {
            const { list, total } = result;
            this.list = list;
            this.pagination = { ...this.pagination, total, current, pageSize };
        }
    }

    @action
    onTableChange(pagination: TablePaginationConfig, filters?: any, sorter?: any) {
        this.search(pagination);
    }
}

const BanJiLieBiao = () => {
    const [viewStore] = useState<BanJiLieBiaoStore>(new BanJiLieBiaoStore());
    const [showXinZengBanJiModal, setShowXinZengBanJiModal] = useState<boolean>(false);
    const [listRefresh, setListRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { list, pagination } = viewStore;

    const listBanJiLieBiao = async () => {
        setLoading(true);
        try {
            await viewStore.search(pagination)
        } catch (e) { }
        setLoading(false);
    }

    useEffect(() => {
        listBanJiLieBiao();
    }, [listRefresh]);

    /**
     * ????????????
     */
    const refreshList = () => {
        setListRefresh(!listRefresh);
    }

    //TODO ??????????????????
    const onTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any) => {
        viewStore.onTableChange(pagination);
    }

    /**
     * ??????Modal????????????
     */
    const toggleShowXinZengBanJi = () => {
        setShowXinZengBanJiModal(!showXinZengBanJiModal);
    }

    /**
     * ????????????
     * @param item ??????
     * @returns 
     */
    const xinZengBanJi = async (item: BanJi): Promise<number | undefined> => {
        let id = undefined;
        try {
            id = await chuangJianBanJi(item);
            refreshList();
        } catch (e) { }
        return id;
    }

    const columns: TableColumnType<BanJiView>[] = [
        {
            title: '????????????',
            dataIndex: 'mingCheng',
            key: 'mingCheng',
            render: (value, record) => {
                return <Link to={`${getDefinedRouteByRouteName(routeName.banjixiangqing)?.path}/${record.id}/${TabNamesBanJiXiangQing.paikexinxi}`}>{value}</Link>;
            }
        },
        {
            title: '????????????',
            dataIndex: 'keChengMingCheng',
            key: 'keChengMingCheng',
        },
        {
            title: '????????????',
            dataIndex: 'banJiLaoShiXingMing',
            key: 'banJiLaoShiXingMing',
        },
        {
            title: '??????/??????',
            dataIndex: 'renShu',
            key: 'renShu',
            render: (value, record) => {
                return `${(record?.banJiXueYuanZu && record.banJiXueYuanZu.length)}/${record.rongLiang || 0}`;
            }
        },
        {
            title: '??????/????????????',
            dataIndex: 'paiKeCiShu',
            key: 'paiKeCiShu',
            render: (value, record) => {
                return `${record.yiShangKeCiShu}/${record.paiKeCiShu}`;
            }
        },
        {
            title: '????????????',
            dataIndex: 'yiShouKeShi',
            key: 'yiShouKeShi',
            render: (value, record) => {
                return <Link to={`${getDefinedRouteByRouteName(routeName.banjixiangqing)?.path}/${record.id}/${TabNamesBanJiXiangQing.dianmingqingkuang}`}>{value || 0}</Link>;
            }
        },
        {
            title: '????????????',
            dataIndex: 'banJiFenLeiMingCheng',
            key: 'banJiFenLeiMingCheng',
        },
        {
            title: '??????',
            key: 'action',
            render: (value, record) => (
                <>
                    <Space size="middle">
                        <Link to={`${getDefinedRouteByRouteName(routeName.banjixiangqing)?.path}/${record.id}/${TabNamesBanJiXiangQing.banjixueyuan}`}>????????????</Link>
                        <Link to={`${getDefinedRouteByRouteName(routeName.banjixiangqing)?.path}/${record.id}/${TabNamesBanJiXiangQing.dianmingqingkuang}`}>??????</Link>
                        <Button type="link" disabled>??????</Button>
                    </Space>
                </>
            ),
        },
    ];

    return (
        <div
            className={"content-background"}
            style={{
                padding: 24,
                margin: 0,
                minHeight: "85vh"
            }}
        >
            {loading ? <Loading /> : ""}
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Row>
                    <Col span={7}>
                        <Row align="middle">
                            <Space size="middle">
                                <Col>
                                    <span>????????????: </span>
                                </Col>
                                <Col>
                                    <Search />
                                </Col>
                            </Space>
                        </Row>
                    </Col>
                    <Col span={7}>
                        <Row align="middle">
                            <Space size="middle">
                                <Col>
                                    <span>????????????: </span>
                                </Col>
                                <Col>
                                    <Search />
                                </Col>
                            </Space>
                        </Row>
                    </Col>
                    <Col span={7}>
                        <Row align="middle">
                            <Space size="middle">
                                <Col>
                                    <span>????????????: </span>
                                </Col>
                                <Col>
                                    <Search />
                                </Col>
                            </Space>
                        </Row>
                    </Col>
                    <Col span={3}>
                        <Row justify="end">
                            <Button disabled type="primary">??????</Button>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Space size="large">
                        <Button type="primary" onClick={toggleShowXinZengBanJi}>????????????</Button>
                        <Button disabled type="primary">????????????</Button>
                        <Button disabled type="primary">??????????????????</Button>
                    </Space>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            pagination={pagination}
                            dataSource={list}
                            columns={columns}
                            onChange={onTableChange}
                        >
                        </Table>
                    </Col>
                </Row>
            </Space>
            {showXinZengBanJiModal ?
                <XinZengBanJi
                    visible={showXinZengBanJiModal}
                    onFormFinish={xinZengBanJi}
                    onClose={toggleShowXinZengBanJi}
                />
                : ""}
        </div>
    )
}

export default observer(BanJiLieBiao)
