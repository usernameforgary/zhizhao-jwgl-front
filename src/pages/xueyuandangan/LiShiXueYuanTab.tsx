import { Row, Col, Input, Button, Space, TablePaginationConfig, TableColumnType, Table, Select } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { KeCheng, LiShiXueYuanView, YuanGong, ZhangHaoLeiXing } from '../../customtypes';
import { getDefinedRouteByRouteName, routeName } from '../../router';
import { huoQuYuanGongLieBiaoAll } from '../../services/account';
import { huoQuKeChengAll } from '../../services/kecheng';
import { huoQuLiShiXueYuanLieBiao } from '../../services/xueyuan';

const { Search } = Input;
const { Option } = Select;

// 筛选条件
type FilterFields = {
    keyword?: string
    keChengId?: string
    genJinRenId?: string
}

class LiShiXueYuanTabStore {
    constructor() {
        makeObservable(this);
    }

    // 删选条件
    @observable
    filterFields?: FilterFields;

    @observable
    changeFilterFields(newFilerFields: FilterFields) {
        this.filterFields = newFilerFields;
        this.search();
    }

    @observable
    changeFilterFieldsNoSearch(newFilerFields: FilterFields) {
        this.filterFields = newFilerFields;
    }

    // 分页信息
    @observable
    pagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 10 };

    @observable
    LiShiXueYuanList: LiShiXueYuanView[] | [] = [];

    @action
    setPagination(pagination: TablePaginationConfig) {
        this.pagination = pagination;
        this.search();
    }

    @action
    async search() {
        const { current, pageSize } = this.pagination;
        const keyword: string = this.filterFields?.keyword || "";
        const keChengId: string = this.filterFields?.keChengId || "";
        const genJinRenId: string = this.filterFields?.genJinRenId || "";

        try {
            const result = await huoQuLiShiXueYuanLieBiao(current || 1, pageSize || 10, keyword, keChengId, genJinRenId);
            if (result) {
                const { list, total } = result;
                runInAction(() => {
                    this.LiShiXueYuanList = list;
                    this.pagination = { ...this.pagination, total, current, pageSize };
                })
            }
        } catch (e) {

        }
    }
}

const LiShiXueYuanTab = () => {
    const [viewStore] = useState<LiShiXueYuanTabStore>(new LiShiXueYuanTabStore());

    const [keChengList, setKeChengList] = useState<KeCheng[]>([]);

    const [yuanGongList, setYuanGongList] = useState<YuanGong[]>([]);

    const { pagination, filterFields, LiShiXueYuanList } = viewStore;

    useEffect(() => {
        const init = async () => {
            await viewStore.search();
        }
        init()
    }, []);

    // 获取课程
    useEffect(() => {
        const getBanJi = async () => {
            try {
                const result = await huoQuKeChengAll();
                setKeChengList(result.list);
            } catch (e) { }
        }
        getBanJi()
    }, [])

    // 获取员工列表，跟进人过滤条件
    useEffect(() => {
        const getYuanGong = async () => {
            try {
                const res = await huoQuYuanGongLieBiaoAll(ZhangHaoLeiXing.YUAN_GONG);
                setYuanGongList(res);
            } catch (e) { }
        }
        getYuanGong();
    }, []);

    // 搜索框内容改变
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v: string = e.target.value;
        const newFilterFields = { ...filterFields, keyword: v }
        viewStore.changeFilterFieldsNoSearch(newFilterFields);
    }

    // 搜索框点击搜索
    const handleSearch = () => {
        viewStore.search();
    }

    // 课程改变
    const handleKeChengChange = (v: string) => {
        const newFilterFields = { ...filterFields, keChengId: v }
        viewStore.changeFilterFields(newFilterFields);
    }


    // 跟进人改变
    const handleGenJinRenChange = (v: string) => {
        const newFilterFields = { ...filterFields, genJinRenId: v }
        viewStore.changeFilterFields(newFilterFields);
    }

    // 分页改变
    const onTableChange = (pagination: TablePaginationConfig) => {
        viewStore.setPagination(pagination)
    }

    const columns: TableColumnType<LiShiXueYuanView>[] = [
        {
            title: '学员姓名',
            dataIndex: 'xingMing',
            key: 'xingMing'
        },
        {
            title: '手机号',
            dataIndex: 'shouJi',
            key: 'shouJi'
        },
        {
            title: '年龄',
            dataIndex: 'nanLing',
            key: 'nanLing',
            render: (values) => {
                return (
                    <span style={{ whiteSpace: 'pre-line' }}>
                        {values ? values + "岁" : ""}
                    </span>
                );
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (values) => {
                return (
                    <span style={{ whiteSpace: 'pre-line' }}>
                        {values ? moment(Number(values)).format('yyyy-MM-DD') : ""}
                    </span>
                );
            },
        },
        {
            title: '结业时间',
            dataIndex: 'jieYeShiJian',
            key: 'jieYeShiJian',
            render: (values) => {
                return (
                    <span style={{ whiteSpace: 'pre-line' }}>
                        {values ? moment(Number(values)).format('yyyy-MM-DD') : ""}
                    </span>
                );
            },
        },
        {
            title: '最后就读课程',
            dataIndex: 'latestKeCheng',
            key: 'latestKeCheng',
            render: (values, record) => {
                return (<span style={{ whiteSpace: 'pre-line' }}>
                    {record.latestKeCheng && record.latestKeCheng.keChengMingCheng || "--"}
                </span>);
            },
        },
        {
            title: '跟进人',
            dataIndex: 'genJinRenXingMing',
            key: 'genJinRenXingMing',
            render: (values) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{values || "未分配"}</span>;
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (values, record) => {
                return (
                    <>
                        <Link to={`${getDefinedRouteByRouteName(routeName.xueyuanbaoming)?.path}/${record.id}`}>报名</Link>
                    </>
                )
            },
        }
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
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Row>
                    <Col span={7}>
                        <Row align="middle">
                            <Space size="middle">
                                <Col>
                                    <span>搜索学员: </span>
                                </Col>
                                <Col>
                                    <Search onChange={handleSearchChange} onSearch={handleSearch} />
                                </Col>
                            </Space>
                        </Row>
                    </Col>
                    <Col span={7}>
                        <Row align="middle">
                            <Space size="middle">
                                <Col>
                                    <span>报读课程: </span>
                                </Col>
                                <Col>
                                    <Select style={{ width: '10rem' }} defaultValue={filterFields?.keChengId} onChange={handleKeChengChange} allowClear={true}>
                                        {keChengList?.map(k => {
                                            return (
                                                <Option key={k.id} value={k.id || ""}>{k.mingCheng}</Option>
                                            );
                                        })}
                                    </Select>
                                </Col>
                            </Space>
                        </Row>
                    </Col>
                    <Col span={7}>
                        <Row align="middle">
                            <Space size="middle">
                                <Col>
                                    <span>跟进人: </span>
                                </Col>
                                <Col>
                                    <Select style={{ width: '10rem' }} defaultValue={filterFields?.genJinRenId} onChange={handleGenJinRenChange} allowClear={true}>
                                        {yuanGongList?.map(k => {
                                            return (
                                                <Option key={k.id} value={k.id || ""}>{k.xingMing}</Option>
                                            );
                                        })}
                                    </Select>
                                </Col>
                            </Space>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Space size="large">
                        <Button disabled type="primary">今日待跟进（0）</Button>
                        <Button disabled type="primary">分配跟进人</Button>
                        <Button disabled type="primary">导出</Button>
                    </Space>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            pagination={pagination}
                            dataSource={LiShiXueYuanList}
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

export default observer(LiShiXueYuanTab);
