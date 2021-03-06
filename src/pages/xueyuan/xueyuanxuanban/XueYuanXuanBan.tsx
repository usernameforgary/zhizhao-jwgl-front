import React, { useState, useEffect } from 'react'
import { Button, Card, TableColumnType, Space, Radio, RadioChangeEvent, message } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { Table, Row, Col } from 'antd'
import { BanJiView, NoPageSearchResult, XueYuanKeCheng, XueYuanKeChengZhuangTai } from '../../../customtypes';
import { huoQuXueYuanKeChengByXueYuanId } from '../../../services/xueyuankecheng';
import Loading from '../../../components/loading/Loading';

import './xueyuanxuanban.css';
import { huoQuBanJiLieBiaoByKeChengId } from '../../../services/banji';
import { xueYuanXuanZeBanJi } from '../../../services/combine';

type ParamsType = {
    id: string
}

class XueYuanXuanBanStore {
    constructor(xueYuanId: string) {
        this.xueYuanId = xueYuanId;
        makeObservable(this);
    }

    @observable
    xueYuanId: string = "";

    @observable
    currentSelectedXueYuanKeCheng: XueYuanKeCheng | undefined = undefined;

    @observable
    newSelectedBanJiId: string = "";

    @observable
    keChengId: string = "";

    @observable
    banJiList: BanJiView[] = [];

    @observable
    xueYuanKeChengList: XueYuanKeCheng[] = []

    @action
    setCurrentSelectedXueYuanKeCheng = (xueYuanKeCheng: XueYuanKeCheng) => {
        this.currentSelectedXueYuanKeCheng = xueYuanKeCheng;
    }

    @action
    setNewSelectedBanJiId = (banJiId: string) => {
        this.newSelectedBanJiId = banJiId;
    }

    @action
    setXueYuanKeCheng = (xueYuanKeChengList: XueYuanKeCheng[]) => {
        this.xueYuanKeChengList = xueYuanKeChengList;
    }

    @action
    setKeChengId = (keChengId: string) => {
        this.keChengId = keChengId;
    }

    @action
    getXuYuanKeChengList = async () => {
        try {
            const res: NoPageSearchResult<XueYuanKeCheng> = await huoQuXueYuanKeChengByXueYuanId(this.xueYuanId, false);
            runInAction(() => {
                this.setXueYuanKeCheng(res.list);
            });
        } catch (e) {
        }
    }

    @action
    getBanJiListByKeChengId = async () => {
        if (this.keChengId) {
            try {
                const res = await huoQuBanJiLieBiaoByKeChengId(this.keChengId);
                runInAction(() => {
                    this.banJiList = res.list;
                });
            } catch (e) { }
        }
    }
}

