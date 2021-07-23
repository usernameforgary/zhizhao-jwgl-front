import React, { useState, useEffect } from 'react'
import { Row, Col, Table, TableColumnType, TablePaginationConfig } from 'antd'
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { XingBie, XueYuanXinXi } from '../../customtypes';
import Loading from '../../components/loading/Loading';
import { Link } from 'react-router-dom';
import { huoQuXueYuanLieBiao } from '../../services/xueyuan';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';

class XueYuanLieBiaoStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    list: XueYuanXinXi[] = [];

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
        try {
            const result = await huoQuXueYuanLieBiao(current || 0, pageSize || 10)
            if (result) {
                runInAction(() => {
                    const { list, total } = result;
                    this.list = list;
                    this.pagination = { ...this.pagination, total, current, pageSize };
                });
            }
        } catch (e) { }
    }

    @action
    onTableChange(pagination: TablePaginationConfig, filters?: any, sorter?: any) {
        this.search(pagination)
    }
}

const XueYuanLieBiao = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [viewStore] = useState<XueYuanLieBiaoStore>(new XueYuanLieBiaoStore());
    const { list, pagination } = viewStore;

    useEffect(() => {
        let isMounted = true;
        const initial = async () => {
            setLoading(true);
            await viewStore.search(pagination).catch(e => { })
            setLoading(false);
        }
        initial();
        return () => { isMounted = false; }
    }, []);


    //TODO 其他查询条件
    const onTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any) => {
        viewStore.onTableChange(pagination);
    }

    const columns: TableColumnType<XueYuanXinXi>[] = [
        {
            title: '学生姓名',
            dataIndex: 'xingMing',
            key: 'xingMing',
            render: (value, record) => {
                let genderIcon = <ManOutlined />;
                if (record.xingBie === XingBie.NV) {
                    genderIcon = <WomanOutlined />;
                }
                return (<span>{value} {genderIcon}</span>)
            }
        },
        {
            title: '手机号',
            dataIndex: 'zhangHaoShouJi',
            key: 'zhangHaoShouJi',
        },
        {
            title: '购买课时',
            dataIndex: 'gouMaiKeShi',
            key: 'gouMaiKeShi'
        },
        {
            title: '赠送课时',
            dataIndex: 'zengSongKeShi',
            key: 'zengSongKeShi'
        },
        {
            title: '已消耗课时',
            dataIndex: 'shengYuKeShi',
            key: 'shengYuKeShi',
            render: (value, record) => {
                const gouMaiKeShi: number = record.gouMaiKeShi ? Number(record.gouMaiKeShi) : 0;
                const zengSongKeShi: number = record.zengSongKeShi ? Number(record.zengSongKeShi) : 0;
                const shengYuKeShi: number = record.shengYuKeShi ? Number(record.shengYuKeShi) : 0;
                return <span>{gouMaiKeShi + zengSongKeShi - shengYuKeShi}</span>;
            },
        },
        {
            title: '消课金额',
            dataIndex: 'xiaoKeJinE',
            key: 'xiaoKeJinE',
            render: (values) => {
                return <span style={{ whiteSpace: 'pre-line' }}>￥ {values} 元</span>;
            },
        },
        {
            title: '剩余课时',
            dataIndex: 'shengYuKeShi',
            key: 'shengYuKeShi',
        },
        {
            title: '跟进人',
            dataIndex: 'genJinRenXingMing',
            key: 'genJinRenXingMing',
        },
        {
            title: '操作',
            key: 'id',
            render: (value) => {
                return <Link to="">选班</Link>
            }
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
            <Row></Row>
            <Row></Row>
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
        </div>
    )
}

export default observer(XueYuanLieBiao)
