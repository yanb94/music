async function pinPlaylist(slug,token)
{
    return fetch("/api/playlists/"+slug+"/pin",{
        method: "GET",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json",
            "Authorization": "Bearer "+token
        }
    }).then((response) => {
        if(response.ok)
            return response.json()
        else
            return "error"        
    })
}

async function unPinPlaylist(slug,token)
{
    return fetch("/api/playlists/"+slug+"/unpin",{
        method: "GET",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json",
            "Authorization": "Bearer "+token
        }
    }).then((response) => {
        if(response.ok)
            return response.json()
        else
            return "error"        
    })
}

async function checkIsPin(slug,token)
{
    return fetch("/api/playlists/"+slug+"/is-pinned",{
        method: "GET",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json",
            "Authorization": "Bearer "+token
        }
    }).then((response) => {
        if(response.ok)
            return response.json()
        else if(response.status == 401)
            return 401
        else
            return "error"        
    })
}

export { pinPlaylist, checkIsPin, unPinPlaylist }