import React, { useEffect, useState } from 'react'
import { Modal, Form, Row, Col, Select, Input, Button, Radio, RadioChangeEvent } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { LaoShi, PaiKeFangShiFenLei, PaiKeChongFuFangShiFenLei, PaiKeJieShuFangShiFenLei, ShangKeJiaoShi } from '../../../../customtypes';
import { huoQuLaoShiAll } from '../../../../services/laoshi';
import { huoQuShangKeJiaoShiAll } from '../../../../services/common';
import { convertPaiKeFangShi2Enum, convertPaiKeFangShi2Text } from '../../../../utils/converter';
import { useForm } from 'antd/lib/form/Form';
import PaiKeFangShiGuiZe from './PaiKeFangShiGuiZe';
import PaiKeFangShiRiLi from './PaiKeFangShiRiLi';

const { Option } = Select;

type PaiKeModalProps = {
    banJiId: number | string,
    banJiMingCheng: string,
    keChengMingCheng: string,
    visible: boolean
    modalTitle?: string
    onCancel: () => void
    onFormSubmit?: () => void
}

const PaiKeModal: React.FC<PaiKeModalProps> = ({ banJiId, banJiMingCheng, keChengMingCheng, visible, modalTitle, onCancel, onFormSubmit }) => {
    const [form] = useForm();
    const [shangKeJiaoShiList, setShangKeJiaoShiList] = useState<ShangKeJiaoShi[]>([]);
    const [laoShiList, setLaoShiList] = useState<LaoShi[]>([]);
    const [paiKeFangshi, setPaiKeFangShi] = useState<PaiKeFangShiFenLei>(PaiKeFangShiFenLei.GUI_ZE_PAI_KE);
    const [guiZeChongFuFangShi, setGuiZeChongFuFangShi] = useState<PaiKeChongFuFangShiFenLei>(PaiKeChongFuFangShiFenLei.MEI_ZHOU);
    const [guiZeJieShuFangShi, setGuiZeJieShuFangShi] = useState<PaiKeJieShuFangShiFenLei>(PaiKeJieShuFangShiFenLei.RI_QI_JIE_SHU);


    // 获取老师列表
    useEffect(() => {
        let isMounted = true;
        huoQuLaoShiAll().then(data => {
            if (isMounted) setLaoShiList(data.list);
        }).catch(e => { })
        return () => { isMounted = false }
    }, []);

    // 获取上课教室列表
    useEffect(() => {
        let isMounted = true;
        huoQuShangKeJiaoShiAll().then(data => {
            if (isMounted) setShangKeJiaoShiList(data.list);
        }).catch(e => { })
        return () => { isMounted = false }
    }, []);

    // 窗口关闭
    const onClose = () => {
        if (onCancel) {
            onCancel();
        }
    }

    // 排课方式改变
    const onPaiKeFangShiChange = (e: RadioChangeEvent) => {
        const paiKeFangshiVal: string = e.target.value;
        const paiKeFangShiEnum: PaiKeFangShiFenLei = convertPaiKeFangShi2Enum(paiKeFangshiVal);
        setPaiKeFangShi(paiKeFangShiEnum);
    }

    // 排课重复方式改变
    const handlePaiKeChongFuFangShiChange = (newChongFuFangShi: PaiKeChongFuFangShiFenLei) => {
        setGuiZeChongFuFangShi(newChongFuFangShi);
    }

    // 排课结束方式改变
    const handlePaiKeJieShuFangShiChange = (newJieShuFangShi: PaiKeJieShuFangShiFenLei) => {
        setGuiZeJieShuFangShi(newJieShuFangShi);
    }

    // 表单提交
    const handleFormSubmit = (values: { [key: string]: any }) => {
        console.log(values);
        if (onFormSubmit) {
            onFormSubmit();
        }
    }

    // // 排课重复时间设置
    // const handleSetPaiKeChongFuShiJian = (values: PaiKeChongFuFangShi[]) => {
    //     form.setFieldsValue({})
    // }

    return (
        <>
            <Modal
                visible={visible}
                title={modalTitle ?? "新建排课"}
                onCancel={onClose}
                footer={false}
                closeIcon={<CloseCircleOutlined />}
                width={600}
            >
                <Form
                    onFinish={handleFormSubmit}
                    form={form}
                >
                    <Row>
                        <Col span={18}>
                            <Form.Item initialValue={keChengMingCheng} labelAlign="left" labelCol={{ span: 8 }} name="keChengMingCheng" label="课程">
                                <Input disabled={true} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={18}>
                            <Form.Item rules={[{ required: true, message: "此项默认值" }]} initialValue={banJiId} labelAlign="left" labelCol={{ span: 8 }} name="banJiId" label="班级">
                                <Select disabled={true}>
                                    <Option key={banJiId} value={banJiId}>{banJiMingCheng}</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={18}>
                            <Form.Item
                                labelAlign="left" labelCol={{ span: 8 }} label="排课方式"
                                name="paiKeFangShi"
                                initialValue={PaiKeFangShiFenLei.GUI_ZE_PAI_KE}
                                rules={[{ required: true, message: "请指定排课方式" }]}
                            >
                                <Radio.Group onChange={onPaiKeFangShiChange}>
                                    <Radio value={PaiKeFangShiFenLei.GUI_ZE_PAI_KE}>{convertPaiKeFangShi2Text(PaiKeFangShiFenLei.GUI_ZE_PAI_KE)}</Radio>
                                    <Radio value={PaiKeFangShiFenLei.RI_LI_PAI_KE}>{convertPaiKeFangShi2Text(PaiKeFangShiFenLei.RI_LI_PAI_KE)}</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    {
                        (paiKeFangshi && paiKeFangshi === PaiKeFangShiFenLei.GUI_ZE_PAI_KE) ?
                            (
                                <PaiKeFangShiGuiZe
                                    guiZeChongFuFangShi={guiZeChongFuFangShi}
                                    handleGuiZeChongFuFangShiChange={handlePaiKeChongFuFangShiChange}
                                    guiZeJieShuFangShi={guiZeJieShuFangShi}
                                    handleGuiZeJieShuFangshiChange={handlePaiKeJieShuFangShiChange}
                                    parentForm={form}
                                />
                            )
                            :
                            (
                                <PaiKeFangShiRiLi parentForm={form} />
                            )
                    }

                    <Row>
                        <Col span={18}>
                            <Form.Item initialValue={1} labelAlign="left" labelCol={{ span: 8 }} name="rongLiang" label="班级容量">
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={18}>
                            <Form.Item labelAlign="left" labelCol={{ span: 8 }} name="shangKeLaoShi" label="上课老师">
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
                            </Row>
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
                        <Col span={18}>
                            <Form.Item labelAlign="left" labelCol={{ span: 8 }} name="shangKeNeiRong" label="上课内容">
                                <Input.TextArea maxLength={100} showCount={true}></Input.TextArea>
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
                                        生成排课
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Row>
                </Form>
            </Modal >
        </>
    )
}

export default PaiKeModal
