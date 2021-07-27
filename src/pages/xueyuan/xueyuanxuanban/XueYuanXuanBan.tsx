import React, { useState, useEffect } from 'react'
import { Button, Card, TableColumnType, Space, Radio, RadioChangeEvent } from 'antd';
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
            const res: NoPageSearchResult<XueYuanKeCheng> = await huoQuXueYuanKeChengByXueYuanId(this.xueYuanId);
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

    // 获取当前选中课程对应的所有班级
    useEffect(() => {
        viewStore.getBanJiListByKeChengId();
    }, [keChengId])

    // 选中学员课程事件
    const onXueYuanKeChengSelected = (xueYuanKeCheng: XueYuanKeCheng, index: number) => {
        setSelectedRowIndex(index);
        viewStore.setKeChengId(xueYuanKeCheng.keChengId);
        viewStore.setCurrentSelectedXueYuanKeCheng(xueYuanKeCheng);
    }

    // 班级选中事件
    const onBanJiSelected = (e: RadioChangeEvent) => {
        viewStore.setNewSelectedBanJiId(e.target.value);
    }

    // 选择班级保存事件
    const handleXuanZeBanJi = async () => {
        if (xueYuanId !== currentSelectedXueYuanKeCheng?.banJi?.id) {
            console.log("xue yuan id: ", xueYuanId)
            console.log("newSelectedBanJiId: ", newSelectedBanJiId)
            console.log("xue yuan ke cheng id: ", currentSelectedXueYuanKeCheng?.id)
            try {
                if (xueYuanId && currentSelectedXueYuanKeCheng?.id && newSelectedBanJiId) {
                    await xueYuanXuanZeBanJi(xueYuanId, currentSelectedXueYuanKeCheng.id, newSelectedBanJiId, currentSelectedXueYuanKeCheng.banJi?.id || "");
                }
            } catch (e) {

            }
            await getXuYuanKeChengList();
        }
    }

    const columns: TableColumnType<XueYuanKeCheng>[] = [
        {
            title: '学员',
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
            title: '课程名称（剩余课时）',
            dataIndex: 'keChengMingCheng',
            key: 'keChengMingCheng',
            render: (value, record, index) => {
                const content = <span>{value} <span style={{ color: "#169BD5" }}>（{record.shengYuKeShi}）</span></span>;
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
            title: '班级名称',
            dataIndex: 'banJiMingCheng',
            key: 'banJiMingCheng',
            className: "cursor-pointer",
            render: (value, record, index) => {
                let noteNode: React.ReactNode = <span onClick={() => onXueYuanKeChengSelected(record, index)} style={{ color: "#169BD5" }}>点我选班</span>;
                if (record.shengYuKeShi && record.shengYuKeShi <= 0) {
                    noteNode = <span style={{ color: "rgb(184, 184, 184)" }}>剩余课时不足</span>;
                }
                if (record.keChengZhuangTai === XueYuanKeChengZhuangTai.DAI_QUE_REN) {
                    noteNode = <span style={{ color: "rgb(184, 184, 184)" }}>报名课程待确认</span>;
                }
                return (
                    <span >{value} {noteNode} </span>
                );
            },
        },
        {
            title: '班级老师',
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
                        size="small" title="班级列表"
                        extra={<Button onClick={handleXuanZeBanJi} size="small" type="primary">保存</Button>}
                    >
                        <Radio.Group
                            onChange={onBanJiSelected}
                            value={currentSelectedXueYuanKeCheng?.banJi && currentSelectedXueYuanKeCheng.banJi.id || newSelectedBanJiId}>
                            <Space direction="vertical">
                                {banJiList.map((v) => {
                                    console.log(currentSelectedXueYuanKeCheng)
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
