import React, { useEffect, useState } from 'react'
import { Modal, Form, Row, Col, Select, Input, Button, Radio, RadioChangeEvent } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import {
    LaoShi,
    PaiKeFangShiFenLei,
    PaiKeChongFuFangShiFenLei,
    PaiKeJieShuFangShiFenLei,
    ShangKeJiaoShi,
    BanJiView,
    PaiKeGuiZe, PaiKeShangKeShiJian, PaiKeShangKeTian, PaiKeXinXi
} from '../../../../customtypes';
import { huoQuLaoShiAll } from '../../../../services/laoshi';
import { huoQuShangKeJiaoShiAll } from '../../../../services/common';
import {
    convertPaiKeChongFuFangShi2Enum,
    convertPaiKeFangShi2Enum,
    convertPaiKeFangShi2Text,
    convertPaiKeJieShuShi2Enum,
    convertPaiKeShangKeTian2Enum
} from '../../../../utils/converter';
import { useForm } from 'antd/lib/form/Form';
import PaiKeFangShiGuiZe from './PaiKeFangShiGuiZe';
import PaiKeFangShiRiLi from './PaiKeFangShiRiLi';
import moment, { Moment } from 'moment';
import { PaiKeChongFuShiJian } from './PaiKeZhouChongFu';
import { chuangJianBanJiPaiKeXinXi } from '../../../../services/banji';

const { Option } = Select;

type PaiKeModalProps = {
    banJiXiangQing?: BanJiView
    visible: boolean
    modalTitle?: string
    onCancel: () => void
    onFormSubmit?: () => void
    refreshList?: () => void
}

// 排课规则form表单提交数据
export type PaiKeGuiZeFormValue = {
    keChengMingCheng: string,
    banJiId: number,
    paiKeFangShi: string,
    guiZeKaiShiRiQi?: Moment,
    guiZeChongFuFangShi?: string,
    guiZeChongFuMeiZhou?: PaiKeChongFuShiJian[],
    guiZeJieShuFangShi?: string,
    guiZeJieShuRiQi?: Moment,
    guiZeChongFuMeiTian?: PaiKeChongFuShiJian,
    riLiShangKeRiQi?: number[],
    riLiPaiKeShiJian: PaiKeChongFuShiJian,
    guiZeJieShuCiShu?: number
    shangKeLaoShi?: number,
    shangKeJiaoShiId?: number,
    shangKeNeiRong?: string
}

