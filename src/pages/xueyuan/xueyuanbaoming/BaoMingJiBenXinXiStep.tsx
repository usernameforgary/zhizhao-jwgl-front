import { Form, Row, Col, Input, Button, Radio, Upload, Avatar, Space } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import { SearchableSelectOptionDataType, XingBie, XueYuanXinXi, XueYuanZhuangTai } from '../../../customtypes';
import { convertXingBie2Text, convertXueYuanZhuangTai2Text } from '../../../utils/converter';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import { chuangJianXueYuan, huoQuXueYuanAll, huoQuXueYuanByXingMingAndShouJi } from '../../../services/xueyuan';
import SearchableSelect from '../../../components/searchableselect/SearchableSelect';

const { TextArea } = Input;

type BaoMingJiBenXinXiStepProps = {
    onNextStep: () => void
    xueYuanXinXi: XueYuanXinXi | undefined
    setNewXueYuanXinXi: (newXueYuanXinXi: XueYuanXinXi) => void
    changeXueYuanById: (xueYuanId: string) => void
}

const BaoMingJiBenXinXiStep: React.FC<BaoMingJiBenXinXiStepProps> = ({ xueYuanXinXi, changeXueYuanById, setNewXueYuanXinXi, onNextStep }) => {
    const [form] = useForm();
    const [xueYuanOptions, setXueYuanOptions] = useState<SearchableSelectOptionDataType[]>([]);

    useEffect(() => {
        let isMounted = true;
        // 获取所有学员
        const onHuoQuXueYuanAll = async () => {
            try {
                const res: XueYuanXinXi[] = await huoQuXueYuanAll();
                let xueYuanRecordOption: SearchableSelectOptionDataType[] = [];
                res.forEach(v => {
                    xueYuanRecordOption.push({
                        value: v.id || "",
                        label: v.xingMing || "",
                        showValue: `${v.xingMing} 
                            ${v.xueYuanZhuangTai && convertXueYuanZhuangTai2Text(v.xueYuanZhuangTai)}
                            ${v.zhangHaoShouJi}`
                    })
                })
                if (isMounted) {
                    setXueYuanOptions(xueYuanRecordOption);
                }
            } catch (e) { }
        }

        onHuoQuXueYuanAll();

        return () => { isMounted = false }
    }, [])

    // props.xueYuanXinXi改变时，重置from表单
    useEffect(() => {
        form.resetFields();
    }, [xueYuanXinXi]);

    /**
     * Form表单提交，或者点击下一步
     * @param formValue 表单数据
     */
    const handleFormFinish = (formValue: any) => {
        console.log(formValue)
    }

    /**
     * 保存为潜在学员点击事件
     */
    const handleBaoCunQianZaiXueYuan = async () => {
        try {
            const res: XueYuanXinXi = await form.validateFields();
            const searchRes: XueYuanXinXi = await huoQuXueYuanByXingMingAndShouJi(res.xingMing || "", res.zhangHaoShouJi || "");

            if (!!searchRes) {
                // TODO 需要加弹出框进行确认
                alert("存在重复记录")
            } else {
                res.xueYuanZhuangTai = XueYuanZhuangTai.QIAN_ZAI;
                const id: string = await chuangJianXueYuan(res);
                changeXueYuanById(id);
            }
        } catch (e) { }
    }

    /**
     * 下一步按钮点击
     */
    const handleToNextStep = async () => {
        try {
            const res: XueYuanXinXi = await form.validateFields();
            // 学员信息不为空，代表当前所选的是系统中已经存在的学员
            if (!(xueYuanXinXi && xueYuanXinXi.id)) {
                const searchRes: XueYuanXinXi = await huoQuXueYuanByXingMingAndShouJi(res.xingMing || "", res.zhangHaoShouJi || "");
                if (!!searchRes) {
                    // TODO 需要加弹出框进行确认
                    alert("存在重复记录");
                    return;
                } else {
                    setNewXueYuanXinXi(res);
                }
            }
            onNextStep();
        } catch (e) { }
    }

    // 学生姓名可输入选择框改变
    const onXueYuanXinMingChanged = (value: string) => {
        let foundKey = false;
        xueYuanOptions.forEach(v => {
            if (value === v.value) {
                foundKey = true;
                return;
            }
        })
        if (!foundKey) {
            const newXueYuan: XueYuanXinXi = { id: undefined, xingMing: value };
            setNewXueYuanXinXi(newXueYuan);
        } else {
            changeXueYuanById(value);
        }
    }

    return (
        <>
            <Form
                onFinish={handleFormFinish}
                form={form}
            >
                <Row justify="center">
                    <Col span={10}>
                        <Row justify="space-between">
                            <Col span={16}>
                                <Form.Item
                                    initialValue={(xueYuanXinXi && xueYuanXinXi.xingMing) || (xueYuanXinXi && xueYuanXinXi.id)}
                                    labelAlign="left"
                                    labelCol={{ span: 8 }}
                                    label="学生姓名" name="xingMing"
                                    rules={[{ required: true, message: "请输入学生姓名" }]}>
                                    <SearchableSelect
                                        initialSelected={(xueYuanXinXi && xueYuanXinXi.xingMing) || (xueYuanXinXi && xueYuanXinXi.id)}
                                        optionList={xueYuanOptions}
                                        onSelectChanged={onXueYuanXinMingChanged}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Button type="primary">选择在读学生</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <Form.Item
                                    initialValue={xueYuanXinXi && xueYuanXinXi.zhangHaoShouJi}
                                    labelAlign="left"
                                    labelCol={{ span: 8 }}
                                    label="手机号码" name="zhangHaoShouJi"
                                    rules={[{ required: true, message: "请输入手机号码" }, { message: "请正确输入手机号", pattern: new RegExp("^1(3|4|5|6|7|8|9)\\d{9}$") }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <Form.Item
                                    initialValue={(xueYuanXinXi && xueYuanXinXi.xingBie) || XingBie.NAN}
                                    labelAlign="left" labelCol={{ span: 8 }} label="性别" name="xingBie"
                                >
                                    <Radio.Group>
                                        <Radio value={XingBie.NAN}>{convertXingBie2Text(XingBie.NAN)}</Radio>
                                        <Radio value={XingBie.NV}>{convertXingBie2Text(XingBie.NV)}</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <Form.Item
                                    initialValue={xueYuanXinXi && xueYuanXinXi.nanLing}
                                    labelAlign="left" labelCol={{ span: 8 }} label="年龄" name="nanLing">
                                    <Input type="number" min={1} addonAfter={<span>岁</span>} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <Form.Item
                                    initialValue={xueYuanXinXi && xueYuanXinXi.jiuDuXueXiao}
                                    labelAlign="left" labelCol={{ span: 8 }} label="就读学校" name="jiuDuXueXiao">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <Form.Item
                                    initialValue={xueYuanXinXi && xueYuanXinXi.danqQianNianJi}
                                    labelAlign="left" labelCol={{ span: 8 }} label="当前年级" name="danqQianNianJi">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <Form.Item
                                    initialValue={xueYuanXinXi && xueYuanXinXi.jiaTingZhuZhi}
                                    labelAlign="left" labelCol={{ span: 8 }} label="家庭住址" name="jiaTingZhuZhi">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <Form.Item
                                    initialValue={xueYuanXinXi && xueYuanXinXi.xueYuanLaiYuan}
                                    labelAlign="left" labelCol={{ span: 8 }} label="学员来源" name="xueYuanLaiYuan">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <Form.Item
                                    initialValue={xueYuanXinXi && xueYuanXinXi.beiZhuXinXi}
                                    labelAlign="left" labelCol={{ span: 8 }} label="备注信息" name="beiZhuXinXi">
                                    <TextArea showCount maxLength={50}></TextArea>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={4}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Row justify="center">
                                <Avatar size={64} icon={<UserOutlined />} />
                            </Row>
                            <Row justify="center">
                                <Form.Item
                                    labelAlign="left"
                                    labelCol={{ span: 8 }}
                                    label="" name="touXiang">
                                    <Upload
                                        listType="picture"
                                        showUploadList={false}
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    >
                                        <Button type="primary">上传头像</Button>
                                    </Upload>
                                </Form.Item>
                            </Row>
                        </Space>
                    </Col>
                </Row>
                <Row justify="center">
                    <Col span={14}>
                        <Row justify="end">
                            <Form.Item>
                                <Row gutter={10}>
                                    <Col>
                                        <Button disabled={!!xueYuanXinXi?.id} onClick={handleBaoCunQianZaiXueYuan}>
                                            保存为潜在学员
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button type="primary" onClick={handleToNextStep}>
                                            下一步
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default BaoMingJiBenXinXiStep
