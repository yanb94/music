const itemPerPage = 5

async function getData(token,page = 1)
{
    return await fetch("/api/playlists/my_playlists?itemsPerPage="+itemPerPage,{
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

async function getNewData(token,url)
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

async function getDataAutocomplete(search,token)
{
    return await fetch("/api/playlists/my_playlists?itemsPerPage="+itemPerPage+"&s="+search,{
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

async function deletePlaylist(slug,token)
{
    return await fetch("/api/playlists/"+slug,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/ld+json",
            "Accept": "application/ld+json",
            "Authorization": "Bearer "+token
        }
    }
    ).then((response) => {
        if(response.ok)
            return "ok"
        else if(response.status == 401)
            return 401
        else
            return "error"        
    })
}

export { getData, getNewData, getDataAutocomplete, deletePlaylist }