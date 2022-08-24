import React from 'react'

export default function FormErrorServor({isSendError, formClass, errorServorMsg})
{
    return isSendError ? <div className={formClass+"--head--content--container--form--error"}>
            {errorServorMsg}
        </div> : ""
}