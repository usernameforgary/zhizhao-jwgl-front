import React from 'react'
import { useParams } from 'react-router-dom'

type ParamsType = {
    paiKeJiLuId: string
}

const PaiKeJiLuDianPing = () => {
    const { paiKeJiLuId } = useParams<ParamsType>();

    return (
        <div
            style={{
                margin: 0,
                minHeight: "85vh"
            }}
        >
            {paiKeJiLuId}
        </div>
    )
}

export default PaiKeJiLuDianPing
