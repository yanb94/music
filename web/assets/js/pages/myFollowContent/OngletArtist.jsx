import React from 'react'
import ArtistItem from './ArtistItem';
import { getInitialArtistData, getNewArtistData } from './getData';
import Onglet from './Onglet';

export default function OngletArtist()
{
    const showFunction = (value) => <ArtistItem key={value.id} data={value} size="130px"/>;

    return <Onglet
        getInitial={getInitialArtistData}
        getNext={getNewArtistData}
        showFunction={showFunction}
    />
}