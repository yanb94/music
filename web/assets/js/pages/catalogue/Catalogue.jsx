import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, {useRef, useState} from 'react'
import './Catalogue.scss'
import TopSongs from './TopSongs'
import ListSongs from './ListSongs'
import ListPlaylists from './ListPlaylists'
import ListSearch from './ListSearch'
import Header from '@app/module/header/Header'
import image from '../../../image/home-offer.jpg'

function IsSearch({isSearch, search, previousAction, children})
{
    return isSearch ? <ListSearch className="catalogue--content--search" search={search} previousAction={previousAction}/> : <>{children}</>
}

export default function Catalogue()
{
    const [hideAllExceptListSongs, setHideAllExceptListSongs] = useState(false)
    const [hideAllExceptListPlaylists, setHideAllExceptListPlaylists] = useState(false)
    const [isSearch, setIsSearch] = useState(false)
    const [search, setSearch] = useState('')
    const [callSearch, setCallSearch] = useState(null)
    const refSearchInput = useRef(null)

    const searchElement = (value) => {
        
        clearTimeout(callSearch)
        
        if(value.length > 0)
        {
            setCallSearch(
                setTimeout(() => {
                    setSearch(value)
                    setIsSearch(true)
                },1000)
            )
            return;
        }
        setIsSearch(false)
    }

    const searchPrevious = () => {
        refSearchInput.current.value = ''
        setSearch(refSearchInput.current.value)
        setIsSearch(false)
    }

    return <div className="catalogue">
        <Header
            title="Notre catalogue - Song"
            description="Découvrez toutes les chansons de notre catalogue"
            ogOption={{
                image: image
            }}
            twitterOption={{
                image: image
            }}
        />
        <div className="catalogue--search-form">
            <div className="catalogue--search-form--input">
                <input ref={refSearchInput} type="search" placeholder="Trouver une chanson ou playlist" onChange={(e) => searchElement(e.target.value)}/>
                <div className="catalogue--search-form--input--icon">
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </div>
        </div>
        {
            <div className="catalogue--content">
                <IsSearch isSearch={isSearch} search={search} previousAction={searchPrevious}>
                    {(hideAllExceptListSongs || hideAllExceptListPlaylists) ? "" : <TopSongs className="catalogue--content--top-song" />}
                    {(hideAllExceptListPlaylists) ? "" : <ListSongs className="catalogue--content--songs" isMore={hideAllExceptListSongs} moreAction={setHideAllExceptListSongs} />}
                    {(hideAllExceptListSongs) ? "" : <ListPlaylists className="catalogue--content--playlists" isMore={hideAllExceptListPlaylists} moreAction={setHideAllExceptListPlaylists}/>}
                </IsSearch>
            </div>
        }
    </div>
}