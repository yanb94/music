import React from 'react'
import Onglet from './Onglet'
import PlaylistItem from '@app/module/playlist-item/PlaylistItem';
import { getInitialPlaylistData, getNewPlaylistData } from './getData';

export default function OngletPlaylist(){
    
    const showFunction = (value) => <PlaylistItem key={value.id} data={value} size="150px"/>;
    
    return <Onglet
        getInitial={getInitialPlaylistData}
        getNext={getNewPlaylistData}
        showFunction={showFunction}
    /> 
}