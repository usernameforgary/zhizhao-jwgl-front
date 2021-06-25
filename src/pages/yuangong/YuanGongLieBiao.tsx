import { action, makeObservable, observable } from 'mobx'
import { YuanGong } from '../../customtypes'
import { Table, Switch, TableColumnType, TablePaginationConfig, message } from 'antd';
import { observer } from 'mobx-react';
import { useState } from 'react';

import { Button, Row, Col, Input } from 'antd'

import './yuangongliebiao.css'
import { houQuYuanGongLieBiao } from '../../services/account';
import { useEffect } from 'react';

const { Search } = Input;

type YuanGongLiebiaoProps = {

}
class YuanGongLieBiaoStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    list: YuanGong[] = [
        {
            id: '1234',
            xingMing: 'YUANGONG1',
            shouJi: '13566666',
            isLaoShi: false,
            jueSeZu: "lll",
            zaiZhiZhuangTai: true,
        },
        {
            id: '1234',
            xingMing: 'YUANGONG2',
            shouJi: '13566666',
            isLaoShi: false,
            jueSeZu: "lll",
            zaiZhiZhuangTai: false,
        },
        {
            id: '1234',
            xingMing: 'YUANGONG3',
            shouJi: '1367777777',
            isLaoShi: false,
            jueSeZu: "dafdsf",
            zaiZhiZhuangTai: true,
        },
    ];

    @observable
    keyword: string = '';

    @observable
    pagination: TablePaginationConfig = { current: 1, pageSize: 1 };

    @action
    updateKeyword(val: string) {
        this.keyword = val;
    }

    @action
    async huoQuYuanGongLieBiao(pagination: TablePaginationConfig) {
        try {
            const result = await houQuYuanGongLieBiao(pagination.current || 1, pagination.pageSize || 10);
            if (result) {
                const { list } = result;
                this.list = list;
                this.pagination = pagination;
            }
        } catch (err) {
            message.error(err.message || err.toString());
        }
    }

    @action
    onTableChange(pagination: TablePaginationConfig, filters: any, sorter: any) {
        console.log(pagination);
        this.huoQuYuanGongLieBiao(pagination);
    }
}

const YuanGongLieBiao = () => {
    const [viewStore] = useState<YuanGongLieBiaoStore>(new YuanGongLieBiaoStore());

    const { list, pagination } = viewStore;

    useEffect(() => {
        try {
            viewStore.huoQuYuanGongLieBiao(pagination);
        } catch (err) {
            console.log(err)
        }
    }, []);

    const clikced = (checked: boolean, record: YuanGong) => {
        console.log('record: ', record);
        console.log('current check: ', checked);
    }

    const onSearch = () => { }

    //TODO 其他查询条件
    const onTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any) => {
        viewStore.onTableChange(pagination, filters, sorter);
    }

    const columns: TableColumnType<YuanGong>[] = [
        {
            title: '员工姓名',
            dataIndex: 'xingMing',
            key: 'name',
        },
        {
            title: '手机号',
            dataIndex: 'shouJi',
            key: 'shouji',
        },
        {
            title: '是否授课',
            dataIndex: 'isLaoShi',
            key: 'isLaoShi',
            render: (value) => {
                return value ? "是" : "否"
            },
        },
        {
            title: '备注',
            dataIndex: 'beiZhu',
            key: 'beiZhu',
        },
        {
            title: '角色',
            dataIndex: 'jueSeZu',
            key: 'jueSeZu',
        },
        {
            title: '在职状态',
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
            <Row className="row-padding">
                <Button type="primary">
                    添加员工
                </Button>
            </Row>
            <Row className="row-padding" justify="space-around">
                <Col span={8}>
                    <Search placeholder="搜索员工" onSearch={onSearch} />
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
        </>
    )
}

export default observer(YuanGongLieBiao);
