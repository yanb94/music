import React from 'react'
import { Redirect } from 'react-router-dom'

function filter(isRedirect, redirectTarget, children)
{
    if(isRedirect == undefined)
        return children

    return isRedirect ? <Redirect exact to={redirectTarget}/> : children
}

export default function FormRedirect({isRedirect, redirectTarget, children})
{
    return filter(isRedirect, redirectTarget, children)
}