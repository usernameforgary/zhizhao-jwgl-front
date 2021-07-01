import Search from 'antd/lib/input/Search'
import React from 'react'

export type SearchItemInputProps = {
    label: string,
    placeHolder?: string,
    searchable?: boolean,
    onSearch?: () => void | Promise<void>
}

const SearchItemInput = () => {
    const onSearch = (value: string) => {
        console.log(value)
    }

    return (
        <div>
            <Search onSearch={onSearch} />
        </div>
    )
}

export default SearchItemInput
