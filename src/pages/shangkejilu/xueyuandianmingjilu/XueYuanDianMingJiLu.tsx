import { DatePicker, Select, Col, Row, TablePaginationConfig, Button, TableColumnType, Table, Space, Tooltip } from 'antd'
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import moment, { Moment } from 'moment';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import DaoChuWenJianJieGuoModal from '../../../components/modals/daochuwenjian/DaoChuWenJianJieGuoModal';
import { BanJiView, DianMingJiLu, IMainStore, LaoShi, PaiKeJiLu, PaiKeJiLuZhuangTai } from '../../../customtypes';
import { getDefinedRouteByRouteName, routeName } from '../../../router';
import { huoQuBanJiAll } from '../../../services/banji';
import { daoChuXueYuanDianMingJiLu } from '../../../services/combine';
import { huoQuDianMingJiLuLieBiao } from '../../../services/dianmingjilu';
import { huoQuLaoShiAll } from '../../../services/laoshi';
import { getStore } from '../../../store/useStore';
import { convertXueYuanDaoKeZhuangTai2Text } from '../../../utils/converter';
import DianMingJieGuoModal from '../../banji/components/dianmingqingkuang/DianMingJieGuoModal';

const { Option } = Select;

class XueYuanDianMingJiLuStore {
    constructor() {
        makeObservable(this);
    }

    // 一周内的未点名排课记录
    @observable
    dianMingJiLuList: DianMingJiLu[] = [];

    // 上课日期 - 开始
    @observable
    shangKeRiQiBegin: Moment | undefined = undefined;

    // 上课日期 - 结束
    @observable
    shangKeRiQiEnd: Moment | undefined = undefined;

    // 班级Id
    @observable
    banJiId: string | undefined = undefined;

    // 上课老师Id
    @observable
    shangKeLaoShiId: string | undefined = undefined;

    // 历史点名记录，分页信息
    @observable
    pagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 10 };

    // 获取点名记录
    @action
    async searchDianMingJiLu() {
        const { current, pageSize } = this.pagination;
        try {
            const result = await huoQuDianMingJiLuLieBiao(
                current || 0,
                pageSize || 10,
                undefined,
                this.shangKeRiQiBegin?.valueOf(),
                this.shangKeRiQiEnd?.valueOf(),
                this.banJiId,
                this.shangKeLaoShiId
            );
            if (result) {
                runInAction(() => {
                    const { list, total } = result;
                    this.dianMingJiLuList = list;
                    this.pagination = { ...this.pagination, total, current, pageSize };
                });
            }
        } catch (e) { }
    }

    @action
    setShangKeRiQiBegin(v: Moment | undefined) {
        this.shangKeRiQiBegin = v;
        this.searchDianMingJiLu();
    }

    @action
    setShangKeRiQiEnd(v: Moment | undefined) {
        this.shangKeRiQiEnd = v;
        this.searchDianMingJiLu();
    }

    @action
    setPagination(pagination: TablePaginationConfig) {
        this.pagination = pagination;
        this.searchDianMingJiLu();
    }

    @action
    setBanJiId(banJiId: string) {
        this.banJiId = banJiId;
        this.searchDianMingJiLu();
    }

    @action
    setShangKeLaoShiId(shangKeLaoShiId: string) {
        this.shangKeLaoShiId = shangKeLaoShiId;
        this.searchDianMingJiLu();
    }
}