const PaiKeModal: React.FC<PaiKeModalProps> = ({ banJiXiangQing, visible, modalTitle, onCancel, onFormSubmit, refreshList }) => {
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

    // 创建班级排课信息
    const onChuangJianBanJiPaiKeXinXi = async (paiKeXinXi: PaiKeXinXi) => {
        try {
            await chuangJianBanJiPaiKeXinXi(paiKeXinXi);
            onCancel();
            if (refreshList) {
                refreshList();
            }
        } catch (e) { }

        if (onFormSubmit) {
            onFormSubmit();
        }
    }

    // 表单提交
    const handleFormSubmit = (value: PaiKeGuiZeFormValue) => {
        // 排课规则
        let paiKeGuiZe: PaiKeGuiZe = {
            paiKeFangShi: convertPaiKeFangShi2Enum(value.paiKeFangShi),
        }
        // 规则排课 - 开始日期
        if (value.guiZeKaiShiRiQi) {
            paiKeGuiZe.guiZeKaiShiRiQi = value.guiZeKaiShiRiQi.valueOf();
        }
        // 规则排课 - 结束日期
        if (value.guiZeJieShuRiQi) {
            paiKeGuiZe.guiZeJieShuRiQi = value.guiZeJieShuRiQi.valueOf();
        }
        // 规则排课【重复方式】
        if (value.guiZeChongFuFangShi) {
            paiKeGuiZe.guiZeChongFuFangShi = convertPaiKeChongFuFangShi2Enum(value.guiZeChongFuFangShi || "");
        }
        // 规则排课【结束方式】
        if (value.guiZeJieShuFangShi) {
            paiKeGuiZe.guiZeJiShuFangShi = convertPaiKeJieShuShi2Enum(value.guiZeJieShuFangShi);
        }
        // 规则排课【排课次数】
        if (value.guiZeJieShuCiShu) {
            paiKeGuiZe.guiZePaiKeCiShu = value.guiZeJieShuCiShu;
        }
        // 日历排课【上课日期】组
        if (value.riLiShangKeRiQi) {
            paiKeGuiZe.riLiShangKeRiQi = value.riLiShangKeRiQi;
        }

        // 排课上课时间组;【日历排课】，或者【规则排课】且【每天重复】时，只有一组数据
        paiKeGuiZe.paiKeShangKeShiJianZu = [];
        if (value.paiKeFangShi === PaiKeFangShiFenLei.GUI_ZE_PAI_KE) {
            if (value.guiZeChongFuFangShi === PaiKeChongFuFangShiFenLei.MEI_TIAN) {
                if (value.guiZeChongFuMeiTian) {
                    const paiKeShangKeShiJian: PaiKeShangKeShiJian = {
                        paiKeShangKeTian: PaiKeShangKeTian.DAILY,
                        startTime: value.guiZeChongFuMeiTian.startTime?.valueOf(),
                        stopTime: value.guiZeChongFuMeiTian.stopTime?.valueOf(),
                    }
                    paiKeGuiZe.paiKeShangKeShiJianZu.push(paiKeShangKeShiJian);
                }
            } else if (value.guiZeChongFuFangShi === PaiKeChongFuFangShiFenLei.MEI_ZHOU) {
                if (value.guiZeChongFuMeiZhou) {
                    value.guiZeChongFuMeiZhou.forEach(v => {
                        const paiKeShangKeShiJian: PaiKeShangKeShiJian = {
                            paiKeShangKeTian: convertPaiKeShangKeTian2Enum(v.day || ""),
                            startTime: moment(v.startTime).valueOf(),
                            stopTime: moment(v.stopTime).valueOf(),
                        };
                        paiKeGuiZe.paiKeShangKeShiJianZu?.push(paiKeShangKeShiJian);
                    })
                }
            } else {
                // do nothing
            }
        } else if (value.paiKeFangShi === PaiKeFangShiFenLei.RI_LI_PAI_KE) {
            if (value.riLiPaiKeShiJian) {
                const paiKeShangKeShiJian: PaiKeShangKeShiJian = {
                    paiKeShangKeTian: PaiKeShangKeTian.DAILY,
                    startTime: value.riLiPaiKeShiJian.startTime?.valueOf(),
                    stopTime: value.riLiPaiKeShiJian.stopTime?.valueOf(),
                }
                paiKeGuiZe.paiKeShangKeShiJianZu.push(paiKeShangKeShiJian);
            }
        }

        // 排课信息
        const paiKeXinXi: PaiKeXinXi = {
            id: undefined,
            banJiId: value.banJiId,
            paiKeGuiZe: paiKeGuiZe,
            shangKeJiaoShiId: value.shangKeJiaoShiId,
            shangKeLaoShiId: value.shangKeLaoShi,
            shangKeNeiRong: value.shangKeNeiRong
        }

        // 创建班级排课信息
        onChuangJianBanJiPaiKeXinXi(paiKeXinXi);
    }

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
                            <Form.Item initialValue={banJiXiangQing?.keChengMingCheng} labelAlign="left" labelCol={{ span: 8 }} name="keChengMingCheng" label="课程">
                                <Input disabled={true} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={18}>
                            <Form.Item rules={[{ required: true, message: "此项默认值" }]} initialValue={banJiXiangQing?.id} labelAlign="left" labelCol={{ span: 8 }} name="banJiId" label="班级">
                                <Select disabled={true}>
                                    <Option key={banJiXiangQing?.id} value={banJiXiangQing?.id || ""}>{banJiXiangQing?.mingCheng}</Option>
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
                            <Form.Item initialValue={banJiXiangQing?.banJiLaoShiId} labelAlign="left" labelCol={{ span: 8 }} name="shangKeLaoShi" label="上课老师">
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
                                    <Form.Item initialValue={banJiXiangQing?.shangKeJiaoShiId} labelAlign="left" labelCol={{ span: 8 }} name="shangKeJiaoShiId" label="上课教室">
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
