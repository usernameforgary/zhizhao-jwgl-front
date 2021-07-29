import React from 'react'
import { XingBie } from '../../../customtypes'
import IconMan from './IconMan';
import IconWoman from './IconWonman';

type MyGenderProps = {
    xingBie: XingBie | undefined
}

const MyGender: React.FC<MyGenderProps> = ({ xingBie }): JSX.Element => {
    let result = <></>;
    switch (xingBie) {
        case XingBie.NAN:
            result = <IconMan />;
            break;
        case XingBie.NV:
            result = <IconWoman />;
            break;
        default:
            break;
    }

    return result;
}

export default MyGender
