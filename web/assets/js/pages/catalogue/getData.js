const itemPerPageTopSongs = 3;

async function getTopSongs()
{
    return fetch("/api/songs?itemsPerPage="+itemPerPageTopSongs,{
        method: "GET",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json"
        }
    }).then((response) => {
        if(response.ok)
            return response.json()
        else
            return "error"        
    })

}

const itemPerPageSongs = 8;

async function getSongs()
{
    return fetch("/api/songs?itemsPerPage="+itemPerPageSongs,{
        method: "GET",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json"
        }
    }).then((response) => {
        if(response.ok)
            return response.json()
        else
            return "error"        
    })
}

async function getNewSongs(url)
{
    return fetch(url,{
        method: "GET",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json"
        }
    }).then((response) => {
        if(response.ok)
            return response.json()
        else
            return "error"        
    })
}

const itemPerPagePlaylists = 8;

async function getPlaylists()
{
    return fetch("/api/playlists?itemsPerPage="+itemPerPagePlaylists,{
        method: "GET",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json"
        }
    }).then((response) => {
        if(response.ok)
            return response.json()
        else
            return "error"        
    })
}

async function getNewPlaylists(url)
{
    return fetch(url,{
        method: "GET",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json"
        }
    }).then((response) => {
        if(response.ok)
            return response.json()
        else
            return "error"        
    })
}

const itemPerPageSearch = 8;

async function getSearch(search)
{
    return fetch("/api/search?s="+search+"&pagination="+itemPerPageSearch,{
        method: "GET",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json"
        }
    }).then((response) => {
        if(response.ok)
            return response.json()
        else
            return "error"        
    })
}

async function getNewSearch(url)
{
    return fetch(url,{
        method: "GET",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json"
        }
    }).then((response) => {
        if(response.ok)
            return response.json()
        else
            return "error"        
    })
}


export {getTopSongs, getSongs, getNewSongs, getPlaylists, getNewPlaylists, getSearch, getNewSearch}