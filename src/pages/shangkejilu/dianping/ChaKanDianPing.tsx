import { action, makeObservable, observable, runInAction } from 'mobx'
import { Row, Col, Form, Input, Upload, Image, Modal, Space } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChengZhangJiLu, PaiKeJiLu } from '../../../customtypes';
import { huoQuPaiKeJiLuKeHouDianPingById } from '../../../services/pakejilu';
import MyAvatar from '../../../components/customicons/avatar/MyAvatar';
import DaoKeZhuangTaiSpan from '../../../components/daokezhuangtai/DaoKeZhuangTaiSpan';


type ParamsType = {
    paiKeJiLuId: string
}

class ChaKanDianPingStore {
    constructor(paiKeJiLuId: string) {
        this.paiKeJiLuId = paiKeJiLuId;
        makeObservable(this);
    }

    @observable
    paiKeJiLuId: string | undefined = undefined;

    @observable
    paiKeJiLu: PaiKeJiLu | undefined = undefined;

    @action
    setPaiKeJiLu(newPaiKeJiLu: PaiKeJiLu) {
        this.paiKeJiLu = newPaiKeJiLu;
    }

    @action
    async search() {
        if (this.paiKeJiLuId) {
            try {
                const result = await huoQuPaiKeJiLuKeHouDianPingById(this.paiKeJiLuId);
                runInAction(() => {
                    this.paiKeJiLu = result;
                })
            } catch (e) { }
        }
    }
}

const ChaKanDianPing = () => {
    const { paiKeJiLuId } = useParams<ParamsType>();
    const [viewStore] = useState<ChaKanDianPingStore>(new ChaKanDianPingStore(paiKeJiLuId));

    // 图片预览
    const [previewVisible, SetPreviewVisible] = useState<boolean>(false);
    const [previewImage, SetPreviewImage] = useState<string>();
    const [previewTitle, setPreViewTitle] = useState<string>();

    const { paiKeJiLu } = viewStore;

    useEffect(() => {
        const search = async () => {
            await viewStore.search()
        }
        search()
    }, [])

    return (
        <div
            className={"content-background"}
            style={{
                padding: 24,
                margin: 0,
                minHeight: "85vh"
            }}
        >
            <Row style={{ marginBottom: '2rem' }}>
                <Row style={{ width: '100%' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>上课信息</span>
                </Row>
                <Row style={{ width: '100%' }}>
                    <Col span={6}>
                        <span>上课日期：</span>
                        <span>{paiKeJiLu ? moment(Number(paiKeJiLu.shangKeRiQi)).format('yyyy-MM-DD') : '--'}</span>
                    </Col>
                    <Col span={6}>
                        <span>上课时段：</span>
                        <span>{paiKeJiLu ? moment(Number(paiKeJiLu.shangKeShiJianStart)).format('hh:mm') : '--'}</span>
                        &nbsp;-&nbsp;
                        <span>{paiKeJiLu ? moment(Number(paiKeJiLu.shangKeShiJianEnd)).format('hh:mm') : '--'}</span>
                    </Col>
                    <Col span={6}>
                        <span>上课老师：</span>
                        <span>{paiKeJiLu?.shangKeLaoShiXingMing}</span>
                    </Col>
                    <Col span={6}>
                        <span>上课内容：</span>
                        <span>{paiKeJiLu?.shangKeNeiRong}</span>
                    </Col>
                </Row>
            </Row>
            <Row>
                <Row style={{ width: '100%' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>课堂点评</span>
                </Row>

                {paiKeJiLu?.shangKeXueYuanZu.map((v, index) => {
                    const chengZhangJiLu: ChengZhangJiLu | undefined = paiKeJiLu.chengZhangJiLuZu.find(c => c.xueYuanId === v.xueYuanId);

                    return (
                        <Row key={v.xueYuanId} style={{ width: '100%' }}>
                            <Row style={{ width: '100%', marginBottom: '1rem' }} align="middle">
                                <Col offset={1} span={2}>
                                    <Space direction="vertical">
                                        <Row justify="center">
                                            <MyAvatar />
                                        </Row>
                                        <Row justify="center">
                                            <DaoKeZhuangTaiSpan daoKeZhuangTai={v.xueYuanDaoKeZhuangTai} />
                                        </Row>
                                    </Space>

                                </Col>
                                <Col>
                                    <span style={{ fontSize: '1rem', fontWeight: "bold" }}>{v.xueYuanXingMing}</span>
                                </Col>
                            </Row>
                            <Row style={{ width: '100%' }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Col offset={3} span={12}>
                                        <span style={{ fontWeight: 'bold' }}>老师评语：</span>
                                    </Col>
                                    <Col offset={4} span={20}>
                                        <span>{chengZhangJiLu?.neiRong || "--"}</span>
                                    </Col>
                                </Space>
                            </Row>
                            <Row style={{ width: '100%', marginTop: '10px' }}>
                                <Col offset={4}>
                                    <Space>
                                        {(chengZhangJiLu && chengZhangJiLu.chengZhangJiLuWenJianZu) ? chengZhangJiLu.chengZhangJiLuWenJianZu.map(v => {
                                            return (
                                                <Col key={v.id} >
                                                    <div style={{ border: "1px solid rgba(0,0,0,0.15)", padding: '5px', borderRadius: '4px', height: '64px', width: '64px' }}>
                                                        <Image
                                                            width={50}
                                                            height={50}
                                                            src={`${v.url}/${v.ossKey}`}
                                                        />
                                                    </div>
                                                </Col>
                                            );
                                        }) : ""}
                                    </Space>
                                </Col>
                            </Row>

                            <Row style={{ width: '100%' }}>
                                <Col offset={3} span={12}>
                                    <Modal
                                        visible={previewVisible}
                                        title={previewTitle}
                                        footer={null}
                                    //onCancel={handleCancelPreview}
                                    >
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </Col>
                            </Row>
                        </Row>
                    )
                })}
            </Row>
        </div>
    )
}

export default observer(ChaKanDianPing);
