import { Button, Row, Col, Space, TablePaginationConfig, TableColumnType, Switch, Table, Input } from 'antd';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from '../../components/loading/Loading';
import SearchItemInput from '../../components/searchitems/searchiteminput/SearchItemInput';
import { DingJiaBiaoZhun, KeCheng } from '../../customtypes';
import { getDefinedRouteByRouteName, routeName } from '../../router';
import { huoQuKeChengLieBiao } from '../../services/kecheng';

const { Search } = Input
class KeChengLieBiaoStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    list: KeCheng[] = [];

    @observable
    keyword: string = "";

    @observable
    pagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 2 };

    @action
    updateKeyword(val: string) {
        this.keyword = val;
    }

    @action
    async search(pagination: TablePaginationConfig) {
        const { current, pageSize } = pagination;
        const result = await huoQuKeChengLieBiao(current || 0, pageSize || 10)
        if (result) {
            const { list, total } = result;
            this.list = list;
            this.pagination = { ...this.pagination, total, current, pageSize };
        }
    }

    @action
    onTableChange(pagination: TablePaginationConfig, filters?: any, sorter?: any) {
        this.search(pagination)
    }
}

const KeChengLieBiao: React.FC = () => {
    const history = useHistory();
    const [viewStore] = useState<KeChengLieBiaoStore>(new KeChengLieBiaoStore());
    const [loading, setLoading] = useState<boolean>(false);

    const { list, pagination } = viewStore;

    const search = async () => {
        setLoading(true);
        await viewStore.search(pagination).catch(e => { })
        setLoading(false);
    }

    useEffect(() => {
        search();
    }, []);

    const onQiYongZhuangTaiClick = (checked: boolean, record: KeCheng) => {
        console.log('record: ', record);
        console.log('current check: ', checked);
    }

    //TODO 其他查询条件
    const onTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any) => {
        viewStore.onTableChange(pagination);
    }

    const columns: TableColumnType<KeCheng>[] = [
        {
            title: '课程名称',
            dataIndex: 'mingCheng',
            key: 'mingCheng',
        },
        {
            title: '单价',
            dataIndex: 'danJia',
            key: 'danJia',
        },
        {
            title: '定价标准',
            dataIndex: 'dingJiaBiaoZhunZu',
            key: 'dingJiaBiaoZhunZu',
            render: (values: DingJiaBiaoZhun[]) => {
                let res: string = "";
                if (values) {
                    values.forEach(v => {
                        res += `【${v.mingCheng}】 ${v.keShi}课时${v.zongJia}元\n`;
                    })
                }

                return <span style={{ whiteSpace: 'pre-line' }}>{res}</span>;
            },
        },
        {
            title: '在读学员数',
            dataIndex: 'zaiDuXueYuanShu',
            key: 'zaiDuXueYuanShu',
        },
        {
            title: '启用状态',
            dataIndex: 'qiYongZhuangTai',
            key: 'qiYongZhuangTai',
            render: (value, record) => {
                return (
                    <span onClick={() => onQiYongZhuangTaiClick(value, record)}>
                        <Switch key={record.id} checked={value} onClick={() => { console.log("kecheng: ", record.id) }} />
                    </span>
                )

            }
        },
        {
            title: '操作',
            key: 'action',
            render: (value, record) => (
                <>
                    <a href={"/" + record.id}>编辑</a> |
                    <a href={"/" + record.id}>删除</a>
                </>
            ),
        },
    ];

    return (
        <>
            {loading ? <Loading /> : ""}
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Row style={{ width: '100%' }}>
                    <Col>
                        <Row align="middle">
                            <Col>
                                <span>搜索课程：</span>
                            </Col>
                            <Col>
                                <Search onSearch={() => { }} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Button type="primary" onClick={() => {
                        history.push(getDefinedRouteByRouteName(routeName.xinjiankecheng)?.path || "/")
                    }}>新建课程</Button>
                </Row>
                <Row style={{ width: '100%' }}>
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
        </>
    )
}

export default observer(KeChengLieBiao);
