import React from 'react'

export default function FormIsLoadingError({isError, formClass, children})
{
    return !isError ? children : <div className={formClass+"--head--content--container--error"}>
        Une erreur survenu sur le serveur ne nous permet pas d'afficher ce formulaire. Veuillez réessayer ultérieurement
    </div>
}