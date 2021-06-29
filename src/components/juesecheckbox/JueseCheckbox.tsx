import React from 'react'
import { useState } from 'react'
import { CheckCircleTwoTone } from '@ant-design/icons'

import './juesecheckbox.css'

export type JueseCheckboxProps = {
    selected?: boolean
    val: string
    mingCheng: string
    jianJie: string
    onChange: (value: string, seleced: boolean) => void
}

const JueseCheckbox: React.FC<JueseCheckboxProps> = ({ val, mingCheng, jianJie, onChange }: JueseCheckboxProps) => {
    const [selected, setSelected] = useState<boolean>(false);

    const toggleSelected = () => {
        setSelected(!selected);
        onChange(val, !selected);
    }

    return (
        <div className="juese-container" onClick={() => toggleSelected()}>
            <div className="selected-icon-container">
                {selected ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CheckCircleTwoTone twoToneColor="gray" />}
            </div>
            <div className="text-container">
                <span className="title-container">{mingCheng}</span>
                <span className="content-contianer">{jianJie}</span>
            </div>
        </div>
    )
}

export default JueseCheckbox
