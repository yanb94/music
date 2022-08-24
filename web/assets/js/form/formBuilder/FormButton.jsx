import React from 'react'
import Button from '@app/module/button/Button'
import Loader from '@app/module/loader/Loader'

export default function FormButton({formClass, formState, buttonLabel, mustBeValid = true})
{
    const beValid = () => {
        if(mustBeValid)
            return !formState.isValid
        else
            return false
    }

    return <div className={formClass+"--head--content--container--form--cont-button"}>
        <Button theme="secondary" type="submit" disabled={beValid() || formState.isSubmitting} >
            {buttonLabel}
        </Button> 
        {formState.isSubmitting ? <Loader size="30px" style={{"marginTop": "25px"}}/> : ""}
    </div>
}