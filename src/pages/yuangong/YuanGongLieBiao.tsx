import { action, makeObservable, observable } from 'mobx'
import { YuanGong } from '../../customtypes'
import { Table, Switch, TableColumnType, TablePaginationConfig, Button } from 'antd';
import { observer } from 'mobx-react';
import { useState } from 'react';

import { Row, Col, Input } from 'antd'

import './yuangongliebiao.css'
import { houQuYuanGongLieBiao } from '../../services/account';
import { useEffect } from 'react';
import LinkButton from '../../components/linkbutton';
import Loading from '../../components/loading/Loading';

const { Search } = Input;

class YuanGongLieBiaoStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    list: YuanGong[] = [];

    @observable
    keyword: string = '';

    @observable
    pagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 10 };

    @action
    updateKeyword(val: string) {
        this.keyword = val;
    }

    @action
    async huoQuYuanGongLieBiao(pagination: TablePaginationConfig) {
        const { current, pageSize } = pagination;
        const result = await houQuYuanGongLieBiao(current || 0, pageSize || 10);
        if (result) {
            const { list, total } = result;
            this.list = list;
            this.pagination = { ...this.pagination, total, current, pageSize };
        }
    }

    @action
    onTableChange(pagination: TablePaginationConfig, filters: any, sorter: any) {
        this.huoQuYuanGongLieBiao(pagination);
    }
}

const YuanGongLieBiao = () => {
    const [viewStore] = useState<YuanGongLieBiaoStore>(new YuanGongLieBiaoStore());
    const [loading, setLoading] = useState<boolean>(false);

    const { list, pagination } = viewStore;

    const huoQuYuanGongLieBiao = async (pagination: TablePaginationConfig) => {
        setLoading(true);
        await viewStore.huoQuYuanGongLieBiao(pagination).catch(e => { });
        setLoading(false);
    }

    useEffect(() => {
        huoQuYuanGongLieBiao(pagination);
    }, []);

    const clikced = (checked: boolean, record: YuanGong) => {
        console.log('record: ', record);
        console.log('current check: ', checked);
    }

    const onSearch = () => { }

    //TODO ??????????????????
    const onTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any) => {
        huoQuYuanGongLieBiao(pagination);
    }

    const columns: TableColumnType<YuanGong>[] = [
        {
            title: '????????????',
            dataIndex: 'xingMing',
            key: 'name',
        },
        {
            title: '?????????',
            dataIndex: 'shouJi',
            key: 'shouji',
        },
        {
            title: '????????????',
            dataIndex: 'isLaoShi',
            key: 'isLaoShi',
            render: (value) => {
                return value ? "???" : "???"
            },
        },
        {
            title: '??????',
            dataIndex: 'beiZhu',
            key: 'beiZhu',
        },
        {
            title: '??????',
            dataIndex: 'jueSeZu',
            key: 'jueSeZu',
            render: (value, record) => {
                let jueSeStr: string = "";
                record.jueSeZu.forEach(v => { jueSeStr += ", " + v })
                return jueSeStr.substr(1);
            }
        },
        {
            title: '????????????',
            dataIndex: 'zaiZhiZhuangTai',
            key: 'zaiZhiZhuangTai',
            render: (value, record) => {
                return (
                    <span onClick={() => clikced(value, record)}>
                        <Switch key={record.id} checked={value} onClick={(value) => { console.log("xxxclickedxxxxx") }} />
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
            <Row className="row-padding">
                <LinkButton to="/sys/xinjianyuangong" text="????????????"></LinkButton>
            </Row>
            <Row className="row-padding" justify="space-around">
                <Col span={8}>
                    <Search placeholder="????????????" onSearch={onSearch} />
                </Col>
                <Col span={8}></Col>
                <Col span={8}></Col>
            </Row>
            <Row className="row-padding">
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
        </div>
    )
}

export default observer(YuanGongLieBiao);
