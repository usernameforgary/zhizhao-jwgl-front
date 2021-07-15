import React, { useEffect, useState } from 'react';
import { Select } from 'antd'
import { SearchableSelectOptionDataType } from '../../customtypes';

const { Option } = Select;

type SearchableSelectProps = {
    initialSelected?: string
    optionList: SearchableSelectOptionDataType[],
    onSelectChanged: (value: string) => void
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ initialSelected, optionList, onSelectChanged }) => {
    const [record, setRecord] = useState<string[]>([])
    const [newValue, setNewValue] = useState<string[]>([])

    useEffect(() => {
        if (initialSelected) {
            setRecord([initialSelected])
        }
    }, [initialSelected]);

    const onChangeSelect = (value: any) => {
        setRecord([value])
        if (newValue.length > 0) {
            setNewValue([]);
        }
        onSelectChanged(value);
    }

    const onSearchSelect = (value: string) => {
        if (!!value) {
            setNewValue([value])
        }
    }

    const onBlurSelect = (index: any) => {
        const value = newValue[index];
        if (!!value) {
            onChangeSelect(value);
            // 在onBlur后将对应的key删除，防止当从下拉框中选择后再次触发onBlur时经过此处恢复成原来的值
            setNewValue([]);
        }
    }

    return (

        <Select
            allowClear
            showSearch
            optionFilterProp="children"
            optionLabelProp="label"
            showArrow={false}
            onChange={(value) => onChangeSelect(value)}
            onSearch={value => onSearchSelect(value)}
            onBlur={() => onBlurSelect('0')}
            value={record[0]}
        >
            {optionList.map((item, index) =>
                <Option key={index} value={item.value} label={item.label}>{item.showValue}</Option>)}
        </Select>

    )
}

export default SearchableSelect
