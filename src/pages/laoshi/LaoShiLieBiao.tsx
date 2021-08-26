import { Row, Col, Input, Space, TablePaginationConfig, TableColumnType, Table, Select, Tag } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react'
import { LaoShi } from '../../customtypes';
import { huoQuLaoShiLieBiao } from '../../services/laoshi';
import { convertXingBie2Text } from '../../utils/converter';


const { Search } = Input;
const { Option } = Select;

// 筛选条件
type FilterFields = {
    keyword?: string
    zaiZhiZhuangTai?: number
}

class LaoShiStore {
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
    laoShiList: LaoShi[] | [] = [];

    @action
    setPagination(pagination: TablePaginationConfig) {
        this.pagination = pagination;
        this.search();
    }

    @action
    async search() {
        const { current, pageSize } = this.pagination;
        const keyword: string = this.filterFields?.keyword || "";
        const zaiZhiZhuangTai: number | undefined = this.filterFields?.zaiZhiZhuangTai;

        try {
            const result = await huoQuLaoShiLieBiao(current || 1, pageSize || 10, keyword, zaiZhiZhuangTai);
            if (result) {
                const { list, total } = result;
                runInAction(() => {
                    this.laoShiList = list;
                    this.pagination = { ...this.pagination, total, current, pageSize };
                })
            }
        } catch (e) {

        }
    }
}

const LaoShiLieBiao = () => {
    const [viewStore] = useState<LaoShiStore>(new LaoShiStore());

    const { pagination, filterFields, laoShiList } = viewStore;

    useEffect(() => {
        const init = async () => {
            await viewStore.search();
        }
        init()
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

    // 在职状态改变
    const handleZaiZhiZhuangTaiChange = (v: number) => {
        const newFilterFields = { ...filterFields, zaiZhiZhuangTai: v }
        viewStore.changeFilterFields(newFilterFields);
    }

    // 分页改变
    const onTableChange = (pagination: TablePaginationConfig) => {
        viewStore.setPagination(pagination)
    }

    const columns: TableColumnType<LaoShi>[] = [
        {
            title: '老师姓名',
            dataIndex: 'xingMing',
            key: 'xingMing'
        },
        {
            title: '性别',
            dataIndex: 'xingBie',
            key: 'xingBie',
            render: (values, record) => {
                return (
                    <span>
                        {convertXingBie2Text(record.xingBie)}
                    </span>
                );
            }
        },
        {
            title: '擅长科目组',
            dataIndex: 'shanChangKeMuZu',
            key: 'shanChangKeMuZu',
            render: (values, record) => {
                return (<Space>
                    {record.shanChangKeMuZu?.map(v => {
                        return <Tag style={{ margin: '0px' }} color="geekblue" key={v.id}>{v.mingCheng}</Tag>
                    })}
                </Space>);
            },
        },
        {
            title: '手机号',
            dataIndex: 'shouJi',
            key: 'shouJi',
        },
        {
            title: '上月点名率',
            dataIndex: 'shangYueDianMingLv',
            key: 'shangYueDianMingLv',
            render: (values: number) => {
                return (
                    <span style={{ whiteSpace: 'pre-line' }}>
                        {values ? (values * 100).toFixed(2) + " %" : `0`}
                    </span>
                );
            },
        },
        {
            title: '上月课时',
            dataIndex: 'shangYueKeShi',
            key: 'shangYueKeShi',
            render: (values: number) => {
                return (
                    <span style={{ whiteSpace: 'pre-line' }}>
                        {values || 0}
                    </span>
                );
            },
        },
        {
            title: '本月课时',
            dataIndex: 'benYueKeShi',
            key: 'benYueKeShi',
            render: (values: number) => {
                return (
                    <span style={{ whiteSpace: 'pre-line' }}>
                        {values || 0}
                    </span>
                );
            },
        },
        {
            title: '已上课时',
            dataIndex: 'yiShangKeShi',
            key: 'yiShangKeShi',
            render: (values: number) => {
                return (
                    <span style={{ whiteSpace: 'pre-line' }}>
                        {values || 0}
                    </span>
                );
            },
        },
        {
            title: '在职状态',
            dataIndex: 'zaiZhiZhuangTai',
            key: 'zaiZhiZhuangTai',
            render: (values: boolean) => {
                return (
                    <span style={{ whiteSpace: 'pre-line' }}>
                        {values ? '在职' : '离职'}
                    </span>
                );
            },
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
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Row>
                    <Col span={7}>
                        <Row align="middle">
                            <Space size="middle">
                                <Col>
                                    <span>搜索老师: </span>
                                </Col>
                                <Col>
                                    <Search allowClear onChange={handleSearchChange} onSearch={handleSearch} />
                                </Col>
                            </Space>
                        </Row>
                    </Col>
                    <Col span={7}>
                        <Row align="middle">
                            <Space size="middle">
                                <Col>
                                    <span>在职状态: </span>
                                </Col>
                                <Col>
                                    <Select style={{ width: '10rem' }} onChange={handleZaiZhiZhuangTaiChange} allowClear={true}>
                                        <Option value={1}>在职</Option>
                                        <Option value={0}>离职</Option>
                                    </Select>
                                </Col>
                            </Space>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            pagination={pagination}
                            dataSource={laoShiList}
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

export default observer(LaoShiLieBiao)