const XueYuanDianMingJiLu = () => {
    const userStore = getStore<IMainStore>();

    const [viewStore] = useState<XueYuanDianMingJiLuStore>(new XueYuanDianMingJiLuStore());
    const [banJiList, setBanJiList] = useState<BanJiView[]>([]);
    const [laoShiList, setLaoShiList] = useState<LaoShi[]>([]);
    const [showDianMingJiGuo, setShowDianMingJieGuo] = useState<boolean>(false);
    const [selectedPaiKeJiLu, setSelectedPaiKeJiLu] = useState<PaiKeJiLu>();
    // 展示导出结果窗口
    const [showDaoChuJieGuoModal, setShowDaoChuJieGuoModal] = useState<boolean>(false);
    // 导出时错误信息
    const [daoChuError, setDaoChuError] = useState<string>("");

    const { shangKeRiQiBegin, shangKeRiQiEnd, banJiId, shangKeLaoShiId, pagination, dianMingJiLuList } = viewStore

    useEffect(() => {
        const search = async () => {
            await viewStore.searchDianMingJiLu();
        }
        search();
    }, [])

    // 获取老师列表
    useEffect(() => {
        const getLaoshi = async () => {
            try {
                const result = await huoQuLaoShiAll();
                setLaoShiList(result.list);
            } catch (e) { }
        }
        getLaoshi()
    }, [])

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

    // 上课日期 - 开始，改变事件
    const handleShangKeRiQiBeginChange = (v: Moment | null) => {
        viewStore.setShangKeRiQiBegin(v ? v : undefined);
    }

    // 上课日期 - 结束，改变事件
    const handleShangKeRiQiEndChange = (v: Moment | null) => {
        viewStore.setShangKeRiQiEnd(v ? v : undefined);
    }

    // 分页改变
    const onTableChange = (pagination: TablePaginationConfig) => {
        viewStore.setPagination(pagination)
    }

    // 班级改变
    const handleBanJiChange = (v: string) => {
        viewStore.setBanJiId(v)
    }

    // 上课老师改变
    const handleShangKeLaoShiChange = (v: string) => {
        viewStore.setShangKeLaoShiId(v)
    }

    // 点击查看点名结果
    const handleShowDianMingJieGuo = (paiKeJiLu: PaiKeJiLu) => {
        setSelectedPaiKeJiLu(paiKeJiLu);
        setShowDianMingJieGuo(true);
    }

    // 关闭点名结果窗口
    const closeDianMingJieGuoModal = () => {
        setShowDianMingJieGuo(false);
    }

    // 点名记录导出
    const handleDaoChuXueYuanDianMing = async () => {
        try {
            if (userStore.user && userStore.user.id) {
                await daoChuXueYuanDianMingJiLu(
                    userStore.user.id,
                    undefined,
                    shangKeRiQiBegin?.valueOf(),
                    shangKeRiQiEnd?.valueOf(),
                    banJiId,
                    shangKeLaoShiId
                );

                await userStore.huoQuDaiXiaZaiWenJianShu();
                // 显示导出结果窗口
                handleShowDaoChuModal();
            }
        } catch (e) {
            setDaoChuError(e.toString());
            // 显示导出结果窗口
            handleShowDaoChuModal();
        }

    }

    // 导出窗口显示
    const handleShowDaoChuModal = () => {
        setShowDaoChuJieGuoModal(!showDaoChuJieGuoModal);
    }

    const columns: TableColumnType<DianMingJiLu>[] = [
        {
            title: '上课时间',
            dataIndex: 'shangKeRiQi',
            key: 'shangKeRiQi',
            render: (values) => {
                const result = values ? moment(Number(values)).format('yyyy-MM-DD') : "--";
                return <span style={{ whiteSpace: 'pre-line' }}>{result || "--"}</span>;
            },
        },
        {
            title: '上课时段',
            dataIndex: 'shangKeShiJianStart',
            key: 'shangKeShiJianEnd',
            render: (values, record) => {
                let result = "";

                result += moment(Number(record.shangKeShiJianStart)).format('hh:mm') + "-" + moment(Number(record.shangKeShiJianEnd)).format('hh:mm');
                return <span style={{ whiteSpace: 'pre-line' }}>{result}</span>;
            },
        },
        {
            title: '学员姓名',
            dataIndex: 'xueXueYuanXingMing',
            key: 'xueXueYuanXingMing'
        },
        {
            title: '联系电话',
            dataIndex: 'shouJi',
            key: 'shouJi'
        },
        {
            title: '班级',
            dataIndex: 'banJiMingCheng',
            key: 'banJiMingCheng'
        },
        {
            title: '所属课程',
            dataIndex: 'keChengMingCheng',
            key: 'keChengMingCheng'
        },
        {
            title: '到课状态',
            dataIndex: 'xueYuanDaoKeZhuangTai',
            key: 'xueYuanDaoKeZhuangTai',
            render: (value, record) => {
                return (
                    <span>{convertXueYuanDaoKeZhuangTai2Text(record.xueYuanDaoKeZhuangTai)}</span>
                );
            }
        },
        {
            title: '消耗课时',
            dataIndex: 'kouChuKeShi',
            key: 'kouChuKeShi',
            render: (values) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{values || 0}</span>;
            },
        },
        {
            title: '学费消耗',
            dataIndex: 'keXiaoJinE',
            key: 'keXiaoJinE',
            render: (values, record) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{record.keXiaoJinE.toFixed(2)}</span>;
            },
        },
        {
            title: '上课老师',
            dataIndex: 'shangKeLaoShiXingMing',
            key: 'shangKeLaoShiXingMing'
        },
        {
            title: '点评内容',
            dataIndex: 'dianPingNeiRong',
            key: 'dianPingNeiRong',
            render: (value, record) => {
                if (record.dianPingNeiRong && record.dianPingNeiRong.length > 10) {
                    return (
                        <Tooltip title={record.dianPingNeiRong}>
                            <span>{record.dianPingNeiRong.substring(0, 10)}...</span>
                        </Tooltip>
                    )
                } else {
                    return (
                        <span>{record.dianPingNeiRong || ""}</span>
                    )
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (values, record) => {
                if (record.paiKeJiLuZhuangTai === PaiKeJiLuZhuangTai.YI_DIAN_PING) {
                    return <Link to={`${getDefinedRouteByRouteName(routeName.chakandianping)?.path}/${record.paiKeJiLuId}`}>查点评</Link>
                } else {
                    return <Button type="link" disabled>查点评</Button>
                }
            },
        }
    ];

    return (
        <>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Row>
                    <Col span={8}>
                        <span>上课日期：</span>
                        <DatePicker defaultValue={shangKeRiQiBegin} onChange={(m) => handleShangKeRiQiBeginChange(m)} />
                        &nbsp; ~ &nbsp;
                        <DatePicker defaultValue={shangKeRiQiEnd} onChange={(m) => handleShangKeRiQiEndChange(m)} />
                    </Col>
                    <Col span={8}>
                        <span>所在班级：</span>
                        <Select style={{ width: '10rem' }} defaultValue={banJiId} onChange={handleBanJiChange} allowClear={true}>
                            {banJiList?.map(k => {
                                return (
                                    <Option key={k.id} value={k.id || ""}>{k.mingCheng}</Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <span>上课老师：</span>
                        <Select style={{ width: '10rem' }} defaultValue={shangKeLaoShiId} onChange={handleShangKeLaoShiChange} allowClear={true}>
                            {laoShiList?.map(k => {
                                return (
                                    <Option key={k.id} value={k.id || ""}>{k.xingMing}</Option>
                                );
                            })}
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Button type="primary" onClick={handleDaoChuXueYuanDianMing}>导出</Button>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            pagination={pagination}
                            dataSource={dianMingJiLuList}
                            columns={columns}
                            onChange={onTableChange}
                        >
                        </Table>
                    </Col>
                </Row>
            </Space>
            {
                (selectedPaiKeJiLu && showDianMingJiGuo) ?
                    <DianMingJieGuoModal
                        visible={showDianMingJiGuo}
                        paiKeJiLu={selectedPaiKeJiLu}
                        onClose={closeDianMingJieGuoModal}
                    /> : ""
            }
            {
                showDaoChuJieGuoModal ?
                    <DaoChuWenJianJieGuoModal
                        visible={showDaoChuJieGuoModal}
                        onClose={handleShowDaoChuModal}
                        errorStr={daoChuError}
                    /> : ""
            }
        </>
    )
}

export default observer(XueYuanDianMingJiLu)
