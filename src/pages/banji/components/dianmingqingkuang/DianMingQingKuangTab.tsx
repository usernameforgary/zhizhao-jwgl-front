import { TablePaginationConfig, Row, Col, Button, Space, TableColumnType, Table } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react';
import moment, { Moment } from 'moment';
import React, { useState, useEffect } from 'react'
import { BanJiView, PaiKeChongFuFangShiFenLei, PaiKeFangShiFenLei, PaiKeGuiZe, PaiKeJiLu, PaiKeJiLuZhuangTai, ShanKeXueYuan, XueYuanDaoKeZhuangTai } from '../../../../customtypes'
import { huoQuPaiKeJiLuLieBiao } from '../../../../services/pakejilu';
import { convertMomentIsoWeekDay2Text } from '../../../../utils/converter';
import DianMingJieGuoModal from './DianMingJieGuoModal';
import DianMingModal from './DianMingModal';

class DiangMingQingKuangStore {
    constructor(banJiXiangQing: BanJiView | undefined) {
        this.banJiXiangQing = banJiXiangQing;
        makeObservable(this);
    }

    @observable
    banJiXiangQing: BanJiView | undefined = undefined;

    // 一周内的未点名排课记录
    @observable
    yiZhouPaiJiLu: PaiKeJiLu[] = [];

    // 一周内的未点名排课记录，分页信息
    @observable
    yiZhouPagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 2 };

    // 当前周
    @observable
    dangQianZhouDate: Moment = moment();

    // 历史点名记录
    @observable
    liShiPaiKeJiLu: PaiKeJiLu[] = [];

    // 历史点名记录，分页信息
    @observable
    liShiPagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 2 };

    // 显示点名结果的排课记录
    @observable
    showingDianMingPaikeJiLu: PaiKeJiLu | undefined = undefined;

    // 获取一周排课记录
    @action
    async searchYiZhouPaiKeJiLu() {
        const weekStart = this.dangQianZhouDate.startOf('week').valueOf();
        const weekEnd = this.dangQianZhouDate.endOf('week').valueOf();
        const { current, pageSize } = this.yiZhouPagination;
        try {
            if (this.banJiXiangQing) {
                const result = await huoQuPaiKeJiLuLieBiao(current || 0, pageSize || 10, weekStart, weekEnd, this.banJiXiangQing.id, undefined, PaiKeJiLuZhuangTai.DAI_DIAN_MING);
                if (result) {
                    runInAction(() => {
                        const { list, total } = result;
                        this.yiZhouPaiJiLu = list;
                        this.yiZhouPagination = { ...this.yiZhouPagination, total, current, pageSize };
                    });
                }
            }
        } catch (e) { }
    }

    // 设置要查询的当前周日期
    @action
    setDangQianZhouDate(currentDate: Moment) {
        this.dangQianZhouDate = currentDate;
    }

    // 一周排课记录分页改变
    @action
    setYiZhouPagination(pagination: TablePaginationConfig) {
        this.yiZhouPagination = pagination;
        this.searchYiZhouPaiKeJiLu();
    }

    // 获取历史排课记录
    @action
    async searchLiShiPaiKeJiLu() {
        const { current, pageSize } = this.liShiPagination;
        try {
            if (this.banJiXiangQing) {
                const result = await huoQuPaiKeJiLuLieBiao(current || 0, pageSize || 10, undefined, undefined, this.banJiXiangQing.id, undefined, PaiKeJiLuZhuangTai.YI_DIAN_MING);
                if (result) {
                    runInAction(() => {
                        const { list, total } = result;
                        this.liShiPaiKeJiLu = list;
                        this.liShiPagination = { ...this.liShiPagination, total, current, pageSize };
                    });
                }
            }
        } catch (e) { }
    }

    // 历史排课记录分页改变
    @action
    setLiShiPagination(pagination: TablePaginationConfig) {
        this.liShiPagination = pagination;
        this.searchLiShiPaiKeJiLu()
    }

    // 设置要显示结果的排课记录
    @action
    setShowingDianMingPaiPaikeJiLu(paiKeJiLu: PaiKeJiLu) {
        this.showingDianMingPaikeJiLu = paiKeJiLu;
    }
}

type DianMingQingKuangProps = {
    banJiXiangQing: BanJiView | undefined
}

