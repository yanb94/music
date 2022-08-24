import React, { useState, useRef } from 'react'
import './SongListInput.scss'
import { Controller } from "react-hook-form";
import { getData } from './getData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import secondsToHms from '@app/utils/secondsToHms';

function getTheGoodImage(size, rawImage, responsiveImage)
{
    if(size == '100x90')
        return responsiveImage?.['100x90'] ?? rawImage
}

function SongListAutoCompleteItem({data, onClick})
{
    return <div className="song-list-input--list-songs--item" onClick={onClick}>
        <img src={ getTheGoodImage('100x90', data.contentImageUrl, data.contentImageResponsive) } className="song-list-input--list-songs--item--image"/>
        <div className="song-list-input--list-songs--item--info">
            <p className="song-list-input--list-songs--item--info--name">{data.name}</p>
            <p className="song-list-input--list-songs--item--info--author">De {data.author.name}</p>
            <p className="song-list-input--list-songs--item--info--duration">{secondsToHms(data.songDuration)}</p>
        </div>
    </div>
}

function SongSelectedItem({data, closeAction})
{
    return <div className="song-list-input--selected-items--item">
        <img src={ getTheGoodImage('100x90', data.contentImageUrl, data.contentImageResponsive) } className="song-list-input--selected-items--item--image"/>
        <div className="song-list-input--selected-items--item--info">
            <p className="song-list-input--selected-items--item--info--name">{data.name}</p>
            <p className="song-list-input--selected-items--item--info--author">De {data.author.name}</p>
            <p className="song-list-input--selected-items--item--info--duration">{secondsToHms(data.songDuration)}</p>
            <div className="song-list-input--selected-items--item--info--close"> <FontAwesomeIcon icon={faTimes} onClick={closeAction} /> </div>
        </div>
    </div>
}

export default function SongListInput({label, name, errors, control})
{
    const [autocompleteList, setAutocompleteList] = useState([])
    const [callAutocomplete, setCallAutoComplete] = useState(null)

    const inputRef = useRef(null)

    const getAutoComplete = async(search) => {
        const result = await getData(search)
        
        switch(result){
            case "error":
                console.log('error')
                break  
            default:
                setAutocompleteList(result['hydra:member'])
                break  
        }
    }

    const filterBySearch = async(value) => {
        
        clearTimeout(callAutocomplete)
        
        if(value.length < 3){
            setAutocompleteList([])
            return
        }
        
        setCallAutoComplete(setTimeout(async() => await getAutoComplete(value),1000));
    }

    const addAction = (data, initialValue, onChange) => {
        
        initialValue.push(data)
        onChange([...initialValue]);

        inputRef.current.value = "";
        setAutocompleteList([])
    }

    const closeAction = (index, initialValue, onChange) => {
        initialValue.splice(index,1);
        onChange([...initialValue])
    }

    return <div className="song-list-input">
        <label>{label}</label>
        <Controller
            control={control}
            defaultValue={[]}
            name={name}
            render={ ({ field: { value, onChange }}) => {
                    return <div>
                        <div className="song-list-input--selected-items">
                            {value.map((song,index) => <SongSelectedItem data={song} key={index} closeAction={() => closeAction(index, value, onChange)}/>) }
                        </div>
                        <input id="searchSongToAdd" ref={inputRef} type="text" autoComplete="off" placeholder="Ajouter une chanson" onChange={ async(e) => await filterBySearch(e.target.value) }/>
                        <div className="song-list-input--list-songs">
                            { autocompleteList.map((data) => <SongListAutoCompleteItem key={data.id} data={data} onClick={() => addAction(data, value, onChange)} />) }
                        </div>
                    </div>
                }
            }
        /> 
        {
            errors[name]?.message ? <div className="song-list-input--error">
                <i className="fas fa-exclamation-triangle"></i> :  {errors[name]?.message}
            </div> : ""
        }
    </div>
}