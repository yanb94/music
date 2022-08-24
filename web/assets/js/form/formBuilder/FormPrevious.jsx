import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function FormPrevious({previousLink, formClass}){
    return previousLink ? <Link to={previousLink} className={formClass+"--head--content--container--previous"}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </Link> : ""
}