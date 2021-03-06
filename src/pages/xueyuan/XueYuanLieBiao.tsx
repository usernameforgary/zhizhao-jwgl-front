import React, { useState, useEffect } from 'react'
import { Row, Col, Table, TableColumnType, TablePaginationConfig } from 'antd'
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { XingBie, XueYuanXinXi } from '../../customtypes';
import Loading from '../../components/loading/Loading';
import { Link } from 'react-router-dom';
import { huoQuXueYuanLieBiao } from '../../services/xueyuan';
import { getDefinedRouteByRouteName, routeName } from '../../router';
import { TabNamesXueYuanXiangQing } from './XueYuanXiangQing';
import IconMan from '../../components/customicons/gender/IconMan';
import IconWoman from '../../components/customicons/gender/IconWonman';

class XueYuanLieBiaoStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    list: XueYuanXinXi[] = [];

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


    //TODO ??????????????????
    const onTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any) => {
        viewStore.onTableChange(pagination);
    }

    const columns: TableColumnType<XueYuanXinXi>[] = [
        {
            title: '????????????',
            dataIndex: 'xingMing',
            key: 'xingMing',
            render: (value, record: XueYuanXinXi) => {
                let genderIcon = <IconMan />;
                if (record.xingBie === XingBie.NV) {
                    genderIcon = <IconWoman />
                }
                let xueYuanXiangQingPath = getDefinedRouteByRouteName(routeName.xueyuanxiangqing)?.path || "";
                xueYuanXiangQingPath = xueYuanXiangQingPath?.substring(0, xueYuanXiangQingPath.indexOf(":"));
                return (
                    <span>
                        <Link to={xueYuanXiangQingPath + record.id + "/" + TabNamesXueYuanXiangQing.baodubanji}>{value}</Link>
                        &nbsp;
                        {genderIcon}
                    </span>
                )
            }
        },
        {
            title: '?????????',
            dataIndex: 'zhangHaoShouJi',
            key: 'zhangHaoShouJi',
        },
        {
            title: '????????????',
            dataIndex: 'gouMaiKeShi',
            key: 'gouMaiKeShi'
        },
        {
            title: '????????????',
            dataIndex: 'zengSongKeShi',
            key: 'zengSongKeShi'
        },
        {
            title: '???????????????',
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
            title: '????????????',
            dataIndex: 'xiaoKeJinE',
            key: 'xiaoKeJinE',
            render: (values, record) => {
                return <span style={{ whiteSpace: 'pre-line' }}>??? {record.xiaoKeJinE?.toFixed(2)} ???</span>;
            },
        },
        {
            title: '????????????',
            dataIndex: 'shengYuKeShi',
            key: 'shengYuKeShi',
        },
        {
            title: '?????????',
            dataIndex: 'genJinRenXingMing',
            key: 'genJinRenXingMing',
        },
        {
            title: '??????',
            key: 'id',
            render: (value, record: XueYuanXinXi) => {
                let xueYuanXuanBanPath = getDefinedRouteByRouteName(routeName.xueyuanxuanban)?.path || "";
                xueYuanXuanBanPath = xueYuanXuanBanPath.substring(0, xueYuanXuanBanPath.lastIndexOf(":"));
                return (<Link to={xueYuanXuanBanPath + record.id}>??????</Link>)
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
