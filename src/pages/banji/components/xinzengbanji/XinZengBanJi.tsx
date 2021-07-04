import { Modal, Form, Row, Col, Input, Button, Select } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { BanJiFenLei, KeCheng, LaoShi, ShangKeJiaoShi } from '../../../../customtypes';
import { huoQuBanJiFenLeiAll, huoQuShangKeJiaoShiAll } from '../../../../services/common';
import { huoQuKeChengAll } from '../../../../services/kecheng';
import { huoQuLaoShiAll } from '../../../../services/laoshi';
import BanJiFenLeiModal from '../banjifenlei/BanJiFenLeiModal';

const { Option } = Select;

export type XinZengBanJiProps = {
    visible: boolean
    modalTitle?: string
    onFormFinish: () => void | Promise<void>
    onClose: () => void
}

const XinZengBanJi: React.FC<XinZengBanJiProps> = ({ visible, modalTitle, onFormFinish, onClose }) => {
    const [showShanKeJiaoshi, setShowShanKeJiaoShi] = useState<boolean>(false);
    const [showBanJiFenLei, setShowBanJiFenLei] = useState<boolean>(false);
    const [keChengList, setKeChengList] = useState<KeCheng[]>([]);
    const [refreshKeCheng, setRefreshKeCheng] = useState<boolean>(false);
    const [shangKeJiaoShiList, setShangKeJiaoShiList] = useState<ShangKeJiaoShi[]>([]);
    const [refreshShangKeJiaoShi, setRefreshShangKeJiaoShi] = useState<boolean>(false);
    const [laoShiList, setLaoShiList] = useState<LaoShi[]>([]);
    const [refreshLaoshi, setRefreshLaoShi] = useState<boolean>(false);
    const [banJiFenLeiList, setBanJiFenLeiList] = useState<BanJiFenLei[]>([]);
    const [refreshBanJiFenLei, setRefreshBanJiFenLei] = useState<boolean>(false);

    useEffect(() => {
        onHuoQuKeChengLieBiao();
    }, [refreshKeCheng]);

    useEffect(() => {
        onHuoQuShanKeJiaoShiLieBiao();
    }, [refreshShangKeJiaoShi]);

    useEffect(() => {
        onHuoQuLaoShiLieBiao();
    }, [refreshLaoshi]);

    useEffect(() => {
        onHuoQuBanJiFenLeiLieBiao();
    }, [refreshBanJiFenLei]);

    // 刷新课程
    const onKeChengRefresh = () => {
        setRefreshKeCheng(!refreshKeCheng);
    }

    // 刷新班级分类
    const onBanJiFenLeiRefresh = () => {
        setRefreshBanJiFenLei(!refreshBanJiFenLei)
    }

    // 获取课程列表
    const onHuoQuKeChengLieBiao = async () => {
        try {
            const result = await huoQuKeChengAll();
            setKeChengList(result.list);
        } catch (e) { }
    }

    // 获取上课教室列表
    const onHuoQuShanKeJiaoShiLieBiao = async () => {
        try {
            const result = await huoQuShangKeJiaoShiAll();
            setShangKeJiaoShiList(result.list);
        } catch (e) { }
    }

    // 获取老师列表
    const onHuoQuLaoShiLieBiao = async () => {
        try {
            const result = await huoQuLaoShiAll();
            setLaoShiList(result.list);
        } catch (e) { }
    }

    // 获取班级分类列表
    const onHuoQuBanJiFenLeiLieBiao = async () => {
        try {
            const result = await huoQuBanJiFenLeiAll();
            setBanJiFenLeiList(result.list)
        } catch (e) { }
    }

    const toggleShowShangKeJiaoShi = () => {
        setShowShanKeJiaoShi(!toggleShowShangKeJiaoShi);
    }

    const toggleShowBanJiFenLei = () => {
        setShowBanJiFenLei(!showBanJiFenLei);
    }

    const onFormSubmit = (values: any) => {
        console.log(values);
    }

    return (
        <>
            <Modal
                visible={visible}
                title={modalTitle ?? "新增班级"}
                onCancel={onClose}
                footer={false}
            >
                <Form
                    onFinish={onFormSubmit}
                >
                    <Row>
                        <Col span={18}>
                            <Form.Item labelAlign="left" labelCol={{ span: 8 }} name="keChengId" label="所属课程" rules={[{ required: true, message: "请选择所属课程" }]}>
                                <Select>
                                    {keChengList?.map(k => {
                                        return (
                                            <Option key={k.id} value={k.id || ""}>{k.mingCheng}</Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={18}>
                            <Form.Item labelAlign="left" labelCol={{ span: 8 }} name="mingCheng" label="班级名称" rules={[{ required: true, message: "请输入班级名称" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={18}>
                            <Form.Item labelAlign="left" labelCol={{ span: 8 }} name="rongLiang" label="班级容量">
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col span={18}>
                                    <Form.Item labelAlign="left" labelCol={{ span: 8 }} name="shangKeJiaoShiId" label="上课教室">
                                        <Select>
                                            {shangKeJiaoShiList?.map(k => {
                                                return (
                                                    <Option key={k.id} value={k.id || ""}>{k.mingCheng}</Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Button type="link" onClick={toggleShowShangKeJiaoShi}>设置</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={18}>
                            <Form.Item labelAlign="left" labelCol={{ span: 8 }} name="banJiLaoShiId" label="班级老师">
                                <Select>
                                    {laoShiList?.map(k => {
                                        return (
                                            <Option key={k.id} value={k.id || ""}>{k.xingMing}</Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={18}>
                            <Form.Item initialValue={1} labelAlign="left" labelCol={{ span: 8 }} name="shouKeKeShi" label="默认授课课时">
                                <Input type="number" min={0} step={0.5} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col span={18}>
                                    <Form.Item labelAlign="left" labelCol={{ span: 8 }} name="banJiFenLeiId" label="班级分类">
                                        <Select>
                                            {banJiFenLeiList?.map(k => {
                                                return (
                                                    <Option key={k.id} value={k.id || ""}>{k.mingCheng}</Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Button onClick={toggleShowBanJiFenLei} type="link">设置</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={18}>
                            <Form.Item labelAlign="left" labelCol={{ span: 8 }} name="beiZhu" label="备注">
                                <Input.TextArea></Input.TextArea>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end">
                        <Form.Item>
                            <Row gutter={10}>
                                <Col>
                                    <Button onClick={onClose}>
                                        取消
                                    </Button>
                                </Col>
                                <Col>
                                    <Button type="primary" htmlType="submit">
                                        保存
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Row>
                </Form>
            </Modal >
            {showBanJiFenLei ? <BanJiFenLeiModal refresh={onBanJiFenLeiRefresh} list={banJiFenLeiList} modalTitle="班级分类" visible={showBanJiFenLei} onClose={toggleShowBanJiFenLei} /> : ""}
        </>
    )
}

export default XinZengBanJi
