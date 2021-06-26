import React from 'react';
import { useState } from 'react';
import { Row, Col } from 'antd';
import JueSeFormItem from './JueseCheckbox';

export type JueseGroupData = {
    val: string,
    mingCheng: String,
    miaoShu: string
}

export type JueseCheckboxProps = {
    datas: JueseGroupData[],
    value?: any,
    onChange?: (values: any) => any
}

const JueseCheckboxGroup: React.FC<JueseCheckboxProps> = ({ datas, onChange }: JueseCheckboxProps) => {
    const [selected, setSelected] = useState([]);

    const onChangeComplete = (val: string, isSelected: boolean) => {
        if (isSelected) {
            if (!selected.includes(val)) {
                setSelected([...selected, val]);
                onChange([...selected, val]);
            }
        } else {
            if (selected.includes(val)) {
                setSelected(selected.filter((v) => v !== val));
                onChange(selected.filter((v) => v !== val));
            }
        }
    };

    return (
        <div>
            <Row gutter={[10, 10]}>
                {
                    datas.map((data, index) => {
                        return (
                            <Col span={8} key={index}>
                                <JueSeFormItem key={data.val} JueSeFormItem val={data.val} mingCheng={data.mingCheng} miaoShu={data.miaoShu} onChange={onChangeComplete} ></JueSeFormItem>
                            </Col>
                        )
                    })
                }
            </Row>
        </div >
    )
}

export default JueseCheckboxGroup
