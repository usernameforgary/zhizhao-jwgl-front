import { Row, Col, Input, Button, Space, TablePaginationConfig, TableColumnType, Table, Select, Tag } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { GenJinJiLu, GenJinZhuangTai, QianZaiXueYuanView, YuanGong, ZhangHaoLeiXing } from '../../customtypes';
import { getDefinedRouteByRouteName, routeName } from '../../router';
import { huoQuYuanGongLieBiaoAll } from '../../services/account';
import { huoQuQianZaiXueYuanLieBiao } from '../../services/xueyuan';
import { convertString2GenJinZhuangTai } from '../../utils/converter';

const { Search } = Input;
const { Option } = Select;

// 筛选条件
type FilterFields = {
    keyword?: string
    genJinZhuangTai?: GenJinZhuangTai
    genJinRenId?: string
}

class QianZaiXueYuanTabStore {
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
    qianZaiXueYuanList: QianZaiXueYuanView[] | [] = [];

    @action
    setPagination(pagination: TablePaginationConfig) {
        this.pagination = pagination;
        this.search();
    }

    @action
    async search() {
        const { current, pageSize } = this.pagination;
        const keyword: string = this.filterFields?.keyword || "";
        const genJinZhuangTai: GenJinZhuangTai | undefined = this.filterFields?.genJinZhuangTai || undefined;
        const genJinRenId: string = this.filterFields?.genJinRenId || "";

        try {
            const result = await huoQuQianZaiXueYuanLieBiao(current || 1, pageSize || 10, keyword, genJinZhuangTai, genJinRenId);
            if (result) {
                const { list, total } = result;
                runInAction(() => {
                    this.qianZaiXueYuanList = list;
                    this.pagination = { ...this.pagination, total, current, pageSize };
                })
            }
        } catch (e) {

        }
    }
}

const QianZaiXueYuanTab = () => {
    const [viewStore] = useState<QianZaiXueYuanTabStore>(new QianZaiXueYuanTabStore());

    const [yuanGongList, setYuanGongList] = useState<YuanGong[]>([]);

    const { pagination, filterFields, qianZaiXueYuanList } = viewStore;

    useEffect(() => {
        const init = async () => {
            await viewStore.search();
        }
        init()
    }, []);

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

    // 跟进人改变
    const handleGenJinRenChange = (v: string) => {
        const newFilterFields = { ...filterFields, genJinRenId: v }
        viewStore.changeFilterFields(newFilterFields);
    }

    // 跟进状态
    const handleGenJinZhuangTaiChange = (v: string) => {
        const genJinZhangTai = convertString2GenJinZhuangTai(v);
        const newFilterFields = { ...filterFields, genJinZhuangTai: genJinZhangTai }
        viewStore.changeFilterFields(newFilterFields);
    }

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

    // 分页改变
    const onTableChange = (pagination: TablePaginationConfig) => {
        viewStore.setPagination(pagination)
    }

    const columns: TableColumnType<QianZaiXueYuanView>[] = [
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
            title: '跟进状态',
            dataIndex: 'genJinZhangTai',
            key: 'genJinZhangTai',
        },
        {
            title: '意向级别',
            dataIndex: 'yiXiangJiBie',
            key: 'yiXiangJiBie'
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
            title: '下次跟进时间',
            dataIndex: 'nextGenJinJiLu',
            key: 'nextGenJinJiLu',
            render: (values, record) => {
                let result: string = '';
                const genJinJilu: GenJinJiLu = record.latestGenJinJiLu;
                if (genJinJilu) {
                    result += '' + moment(Number(genJinJilu.genJinShiJian)).format('yyyy-MM-DD');
                }
                return <span style={{ whiteSpace: 'pre-line' }}>{result || "--"}</span>;
            },
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
            title: '标签',
            dataIndex: 'xueYuanBiaoQianZu',
            key: 'xueYuanBiaoQianZu',
            render: (values, record) => {
                return (<Space>
                    {record.xueYuanBiaoQianZu?.map(v => {
                        return <Tag style={{ margin: '0px' }} color="geekblue" key={v.id}>{v.mingCheng}</Tag>
                    })}
                </Space>);
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
                                    <span>跟进状态: </span>
                                </Col>
                                <Col>
                                    <Select style={{ width: '10rem' }} onChange={handleGenJinZhuangTaiChange} allowClear={true}>
                                        <Option key={GenJinZhuangTai.DAI_GEN_JIN} value={GenJinZhuangTai.DAI_GEN_JIN}>{"待跟进"}</Option>
                                        <Option key={GenJinZhuangTai.GEN_JIN_ZHONG} value={GenJinZhuangTai.GEN_JIN_ZHONG}>{"跟进中"}</Option>
                                        <Option key={GenJinZhuangTai.YI_YUE_KE} value={GenJinZhuangTai.YI_YUE_KE}>{"已约课"}</Option>
                                        <Option key={GenJinZhuangTai.YI_TI_YAN} value={GenJinZhuangTai.YI_TI_YAN}>{"已体验"}</Option>
                                        <Option key={GenJinZhuangTai.YI_SHI_XIAO} value={GenJinZhuangTai.YI_SHI_XIAO}>{"已失效"}</Option>
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
                            dataSource={qianZaiXueYuanList}
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

export default observer(QianZaiXueYuanTab)
