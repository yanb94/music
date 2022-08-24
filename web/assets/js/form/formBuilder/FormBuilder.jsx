import React from 'react'
import "./FormBuilder.scss";
import FormRedirect from './FormRedirect';
import FormErrorServor from './FormErrorServor';
import FormErrorListen from './FormErrorListen';
import FormFields from './FormFields';
import FormButton from './FormButton';
import FormIsLoading from './FormIsLoading';
import FormIsLoadingError from './FormIsLoadingError';
import FormPrevious from './FormPrevious';

export default function FormBuilder({
    formClass, 
    formFields,
    onSubmit, 
    title, 
    buttonLabel, 
    isRedirect, 
    isSendError, 
    redirectTarget, 
    formParams, 
    errorServorMsg, 
    errorsToListen,
    isLoading,
    isErrorLoading,
    previousLink,
    mustBeValid = true
})
{
    return <div className={formClass+'--head'}>
        <div className={formClass+"--head--image"}></div>
        <div className={formClass+"--head--content"}>
            <div className={formClass+"--head--content--container"}>
                <FormPrevious previousLink={previousLink} formClass={formClass} />
                <h1 className={formClass+"--head--content--container--title"}>{title}</h1>
                <FormIsLoading isLoading={isLoading} formClass={formClass}>
                    <FormIsLoadingError isError={isErrorLoading} formClass={formClass}>
                        <FormRedirect isRedirect={isRedirect} redirectTarget={redirectTarget}>
                            <form className={formClass+"--head--content--container--form"} onSubmit={formParams.handleSubmit(onSubmit)}>
                                
                                <FormErrorServor 
                                    isSendError={isSendError} 
                                    formClass={formClass} 
                                    errorServorMsg={errorServorMsg} 
                                />

                                <FormErrorListen
                                    errorsToListen={errorsToListen}
                                    errors={formParams.formState.errors}
                                    formClass={formClass}
                                />

                                <FormFields 
                                    formFields={formFields} 
                                    formParams={formParams}
                                />

                                <FormButton
                                    formClass={formClass} 
                                    formState={formParams.formState} 
                                    buttonLabel={buttonLabel} 
                                    mustBeValid={mustBeValid}
                                />

                            </form>
                        </FormRedirect>
                    </FormIsLoadingError>
                </FormIsLoading>
            </div>
        </div>
    </div>
}