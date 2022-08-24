const itemPerPage = 5

async function getData(search)
{
    return await fetch("/api/songs/autocomplete?s="+search+"&itemsPerPage="+itemPerPage,{
            method: "GET",
            headers: {
                "Content-Type": "application/ld+json",
                "Accept": "application/ld+json"
            }
        }
    ).then((response) => {
        if(response.ok)
            return response.json()
        else
            return "error"
    })
}

export { getData }