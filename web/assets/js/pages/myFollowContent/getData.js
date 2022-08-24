const itemPerPage = 8

async function getInitialSongData(token)
{
    return await fetch("/api/songs/song-of-followed-artists?itemsPerPage="+itemPerPage,{
            method: "GET",
            headers: {
                "Content-Type": "application/ld+json",
                "Accept": "application/ld+json",
                "Authorization": "Bearer "+token
            }
        }
    ).then((response) => {
        if(response.ok)
            return response.json()
        else if(response.status == 401)
            return 401
        else
            return "error"
    })
}

async function getNewSongData(url,token)
{
    return await fetch(url,{
            method: "GET",
            headers: {
                "Content-Type": "application/ld+json",
                "Accept": "application/ld+json",
                "Authorization": "Bearer "+token
            }
        }
    ).then((response) => {
        if(response.ok)
            return response.json()
        else if(response.status == 401)
            return 401
        else
            return "error"
    })
}

async function getInitialPlaylistData(token){
    return await fetch("/api/playlists/pinned?itemsPerPage="+itemPerPage,{
            method: "GET",
            headers: {
                "Content-Type": "application/ld+json",
                "Accept": "application/ld+json",
                "Authorization": "Bearer "+token
            }
        }
    ).then((response) => {
        if(response.ok)
            return response.json()
        else if(response.status == 401)
            return 401
        else
            return "error"
    })
};
async function getNewPlaylistData(url,token){
    return await fetch(url,{
            method: "GET",
            headers: {
                "Content-Type": "application/ld+json",
                "Accept": "application/ld+json",
                "Authorization": "Bearer "+token
            }
        }
    ).then((response) => {
        if(response.ok)
            return response.json()
        else if(response.status == 401)
            return 401
        else
            return "error"
    })
};


async function getInitialArtistData(token){
    return await fetch("/api/artists/followed?itemsPerPage="+itemPerPage,{
            method: "GET",
            headers: {
                "Content-Type": "application/ld+json",
                "Accept": "application/ld+json",
                "Authorization": "Bearer "+token
            }
        }
    ).then((response) => {
        if(response.ok)
            return response.json()
        else if(response.status == 401)
            return 401
        else
            return "error"
    })
};
async function getNewArtistData(url,token){
    return await fetch(url,{
            method: "GET",
            headers: {
                "Content-Type": "application/ld+json",
                "Accept": "application/ld+json",
                "Authorization": "Bearer "+token
            }
        }
    ).then((response) => {
        if(response.ok)
            return response.json()
        else if(response.status == 401)
            return 401
        else
            return "error"
    })
}

export { 
    getInitialSongData, 
    getNewSongData, 
    getInitialArtistData, 
    getNewArtistData,
    getInitialPlaylistData,
    getNewPlaylistData
}