import { Modal, Form, Row, Col, Input, Button, Select } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { BanJi, BanJiFenLei, KeCheng, LaoShi, ShangKeJiaoShi } from '../../../../customtypes';
import { chuangJianBanJiFenLei, chuangJianShangKeJiaoShi, gengXinBanJiFenLei, gengXinShangKeJiaoShi, huoQuBanJiFenLeiAll, huoQuShangKeJiaoShiAll } from '../../../../services/common';
import { huoQuKeChengAll } from '../../../../services/kecheng';
import { huoQuLaoShiAll } from '../../../../services/laoshi';
import CommonInfoModal from '../CommonInfoModal';

const { Option } = Select;

export type XinZengBanJiProps = {
    visible: boolean
    modalTitle?: string
    onFormFinish: (item: BanJi) => Promise<number | undefined>
    onClose: () => void
}

const XinZengBanJi: React.FC<XinZengBanJiProps> = ({ visible, modalTitle, onFormFinish, onClose }) => {
    const [showShanKeJiaoshi, setShowShanKeJiaoShi] = useState<boolean>(false);
    const [showBanJiFenLei, setShowBanJiFenLei] = useState<boolean>(false);
    const [keChengList, setKeChengList] = useState<KeCheng[]>([]);
    const [refreshKeCheng] = useState<boolean>(false);
    const [shangKeJiaoShiList, setShangKeJiaoShiList] = useState<ShangKeJiaoShi[]>([]);
    const [refreshShangKeJiaoShi, setRefreshShangKeJiaoShi] = useState<boolean>(false);
    const [laoShiList, setLaoShiList] = useState<LaoShi[]>([]);
    const [refreshLaoshi] = useState<boolean>(false);
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

    // // 刷新课程
    // const onKeChengRefresh = () => {
    //     setRefreshKeCheng(!refreshKeCheng);
    // }

    // 刷新班级分类
    const onBanJiFenLeiRefresh = () => {
        setRefreshBanJiFenLei(!refreshBanJiFenLei)
    }

    // 刷新上课教室
    const onShangKeJiaoShiRefresh = () => {
        setRefreshShangKeJiaoShi(!refreshShangKeJiaoShi);
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

    /**
     * 创建上课教室
     * @param mingCheng 上课教室名称
     * @returns 
     */
    const onChuangJianShangKeJiaoShi = async (mingCheng: string): Promise<number | undefined> => {
        let id = undefined;
        try {
            id = await chuangJianShangKeJiaoShi(mingCheng);
            onShangKeJiaoShiRefresh();
        } catch (e) { }
        return id;
    }

    /**
     * 更新上课教室
     * @param item 
     */
    const onUpdateShangKeJiaoShi = async (item: ShangKeJiaoShi): Promise<void> => {
        try {
            await gengXinShangKeJiaoShi(item);
            onShangKeJiaoShiRefresh();
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

    /**
     * 创建班级分类
     * @param mingCheng 班级分类名称
     * @returns 
     */
    const onChuangJianBanJiFenLei = async (mingCheng: string): Promise<number | undefined> => {
        let id = undefined;
        try {
            id = await chuangJianBanJiFenLei(mingCheng);
            onBanJiFenLeiRefresh();
        } catch (e) { }
        return id;
    }

    /**
     * 更新班级分类
     * @param item 
     */
    const onUpdateBanJiFenLei = async (item: BanJiFenLei): Promise<void> => {
        try {
            await gengXinBanJiFenLei(item);
            onBanJiFenLeiRefresh();
        } catch (e) { }
    }

    const toggleShowShangKeJiaoShi = () => {
        setShowShanKeJiaoShi(!showShanKeJiaoshi);
    }

    const toggleShowBanJiFenLei = () => {
        setShowBanJiFenLei(!showBanJiFenLei);
    }

    // 新增班级
    const onFormSubmit = (values: BanJi) => {
        onFormFinish(values);
        onClose();
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
                            <Form.Item labelAlign="left" labelCol={{ span: 8 }} name="keChengId" label="所属课程"
                                rules={[{ required: true, message: "请选择所属课程" }]}
                            >
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
                            <Form.Item initialValue={1} labelAlign="left" labelCol={{ span: 8 }} name="rongLiang" label="班级容量">
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col span={18}>
                                    <Form.Item
                                        labelAlign="left"
                                        labelCol={{ span: 8 }}
                                        name="shangKeJiaoShiId"
                                        label="上课教室"
                                        rules={[{ required: true, message: "请选择上课教室" }]}
                                    >
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
                            <Form.Item
                                labelAlign="left" labelCol={{ span: 8 }} name="banJiLaoShiId" label="班级老师"
                                rules={[{ required: true, message: "请选择班级老师" }]}
                            >
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
                                    <Form.Item labelAlign="left" labelCol={{ span: 8 }}
                                        name="banJiFenLeiId" label="班级分类"
                                        rules={[{ required: true, message: "请选择班级分类" }]}
                                    >
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
            {
                showBanJiFenLei ?
                    <CommonInfoModal<BanJiFenLei>
                        onNew={onChuangJianBanJiFenLei}
                        list={banJiFenLeiList}
                        modalTitle="班级分类"
                        visible={showBanJiFenLei}
                        onClose={toggleShowBanJiFenLei}
                        onUpdate={onUpdateBanJiFenLei}
                    /> : ""
            }
            {
                showShanKeJiaoshi ?
                    <CommonInfoModal<ShangKeJiaoShi>
                        onNew={onChuangJianShangKeJiaoShi}
                        list={shangKeJiaoShiList}
                        modalTitle="上课教室"
                        visible={showShanKeJiaoshi}
                        onClose={toggleShowShangKeJiaoShi}
                        onUpdate={onUpdateShangKeJiaoShi}
                    />
                    : ""
            }
        </>
    )
}

export default XinZengBanJi
