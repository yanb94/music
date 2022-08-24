async function followTheArtist(slug,token)
{
    return fetch("/api/artists/add_follower/"+slug,{
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

async function unFollowTheArtist(slug,token)
{
    return fetch("/api/artists/remove_follower/"+slug,{
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

async function checkIsFollower(slug,token)
{
    return fetch("/api/artists/is_follower/"+slug,{
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

export { followTheArtist, checkIsFollower, unFollowTheArtist }