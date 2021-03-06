import { Button, Row, Col, Space, TablePaginationConfig, TableColumnType, Switch, Table, Input } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from '../../components/loading/Loading';
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
    pagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 10 };

    @action
    updateKeyword(val: string) {
        this.keyword = val;
    }

    @action
    async search(pagination: TablePaginationConfig) {
        const { current, pageSize } = pagination;
        const result = await huoQuKeChengLieBiao(current || 0, pageSize || 10)
        if (result) {
            runInAction(() => {
                const { list, total } = result;
                this.list = list;
                this.pagination = { ...this.pagination, total, current, pageSize };
            });
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

    //TODO ??????????????????
    const onTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any) => {
        viewStore.onTableChange(pagination);
    }

    const columns: TableColumnType<KeCheng>[] = [
        {
            title: '????????????',
            dataIndex: 'mingCheng',
            key: 'mingCheng',
        },
        {
            title: '??????',
            dataIndex: 'danJia',
            key: 'danJia',
        },
        {
            title: '????????????',
            dataIndex: 'dingJiaBiaoZhunZu',
            key: 'dingJiaBiaoZhunZu',
            render: (values: DingJiaBiaoZhun[]) => {
                let res: string = "";
                if (values) {
                    values.forEach(v => {
                        res += `???${v.mingCheng}??? ${v.keShi}??????${v.zongJia}???\n`;
                    })
                }

                return <span style={{ whiteSpace: 'pre-line' }}>{res}</span>;
            },
        },
        {
            title: '???????????????',
            dataIndex: 'zaiDuXueYuanShu',
            key: 'zaiDuXueYuanShu',
        },
        {
            title: '????????????',
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
            title: '??????',
            key: 'action',
            render: (value, record) => (
                <>
                    <Button disabled type="link">??????</Button>
                    <Button disabled type="link">??????</Button>
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
                <Row style={{ width: '100%' }}>
                    <Col>
                        <Row align="middle">
                            <Col>
                                <span>???????????????</span>
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
                    }}>????????????</Button>
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
        </div>
    )
}

export default observer(KeChengLieBiao);
