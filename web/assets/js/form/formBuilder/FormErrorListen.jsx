import React from 'react'

export default function FormErrorListen({errorsToListen, errors, formClass})
{
    let i = 0;
    return Array.isArray(errorsToListen) ? errorsToListen.map((errorToListen) => 
        (errors[errorToListen] ? 
            <div key={i++} className={formClass+"--head--content--container--form--error"}>
                {errors[errorToListen]?.message}
            </div> : '')
    ) : ""
}