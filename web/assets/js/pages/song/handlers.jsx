import React from 'react'
import Loader from '@app/module/loader/Loader';

function Error({isError, className, children}){

    const errorMsg = "Une erreur ne nous a pas permit de récupérer les données demandées veuillez actualiser la page."

    return isError ? <div className={className+"--error"}>
        {errorMsg}
    </div> : children
}

function Loading({isLoading, children}){
    
    const styleLoaderCont = {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        paddingTop: "40px"
    }
    
    return isLoading ?
        <div style={styleLoaderCont}>
            <Loader/>
        </div> 
    : children
}

function PartialLoading({isPartialLoading}){
    
    const styleLoaderCont = {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        marginTop: "30px"
    }
    
    return isPartialLoading ?
        <div style={styleLoaderCont}>
            <Loader/>
        </div>
    : ""
}

export {Error, Loading, PartialLoading}