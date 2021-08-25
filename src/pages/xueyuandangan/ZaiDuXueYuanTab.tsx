import { Row, Col, Input, Button, Space, TablePaginationConfig, TableColumnType, Table, Select, Tag } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { BanJi, BanJiView, GenJinJiLu, ZaiDuXueYuanView } from '../../customtypes';
import { getDefinedRouteByRouteName, routeName } from '../../router';
import { huoQuBanJiAll } from '../../services/banji';
import { huoQuZaiDuXueYuanLieBiao } from '../../services/xueyuan';

const { Search } = Input;
const { Option } = Select;

// 筛选条件
type FilterFields = {
    keyword?: string
    banJiId?: string
}

class ZaiDuXueYuanTabStore {
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
    zaiDuXueYuanList: ZaiDuXueYuanView[] | [] = [];

    @action
    setPagination(pagination: TablePaginationConfig) {
        this.pagination = pagination;
        this.search();
    }

    @action
    async search() {
        const { current, pageSize } = this.pagination;
        const keyword: string = this.filterFields?.keyword || "";
        const banJiId: string = this.filterFields?.banJiId || "";

        try {
            const result = await huoQuZaiDuXueYuanLieBiao(current || 1, pageSize || 10, keyword, banJiId);
            if (result) {
                const { list, total } = result;
                runInAction(() => {
                    this.zaiDuXueYuanList = list;
                    this.pagination = { ...this.pagination, total, current, pageSize };
                })
            }
        } catch (e) {

        }
    }
}

const ZaiDuXueYuanTab = () => {
    const [viewStore] = useState<ZaiDuXueYuanTabStore>(new ZaiDuXueYuanTabStore());

    const [banJiList, setBanJiList] = useState<BanJiView[]>([]);

    const { pagination, filterFields, zaiDuXueYuanList } = viewStore;

    useEffect(() => {
        const init = async () => {
            await viewStore.search();
        }
        init()
    }, []);

    // 获取班级
    useEffect(() => {
        const getBanJi = async () => {
            try {
                const result = await huoQuBanJiAll();
                setBanJiList(result.list);
            } catch (e) { }
        }
        getBanJi()
    }, [])

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

    // 班级改变
    const handleBanJiChange = (v: string) => {
        const newFilterFields = { ...filterFields, banJiId: v }
        viewStore.changeFilterFields(newFilterFields);
    }

    // 分页改变
    const onTableChange = (pagination: TablePaginationConfig) => {
        viewStore.setPagination(pagination)
    }

    const columns: TableColumnType<ZaiDuXueYuanView>[] = [
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
            title: '最后一次跟进',
            dataIndex: 'latestGenJinJiLu',
            key: 'latestGenJinJiLu',
            render: (values, record) => {
                let result: string = '';
                const genJinJilu: GenJinJiLu = record.latestGenJinJiLu;
                if (genJinJilu) {
                    result += '' + moment(Number(genJinJilu.genJinShiJian)).format('yyyy-MM-DD') + ": " + genJinJilu.neiRong;
                }
                return <span style={{ whiteSpace: 'pre-line' }}>{result || "--"}</span>;
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
                        <Button disabled type="link">跟进</Button>
                        <Button disabled type="link">试听</Button>
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
                                    <span>所在班级: </span>
                                </Col>
                                <Col>
                                    <Select style={{ width: '10rem' }} defaultValue={filterFields?.banJiId} onChange={handleBanJiChange} allowClear={true}>
                                        {banJiList?.map(k => {
                                            return (
                                                <Option key={k.id} value={k.id || ""}>{k.mingCheng}</Option>
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
                        <Button disabled type="primary">添加潜在学员</Button>
                        <Button disabled type="primary">分配跟进人</Button>
                        <Button disabled type="primary">批量导入</Button>
                        <Button disabled type="primary">批量删除</Button>
                        <Button disabled type="primary">导出</Button>
                    </Space>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            pagination={pagination}
                            dataSource={zaiDuXueYuanList}
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

export default observer(ZaiDuXueYuanTab)
