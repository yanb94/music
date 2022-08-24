import React from 'react'

export default function ShowChildIfTrue({isControl, alternateElem, children})
{
    return isControl ? children : alternateElem
}