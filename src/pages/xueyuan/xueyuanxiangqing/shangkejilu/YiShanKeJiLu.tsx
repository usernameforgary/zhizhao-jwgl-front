import { Col, Row, Select, DatePicker, TablePaginationConfig, TableColumnType, Table, Space } from 'antd'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import moment, { Moment } from 'moment'
import React, { useState, useEffect } from 'react'
import { BanJiView, DianMingJiLu, LaoShi, XueYuanXinXi } from '../../../../customtypes'
import { huoQuBanJiLieBiaoByXueYuanId } from '../../../../services/banji'
import { huoQuDianMingJiLuLieBiao } from '../../../../services/dianmingjilu'
import { huoQuLaoShiAll } from '../../../../services/laoshi'
import { convertXueYuanDaoKeZhuangTai2Text } from '../../../../utils/converter'

const { Option } = Select

type YiShanKeJiLuProps = {
    xueYuanXinXi: XueYuanXinXi | undefined
}

class YiShanKeJiLuStore {
    constructor(xueYuanXinXi: XueYuanXinXi | undefined) {
        this.xueYuanXinXi = xueYuanXinXi;
        makeObservable(this);
    }

    @observable
    xueYuanXinXi: XueYuanXinXi | undefined = undefined;

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
            if (this.xueYuanXinXi) {
                const result = await huoQuDianMingJiLuLieBiao(current || 0, pageSize || 10, this.xueYuanXinXi.id, this.shangKeRiQiBegin?.valueOf(), this.shangKeRiQiEnd?.valueOf(), this.banJiId, this.shangKeLaoShiId);
                if (result) {
                    runInAction(() => {
                        const { list, total } = result;
                        this.dianMingJiLuList = list;
                        this.pagination = { ...this.pagination, total, current, pageSize };
                    });
                }
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

const YiShanKeJiLu: React.FC<YiShanKeJiLuProps> = ({ xueYuanXinXi }) => {
    const [viewStore] = useState<YiShanKeJiLuStore>(new YiShanKeJiLuStore(xueYuanXinXi));

    const [banJiList, setBanJiList] = useState<BanJiView[]>([]);
    const [laoShiList, setLaoShiList] = useState<LaoShi[]>([]);

    const { shangKeRiQiBegin, shangKeRiQiEnd, banJiId, shangKeLaoShiId, pagination, dianMingJiLuList } = viewStore;

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
                const result = await huoQuBanJiLieBiaoByXueYuanId(xueYuanXinXi?.id || '');
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

    const columns: TableColumnType<DianMingJiLu>[] = [
        {
            title: '点名时间',
            dataIndex: 'dianMingShiJian',
            key: 'dianMingShiJian',
            align: 'center',
            render: (value, record) => {
                let result = "";
                result += moment(Number(record.dianMingShiJian)).format('YYYY-MM-DD');
                return <span style={{ whiteSpace: 'pre-line' }}>{result}</span>;
            }
        },
        {
            title: '班级名称',
            dataIndex: 'banJiMingCheng',
            key: 'banJiMingCheng'
        },
        {
            title: '上课时间',
            dataIndex: 'shangKeShiJianStart',
            key: 'shangKeShiJianStart',
            align: 'center',
            render: (value, record) => {
                let result = "";

                result += moment(Number(record.shangKeRiQi)).format('YYYY-MM-DD') + " " + moment(Number(record.shangKeShiJianStart)).format('HH:mm') + "-" + moment(Number(record.shangKeShiJianEnd)).format('HH:mm');
                return <span style={{ whiteSpace: 'pre-line' }}>{result}</span>;
            }
        },
        {
            title: '上课老师',
            dataIndex: 'shangKeLaoShiXingMing',
            key: 'shangKeLaoShiXingMing'
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
            title: '实际授课课时',
            dataIndex: 'kouChuKeShi',
            key: 'kouChuKeShi'
        },
        {
            title: '课消金额',
            dataIndex: 'keXiaoJinE',
            key: 'keXiaoJinE',
            render: (values) => {
                return <span style={{ whiteSpace: 'pre-line' }}> ￥ {Number(values).toFixed(2) || "0"}</span>;
            },
        },
        {
            title: '备注',
            dataIndex: 'beiZhu',
            key: 'beiZhu'
        }
    ];

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Row>
                    <Col span={8}>
                        <span>上课日期：</span>
                        <DatePicker defaultValue={shangKeRiQiBegin} onChange={(m) => handleShangKeRiQiBeginChange(m)} />
                        &nbsp; ~ &nbsp;
                        <DatePicker defaultValue={shangKeRiQiEnd} onChange={(m) => handleShangKeRiQiEndChange(m)} />
                    </Col>
                    <Col span={8}>
                        <span>所在班级：</span>
                        <Select style={{ width: '10rem' }} defaultValue={banJiId} onChange={handleBanJiChange}>
                            {banJiList?.map(k => {
                                return (
                                    <Option key={k.id} value={k.id || ""}>{k.mingCheng}</Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <span>上课老师：</span>
                        <Select style={{ width: '10rem' }} defaultValue={shangKeLaoShiId} onChange={handleShangKeLaoShiChange}>
                            {laoShiList?.map(k => {
                                return (
                                    <Option key={k.id} value={k.id || ""}>{k.xingMing}</Option>
                                );
                            })}
                        </Select>
                    </Col>
                </Row>
                <Row>

                </Row>
                <Row>

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
        </>
    )
}

export default observer(YiShanKeJiLu)
