import { Form, Input, Radio, Switch, Select, Row, Col, Button, Checkbox, Card } from "antd"
import { useState } from "react";

import JueseGroupFormItem from "../../../components/juesecheckbox";
import { JueseGroupData } from "../../../components/juesecheckbox/JueseCheckboxGroup";
import TianJiaJueSeModal from "../../../components/modals/tianjiajuese/TianJiaJueSeModal";
;

const { Option } = Select;
const { TextArea } = Input;

const mockJueseDatas: JueseGroupData[] = [
    { val: "aaaa", mingCheng: "校长", miaoShu: "负责学校的日常管理，拥有系统内可设置的全部权限" },
    { val: "bbbb", mingCheng: "老师", miaoShu: "负责管理班级、学员和点名等日常教学事务，拥有教务模块部分权限" },
    { val: "cccc", mingCheng: "教务", miaoShu: "负责班级管理、学员管理等日常教学事务，拥有教务管理模块全部权限。" },
    { val: "dddd", mingCheng: "财务", miaoShu: "负责学校的财务管理，拥有财务模块的全部的权限" },
    { val: "eeee", mingCheng: "跟进人（课程顾问）", miaoShu: "负责学员报名、学员档案管理，拥有报名、学员档案管理、销售中心的管理权限" },
]

const XinJianYuanGong = () => {
    const [form] = Form.useForm();
    const [showTianJianJueseModal, setShowTianJianJueseModal] = useState<boolean>(false);

    const onFinish = (value: any) => {
        console.log(value)
    }
    const selectShanChang = (value: any) => {
        console.log(value)
    }

    //添加角色按钮点击
    const tianJanJueSeHandler = () => {
        setShowTianJianJueseModal(!showTianJianJueseModal);
    }

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
            >
                <Form.Item label="姓名" name="xingMing" rules={[{ required: true, message: "请输入姓名" }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item label="手机" name="shouJi" rules={[{ required: true, message: "请输入手机号" }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item label="性别" name="xingBie">
                    <Radio.Group>
                        <Radio value="nan">男</Radio>
                        <Radio value="nv">女</Radio>
                    </Radio.Group>
                </Form.Item>
                {/* <Form.Item label="是否授课" name="isLaoShi">
                <Switch />
            </Form.Item> */}
                <Form.Item label="擅长科目" name="shanChangKeMu" initialValue={[{ value: "jack", label: 'Light' }]}>
                    <Select
                        mode="multiple"
                        allowClear
                        labelInValue
                        style={{ width: 120 }}
                        onChange={selectShanChang}
                    >
                        <Option value="yuwen">语文</Option>
                        <Option value="shuxue">数学</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="备注" name="beiZhu">
                    <TextArea showCount maxLength={50}></TextArea>
                </Form.Item>
                <Button type="primary" onClick={tianJanJueSeHandler} >自定义添加角色</Button>
                <Form.Item label="功能权限选择" name="jueSeZu" rules={[{ required: true, message: "点击选择角色" }]}>
                    <JueseGroupFormItem datas={mockJueseDatas} />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            {showTianJianJueseModal ? <TianJiaJueSeModal visible={showTianJianJueseModal} onClose={() => setShowTianJianJueseModal(false)} /> : ""}
        </>
    )
}

export default XinJianYuanGong