const DianMingQingKuangTab: React.FC<DianMingQingKuangProps> = ({ banJiXiangQing }) => {
    // 点名窗口
    const [showDianMingModal, setShowDianMingModal] = useState<boolean>(false);
    // 刷新周点名记录
    const [refreshZhouDianMing, setRefreshZhouDianMing] = useState<boolean>(false);
    // 当前选中的排课记录
    const [selectedPaiKeJiLu, setSelectedPaiKeJiLu] = useState<PaiKeJiLu>();
    // 点名结果显示窗口
    const [showDianMingJieGuoModal, setShowDianMingJieGuoModal] = useState<boolean>(false);

    const [viewStore] = useState<DiangMingQingKuangStore>(new DiangMingQingKuangStore(banJiXiangQing));

    const { dangQianZhouDate, yiZhouPagination, yiZhouPaiJiLu, liShiPaiKeJiLu, liShiPagination, showingDianMingPaikeJiLu } = viewStore;

    useEffect(() => {
        const getYiZhouPaiKeJiLu = async () => {
            await viewStore.searchYiZhouPaiKeJiLu();
        }
        getYiZhouPaiKeJiLu();
    }, [dangQianZhouDate])

    useEffect(() => {
        const getYiZhouPaiKeJiLu = async () => {
            await viewStore.searchYiZhouPaiKeJiLu();
        }
        const getLishiPaiKeJiLu = async () => {
            await viewStore.searchLiShiPaiKeJiLu();
        }
        getYiZhouPaiKeJiLu();
        getLishiPaiKeJiLu();
    }, [refreshZhouDianMing])

    const yiZhouColumns: TableColumnType<PaiKeJiLu>[] = [
        {
            title: '上课时间',
            dataIndex: 'shangKeRiQi',
            key: 'shangKeRiQi',
            align: 'center',
            render: (value, record) => {
                let result = "";
                const paiKeGuiZe: PaiKeGuiZe = record.paiKeGuiZe;

                if (paiKeGuiZe) {
                    if (paiKeGuiZe.paiKeFangShi === PaiKeFangShiFenLei.RI_LI_PAI_KE) {
                        result += "（日历）" + moment(Number(record.shangKeRiQi)).format("YYYY-MM-DD");
                    }
                    if (paiKeGuiZe.guiZeChongFuFangShi === PaiKeChongFuFangShiFenLei.MEI_ZHOU) {
                        result += "（每周）" + convertMomentIsoWeekDay2Text(moment(Number(record.shangKeRiQi)).isoWeekday());
                    }
                }

                result += "\n" + moment(Number(record.shangKeShiJianStart)).format('HH:mm') + "-" + moment(Number(record.shangKeShiJianEnd)).format('HH:mm');
                return <span style={{ whiteSpace: 'pre-line' }}>{result}</span>;
            }
        },
        {
            title: '上课教室',
            dataIndex: 'shangKeJiaoShiMingCheng',
            key: 'shangKeJiaoShiMingCheng',
        },
        {
            title: '上课老师',
            dataIndex: 'shangKeLaoShiXingMing',
            key: 'shangKeLaoShiXingMing'
        },
        {
            title: '上课内容',
            dataIndex: 'shangKeNeiRong',
            key: 'shangKeNeiRong',
            render: (values) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{values || "--"}</span>;
            },
        },
        {
            title: '点名时间',
            dataIndex: 'dianMingShiJian',
            key: 'dianMingShiJian',
            render: (values) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{values || "--"}</span>;
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (value, record) => {
                const canDianMing: boolean = record.shangKeXueYuanZu && record.shangKeXueYuanZu.length > 0;
                return <>
                    <Button disabled={!canDianMing} type="link" onClick={() => handleDianMingClick(record)}>点名</Button>
                    <Button type="link" >调课</Button>
                    <Button type="link">删除</Button>
                </>;
            }
        },
    ];

    const liShiPaikeJiLuColumns: TableColumnType<PaiKeJiLu>[] = [
        {
            title: '上课时间',
            dataIndex: 'shangKeRiQi',
            key: 'shangKeRiQi',
            align: 'center',
            render: (value, record) => {
                let result = "";
                const paiKeGuiZe: PaiKeGuiZe = record.paiKeGuiZe;

                if (paiKeGuiZe) {
                    if (paiKeGuiZe.paiKeFangShi === PaiKeFangShiFenLei.RI_LI_PAI_KE) {
                        result += "（日历）" + moment(Number(record.shangKeRiQi)).format("YYYY-MM-DD");
                    }
                    if (paiKeGuiZe.guiZeChongFuFangShi === PaiKeChongFuFangShiFenLei.MEI_ZHOU) {
                        result += "（每周）" + convertMomentIsoWeekDay2Text(moment(Number(record.shangKeRiQi)).isoWeekday());
                    }
                }

                result += "\n" + moment(Number(record.shangKeShiJianStart)).format('HH:mm') + "-" + moment(Number(record.shangKeShiJianEnd)).format('HH:mm');
                return <span style={{ whiteSpace: 'pre-line' }}>{result}</span>;
            }
        },
        {
            title: '上课教室',
            dataIndex: 'shangKeJiaoShiMingCheng',
            key: 'shangKeJiaoShiMingCheng',
        },
        {
            title: '上课老师',
            dataIndex: 'shangKeLaoShiXingMing',
            key: 'shangKeLaoShiXingMing'
        },
        {
            title: '上课内容',
            dataIndex: 'shangKeNeiRong',
            key: 'shangKeNeiRong',
            render: (values) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{values || "--"}</span>;
            },
        },
        {
            title: '点名时间',
            dataIndex: 'dianMingShiJian',
            key: 'dianMingShiJian',
            render: (values) => {
                const result = values ? moment(Number(values)).format('YYYY-MM-DD HH:mm') : "--";
                return <span style={{ whiteSpace: 'pre-line' }}>{result || "--"}</span>;
            },
        },
        {
            title: '授课课时',
            dataIndex: 'shouKeKeShi',
            key: 'shouKeKeShi',
            render: (values) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{values || 0}</span>;
            },
        },
        {
            title: '实到人数',
            dataIndex: 'shouKeKeShi',
            key: 'shouKeKeShi',
            render: (values, record) => {
                const shangKeXueYuanZu: ShanKeXueYuan[] = record.shangKeXueYuanZu;
                const daoKeXueYuanZu: ShanKeXueYuan[] = shangKeXueYuanZu.filter(v => (v.xueYuanDaoKeZhuangTai === XueYuanDaoKeZhuangTai.DAO_KE || v.xueYuanDaoKeZhuangTai === XueYuanDaoKeZhuangTai.CHI_DAO))
                return <Button onClick={e => handleLiShiDianMingXiangQing(record)} type="link">{daoKeXueYuanZu.length || 0}/{shangKeXueYuanZu.length}</Button>;
            },
        }
    ];

    // 点名点击事件
    const handleDianMingClick = (selectedPaiKeJiLu: PaiKeJiLu) => {
        setShowDianMingModal(true);
        setSelectedPaiKeJiLu(selectedPaiKeJiLu);
    }

    // 一周排课记录分页改变
    const onYiZhouTableChange = (pagination: TablePaginationConfig) => {
        viewStore.setYiZhouPagination(pagination);
    }

    // 历史排课记录分页改变
    const onLiShiTableChange = (pagination: TablePaginationConfig) => {
        viewStore.setLiShiPagination(pagination)
    }

    // 上一周
    const handlePreviousWeek = () => {
        const newValue = moment(dangQianZhouDate).add(-1, 'week');
        viewStore.setDangQianZhouDate(newValue);
    }

    // 本周
    const handleCurrentWeek = () => {
        const newValue = moment();
        viewStore.setDangQianZhouDate(newValue);
    }

    // 下一周
    const handleNextWeek = () => {
        const newValue = moment(dangQianZhouDate).add(1, 'week');
        viewStore.setDangQianZhouDate(newValue);
    }

    // 点名窗口显示
    const toggleDianMingModal = () => {
        setShowDianMingModal(!showDianMingModal);
    }

    // 周点名记录刷新
    const toggleRefreshZhouDianMing = () => {
        setRefreshZhouDianMing(!refreshZhouDianMing);
    }

    // 点名结果点击，查看点名情况
    const handleLiShiDianMingXiangQing = (paiKeJiLu: PaiKeJiLu) => {
        viewStore.setShowingDianMingPaiPaikeJiLu(paiKeJiLu);
        setShowDianMingJieGuoModal(true);
    }

    // 点名结果窗口显示
    const toggleDianMingJieGuoModal = () => {
        setShowDianMingJieGuoModal(!showDianMingJieGuoModal);
    }

    return (
        <>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>

                <Row justify="space-between">
                    <Col>
                        <span>
                            一周点名情况&nbsp;
                            {dangQianZhouDate.startOf('week').format('YYYY/MM/DD')}
                            &nbsp;~&nbsp;
                            {dangQianZhouDate.endOf('week').format('YYYY/MM/DD')}
                        </span>
                    </Col>
                    <Col>
                        <Space size="large">
                            <Button onClick={handlePreviousWeek}>{`< 上一周`}</Button>
                            <Button onClick={handleCurrentWeek}>{`本周`}</Button>
                            <Button onClick={handleNextWeek}>{`下一周 >`}</Button>
                        </Space>
                    </Col>
                </Row>
                <Row style={{ width: '100%' }}>
                    <Col span={24}>
                        <Table
                            pagination={yiZhouPagination}
                            dataSource={yiZhouPaiJiLu}
                            columns={yiZhouColumns}
                            onChange={onYiZhouTableChange}
                        >
                        </Table>
                    </Col>
                </Row>
            </Space>
            <Row>
                <Row>
                    <Col>
                        <span>
                            历史点名情况
                        </span>
                    </Col>
                </Row>
                <Row style={{ width: '100%' }}>
                    <Col span={24}>
                        <Table
                            pagination={liShiPagination}
                            dataSource={liShiPaiKeJiLu}
                            columns={liShiPaikeJiLuColumns}
                            onChange={onLiShiTableChange}
                        >
                        </Table>
                    </Col>
                </Row>
            </Row>

            {
                showDianMingModal ?
                    <DianMingModal
                        banJiXiangQing={viewStore.banJiXiangQing}
                        paiKeJiLu={selectedPaiKeJiLu}
                        visible={showDianMingModal}
                        onClose={toggleDianMingModal}
                        refreshJiLuList={toggleRefreshZhouDianMing} /> : ""
            }
            {showingDianMingPaikeJiLu ?
                <DianMingJieGuoModal
                    visible={showDianMingJieGuoModal}
                    banJiXiangQing={banJiXiangQing}
                    paiKeJiLu={showingDianMingPaikeJiLu}
                    onClose={toggleDianMingJieGuoModal}
                /> : ""
            }
        </>
    )
}

export default observer(DianMingQingKuangTab);