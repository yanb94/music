import React, { useState } from 'react'
import './MyFollowContent.scss'
import OngletArtist from './OngletArtist'
import OngletSong from './OngletSong'
import OngletPlaylist from './OngletPlaylist'
import Header from '@app/module/header/Header'

export default function MyFollowContent(){

    const SONG_ONGLET = 'song'
    const PLAYLIST_ONGLET = 'playlist'
    const ARTIST_ONGLET = 'artist'

    const [openOnglet, setOpenOnglet] = useState(SONG_ONGLET)

    const selectOnglet = (currentOnglet) => openOnglet == currentOnglet ? " selected" : ""

    const showOnglet = (currentOnglet) => {
        switch (currentOnglet) {
            case SONG_ONGLET:
                return <OngletSong/>
            case PLAYLIST_ONGLET:
                return <OngletPlaylist/>
            case ARTIST_ONGLET:
                return <OngletArtist/>
            default:
                break;
        }
    }

    return <div className="my-follow-content">
        <Header
            title="Mes abonnements"
            description="Mes abonnements"
        />
        <div className="my-follow-content--content">
            <h1 className="my-follow-content--content--title">Mes abonnements</h1>
            <div className="my-follow-content--content--menu">
                <div className={"my-follow-content--content--menu--item"+selectOnglet(SONG_ONGLET)} onClick={() => setOpenOnglet(SONG_ONGLET)}>
                    <span>Chansons</span>
                </div>
                <div className={"my-follow-content--content--menu--item"+selectOnglet(PLAYLIST_ONGLET)} onClick={() => setOpenOnglet(PLAYLIST_ONGLET)}>
                    <span>Playlists</span>
                </div>
                <div className={"my-follow-content--content--menu--item"+selectOnglet(ARTIST_ONGLET)} onClick={() => setOpenOnglet(ARTIST_ONGLET)}>
                    <span>Artistes</span>
                </div>
            </div>
            <div className="my-follow-content--content--onglets">
                { showOnglet(openOnglet) }
            </div>
        </div>
    </div>
}