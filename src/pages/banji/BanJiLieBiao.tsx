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
    pagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 2 };

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
     * 刷新列表
     */
    const refreshList = () => {
        setListRefresh(!listRefresh);
    }

    //TODO 其他查询条件
    const onTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any) => {
        viewStore.onTableChange(pagination);
    }

    /**
     * 新增Modal显示切换
     */
    const toggleShowXinZengBanJi = () => {
        setShowXinZengBanJiModal(!showXinZengBanJiModal);
    }

    /**
     * 创建班级
     * @param item 班级
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
            title: '班级名称',
            dataIndex: 'mingCheng',
            key: 'mingCheng',
            render: (value, record) => {
                return <Link to={`${getDefinedRouteByRouteName(routeName.banjixiangqing)?.path}/${record.id}/${TabNamesBanJiXiangQing.paikexinxi}`}>{value}</Link>;
            }
        },
        {
            title: '课程名称',
            dataIndex: 'keChengMingCheng',
            key: 'keChengMingCheng',
        },
        {
            title: '班级老师',
            dataIndex: 'banJiLaoShiXingMing',
            key: 'banJiLaoShiXingMing',
        },
        {
            title: '人数/容量',
            dataIndex: 'renShu',
            key: 'renShu',
            render: (value, record) => {
                return `${(record?.banJiXueYuanZu && record.banJiXueYuanZu.length)}/${record.rongLiang || 0}`;
            }
        },
        {
            title: '已上/排课次数',
            dataIndex: 'paiKeCiShu',
            key: 'paiKeCiShu',
            render: (value, record) => {
                return `${record.yiShangKeCiShu}/${record.paiKeCiShu}`;
            }
        },
        {
            title: '已授课时',
            dataIndex: 'yiShouKeShi',
            key: 'yiShouKeShi',
            render: (value, record) => {
                return <Link to={`${getDefinedRouteByRouteName(routeName.banjixiangqing)?.path}/${record.id}/${TabNamesBanJiXiangQing.dianmingqingkuang}`}>{value || 0}</Link>;
            }
        },
        {
            title: '班级分类',
            dataIndex: 'banJiFenLeiMingCheng',
            key: 'banJiFenLeiMingCheng',
        },
        {
            title: '操作',
            key: 'action',
            render: (value, record) => (
                <>
                    <Space size="middle">
                        <Link to={`${getDefinedRouteByRouteName(routeName.banjixiangqing)?.path}/${record.id}/${TabNamesBanJiXiangQing.banjixueyuan}`}>学员管理</Link>
                        <Link to={`${getDefinedRouteByRouteName(routeName.banjixiangqing)?.path}/${record.id}/${TabNamesBanJiXiangQing.dianmingqingkuang}`}>点名</Link>
                        <a href={"/" + record.id}>结课</a>
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
                                    <span>搜索班级: </span>
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
                                    <span>所属课程: </span>
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
                                    <span>班级老师: </span>
                                </Col>
                                <Col>
                                    <Search />
                                </Col>
                            </Space>
                        </Row>
                    </Col>
                    <Col span={3}>
                        <Row justify="end">
                            <Button type="primary">导出</Button>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Space size="large">
                        <Button type="primary" onClick={toggleShowXinZengBanJi}>添加班级</Button>
                        <Button type="primary">批量结业</Button>
                        <Button type="primary">导出班级名单</Button>
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
