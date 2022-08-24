import React from 'react'
import Onglet from './Onglet'
import { getInitialSongData, getNewSongData } from './getData';
import SongItem from '@app/module/song-item/SongItem';

export default function OngletSong(){
    
    const showFunction = (value) => <SongItem key={value.id} data={value} size="150px"/>;
    
    return <Onglet
        getInitial={getInitialSongData}
        getNext={getNewSongData}
        showFunction={showFunction}
    /> 
}