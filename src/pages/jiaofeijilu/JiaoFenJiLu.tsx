import React, { useState, useEffect } from 'react'
import { Row, Col, Table, TableColumnType, TablePaginationConfig, Button, message } from 'antd'
import { JiaoFeiJiLuTableViewData, JiaoFeiJiLuZhuangTai, JiaoFeiLiShi, XueYuanKeCheng, YouHuiLeiXing } from '../../customtypes';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { huoQuJiaoFeiJiLuLieBiao } from '../../services/jiaofeijilu';
import Loading from '../../components/loading/Loading';
import { convertKeChengLeiXing2Text } from '../../utils/converter';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getDefinedRouteByRouteName, routeName } from '../../router';
import JiaoFenQueRenModal from './JiaoFenQueRenModal';
import { jiaoFeiJiLuQueRen } from '../../services/combine';

class JiaoFenJiLuStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    list: JiaoFeiJiLuTableViewData[] = [];

    @observable
    currentSelectedRecord: JiaoFeiJiLuTableViewData | undefined = undefined;

    @observable
    keyword: string = "";

    @observable
    pagination: TablePaginationConfig = { current: 1, total: 0, pageSize: 10 };

    @action
    updateKeyword(val: string) {
        this.keyword = val;
    }

    @action
    setCurrentSelectedRecord = (selected: JiaoFeiJiLuTableViewData) => {
        this.currentSelectedRecord = selected;
    }

    @action
    async search(pagination: TablePaginationConfig) {
        const { current, pageSize } = pagination;
        try {
            const result = await huoQuJiaoFeiJiLuLieBiao(current || 0, pageSize || 10)
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

const JiaoFenJiLu = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [viewStore] = useState<JiaoFenJiLuStore>(new JiaoFenJiLuStore());
    const [showQueRenJiaoFeiModal, setShowQueRenJiaoFenModal] = useState<boolean>(false);
    const { list, pagination, currentSelectedRecord } = viewStore;

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

    // ??????????????????
    const getQianYueJinE = (xueYuanKeChengList: XueYuanKeCheng[]): number => {
        let jinETotal: number = 0;
        xueYuanKeChengList.forEach(v => {
            let currentTotal: number = (Number(v.danJia) * Number(v.keChengShuLiang));
            if (Number(v.youHuiShuLiang)) {
                if (v.youHuiLeiXing === YouHuiLeiXing.ZHI_JIAN) {
                    currentTotal -= Number(v.youHuiShuLiang)
                } else if (v.youHuiLeiXing === YouHuiLeiXing.ZHE_KOU) {
                    currentTotal = currentTotal * (100 - Number(v.youHuiShuLiang)) / 100
                } else {
                    // ?????????????????????
                }
            }
            jinETotal += currentTotal
        })
        return jinETotal;
    }

    // ??????????????????
    const getKeShiShuLiang = (xueYuanKeChengList: XueYuanKeCheng[]): number => {
        let jinETotal: number = 0;
        xueYuanKeChengList.forEach(v => {
            let currentTotal: number = (Number(v.keChengShuLiang) + Number(v.zengSongKeShi));
            jinETotal += currentTotal
        })
        return jinETotal;
    }

    // ??????????????????
    const getShiShouJinE = (jiaoFeiLiShiList: JiaoFeiLiShi[]): number => {
        let jinETotal: number = 0;
        jiaoFeiLiShiList.forEach(v => {
            jinETotal += v.jiaoFeiJinE;
        })
        return jinETotal;
    }

    // ????????????????????????
    const handleQueRenJiaoFenClick = (selected: JiaoFeiJiLuTableViewData) => {
        viewStore.setCurrentSelectedRecord(selected);
        toggelShowQueRenJiaoFeiModal();
    }

    // ????????????modal??????
    const toggelShowQueRenJiaoFeiModal = () => {
        setShowQueRenJiaoFenModal(!showQueRenJiaoFeiModal);
    }

    // ????????????????????????
    const handleJiaoFeiQueRen = async (result: string) => {
        if (!result) {
            message.error("?????????????????????");
            return;
        }
        if (!currentSelectedRecord?.id) {
            message.error("?????????????????????????????????");
            return;
        }

        try {
            await jiaoFeiJiLuQueRen(currentSelectedRecord.id, result);
            toggelShowQueRenJiaoFeiModal();
            viewStore.search(pagination);
        } catch (e) { }
    }

    const columns: TableColumnType<JiaoFeiJiLuTableViewData>[] = [
        {
            title: '?????????',
            dataIndex: 'id',
            key: 'id',
            render: (value) => {
                let routePath = getDefinedRouteByRouteName(routeName.jiaofeijiluxiangqing)?.path;
                if (routePath) {
                    routePath = routePath.substring(0, routePath.lastIndexOf(":"));
                }
                // TODO
                //return (<Link to={routePath + value} >{value}</Link >)
                return (<Link to="#" >{value}</Link >)
            }
        },
        {
            title: '????????????',
            dataIndex: 'xueYuanXingMing',
            key: 'xueYuanXingMing',
        },
        {
            title: '????????????',
            dataIndex: 'xueYuanKeChengZu',
            key: 'xueYuanKeChengZu',
            render: (values: XueYuanKeCheng[]) => {
                let res: string = "";
                if (values) {
                    values.forEach(v => {
                        res += `${convertKeChengLeiXing2Text(v.keChengLeiXing)}\n`;
                    })
                }

                return <span style={{ whiteSpace: 'pre-line' }}>{res}</span>;
            },
        },
        {
            title: '????????????',
            dataIndex: 'xueYuanKeChengZu',
            key: 'xueYuanKeChengZu',
            render: (values: XueYuanKeCheng[]) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{getQianYueJinE(values)} ???</span>;
            },
        },
        {
            title: '????????????',
            dataIndex: 'jiaoFeiLiShiZu',
            key: 'jiaoFeiLiShiZu',
            render: (values: JiaoFeiLiShi[]) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{getShiShouJinE(values)} ???</span>;
            },
        },
        {
            title: '????????????',
            dataIndex: 'jiaoFeiLiShiZu',
            key: 'jiaoFeiLiShiZu',
            render: (values: JiaoFeiLiShi[], record) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{getQianYueJinE(record.xueYuanKeChengZu) - getShiShouJinE(values)} ???</span>;
            },
        },
        {
            title: '?????????',
            dataIndex: 'genJinRenXingMing',
            key: 'genJinRenXingMing',
        },
        {
            title: '????????????',
            dataIndex: 'jiaoFeiLiShiZu',
            key: 'jiaoFeiLiShiZu',
            render: (values: JiaoFeiLiShi[]) => {
                let res: string = "";
                if (values) {
                    values.forEach(v => {
                        if (v.jiaoFeiRiQi) {
                            res += `${moment(Number(v.jiaoFeiRiQi)).format('YYYY-MM-DD HH:mm:ss')}\n`;
                        } else {
                            res += `?????????\n`;
                        }
                    })
                }
                return <span style={{ whiteSpace: 'pre-line' }}>{res}</span>;
            },
        },
        {
            title: '???????????? / ??????',
            dataIndex: 'xueYuanKeChengZu',
            key: 'xueYuanKeChengZu',
            render: (values: XueYuanKeCheng[]) => {
                let res: string = "";
                if (values) {
                    values.forEach(v => {
                        res += `${v.keChengMingCheng}  ${v.beiZhu}\n`;
                    })
                }
                return <span style={{ whiteSpace: 'pre-line' }}>{res}</span>;
            },
        },
        {
            title: '????????????',
            dataIndex: 'xueYuanKeChengZu',
            key: 'xueYuanKeChengZu',
            render: (values: XueYuanKeCheng[]) => {
                return <span style={{ whiteSpace: 'pre-line' }}>{getKeShiShuLiang(values)}</span>;
            },
        },
        {
            title: '????????????',
            key: 'action',
            render: (value, record) => {
                if (record.jiaoFeiJiLuZhuangTai === JiaoFeiJiLuZhuangTai.WEI_JIAO_FEI) {
                    return <Button type="link" style={{ borderColor: "#1890FF" }} onClick={(e) => handleQueRenJiaoFenClick(record)}>????????????</Button>
                }
                if (record.jiaoFeiJiLuZhuangTai === JiaoFeiJiLuZhuangTai.BU_FEN_JIAO_FEI) {
                    return <Button type="link" style={{ borderColor: "#1890FF" }}>??????</Button>
                }
                if (record.jiaoFeiJiLuZhuangTai === JiaoFeiJiLuZhuangTai.QUAN_BU_YI_JIAO) {
                    return <span style={{ color: 'green' }}>?????????</span>
                }
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
            }}>
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
            {
                showQueRenJiaoFeiModal ?
                    <JiaoFenQueRenModal
                        visible={showQueRenJiaoFeiModal}
                        onClose={toggelShowQueRenJiaoFeiModal}
                        onJiaoFeiQueRen={handleJiaoFeiQueRen}
                    /> : ""
            }
        </div>
    )
}

export default observer(JiaoFenJiLu)
