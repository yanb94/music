import React from 'react'
import renderField from './renderField';

export default function FormFields({formFields,formParams})
{
    let fieldNb = 0;

    return Array.isArray(formFields) ? formFields.map((config) => renderField(
        config,
        fieldNb++,
        {
            register: formParams.register, 
            errors: formParams.formState.errors, 
            control: formParams.control
        }
        )
    ): null
}