const itemPerPageTopSongs = 4;

async function getTopSongs()
{
    return await fetch("/api/songs?itemsPerPage="+itemPerPageTopSongs+"&order[createdAt]=desc",{
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

export { getTopSongs }