const XueYuanXuanBan = () => {
    const { id } = useParams<ParamsType>();
    const [viewStore] = useState<XueYuanXuanBanStore>(new XueYuanXuanBanStore(id));
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number>();

    const { xueYuanId, xueYuanKeChengList, getXuYuanKeChengList, newSelectedBanJiId, keChengId, banJiList, currentSelectedXueYuanKeCheng } = viewStore;

    useEffect(() => {
        let isMounted = true;

        const getXueYuanKeCheng = async () => {
            setLoading(true);
            await getXuYuanKeChengList();
            setLoading(false);
        }

        getXueYuanKeCheng();

        return () => { isMounted = false }
    }, [xueYuanId]);

    // ?????????????????????????????????????????????
    useEffect(() => {
        viewStore.getBanJiListByKeChengId();
    }, [keChengId])

    // ????????????????????????
    const onXueYuanKeChengSelected = (xueYuanKeCheng: XueYuanKeCheng, index: number) => {
        setSelectedRowIndex(index);
        viewStore.setKeChengId(xueYuanKeCheng.keChengId);
        viewStore.setCurrentSelectedXueYuanKeCheng(xueYuanKeCheng);
    }

    // ??????????????????
    const onBanJiSelected = (e: RadioChangeEvent) => {
        viewStore.setNewSelectedBanJiId(e.target.value);
    }

    // ????????????????????????
    const handleXuanZeBanJi = async () => {
        try {
            if (xueYuanId && currentSelectedXueYuanKeCheng?.id && newSelectedBanJiId) {
                await xueYuanXuanZeBanJi(xueYuanId, currentSelectedXueYuanKeCheng.id, newSelectedBanJiId);
                await getXuYuanKeChengList();
                message.success("????????????");
            }
        } catch (e) {
        }
    }

    const columns: TableColumnType<XueYuanKeCheng>[] = [
        {
            title: '??????',
            dataIndex: 'xueYuanXingMing',
            key: 'xueYuanXingMing',
            className: "no-background",
            render: (value, row, index) => {
                const rows: number = xueYuanKeChengList.length;
                if (index > 0) {
                    return {
                        children: <span>{value}</span>,
                        props: {
                            colSpan: 0
                        }
                    }
                }
                return {
                    children: <span>{value}</span>,
                    props: {
                        rowSpan: rows
                    }
                }
            }
        },
        {
            title: '??????????????????????????????',
            dataIndex: 'keChengMingCheng',
            key: 'keChengMingCheng',
            render: (value, record, index) => {
                const content = <span>{value} <span style={{ color: "#169BD5" }}>???{record.shengYuKeShi}???</span></span>;
                if (index > 0) {
                    return {
                        children: content,
                        props: {},
                    }
                } else {
                    return {
                        children: content,
                        props: {},
                    }
                }
            }
        },
        {
            title: '????????????',
            dataIndex: 'banJiMingCheng',
            key: 'banJiMingCheng',
            className: "cursor-pointer",
            render: (value, record, index) => {
                let noteNode: React.ReactNode = <span onClick={() => onXueYuanKeChengSelected(record, index)} style={{ color: "#169BD5" }}>????????????</span>;
                if (record.shengYuKeShi && record.shengYuKeShi <= 0) {
                    noteNode = <span style={{ color: "rgb(184, 184, 184)" }}>??????????????????</span>;
                }
                if (record.keChengZhuangTai === XueYuanKeChengZhuangTai.DAI_QUE_REN) {
                    noteNode = <span style={{ color: "rgb(184, 184, 184)" }}>?????????????????????</span>;
                }
                return (
                    <span >{value} {noteNode} </span>
                );
            },
        },
        {
            title: '????????????',
            dataIndex: 'banJiLaoShiXingMing',
            key: 'banJiLaoShiXingMing'
        }
    ];

    return (
        <div className={"content-background"}
            style={{
                padding: 24,
                margin: 0,
                minHeight: "85vh"
            }}>
            {loading ? <Loading /> : ""}
            <Row></Row>
            <Row></Row>
            <Row style={{ width: '100%' }}>
                <Col span={17}>
                    <Table
                        pagination={false}
                        dataSource={xueYuanKeChengList}
                        columns={columns}
                        bordered={true}
                        rowClassName={(record, index) => {
                            return index === selectedRowIndex ? 'table-row-highlight' : ''
                        }}
                    >
                    </Table>
                </Col>
                <Col span={6} offset={1}>
                    <Card
                        size="small" title="????????????"
                        extra={<Button onClick={handleXuanZeBanJi} size="small" type="primary">??????</Button>}
                    >
                        <Radio.Group
                            onChange={onBanJiSelected}
                            value={newSelectedBanJiId || (currentSelectedXueYuanKeCheng?.banJi && currentSelectedXueYuanKeCheng.banJi.id)}>
                            <Space direction="vertical">
                                {banJiList.map((v) => {
                                    return (
                                        <Radio key={v.id} value={v.id}>{v.mingCheng}</Radio>
                                    );
                                })}
                            </Space>
                        </Radio.Group>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default observer(XueYuanXuanBan);
