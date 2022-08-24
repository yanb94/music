import React from 'react'
import Loader from '@app/module/loader/Loader'

export default function FormIsLoading({isLoading, formClass, children})
{
    if(isLoading == undefined)
        return children
    return !isLoading ? children : <div className={formClass+"--head--content--container--cont-loader"}>
        <Loader size="100px" style={{"marginTop": "25px","padding": "30px"}}/>
    </div>
}