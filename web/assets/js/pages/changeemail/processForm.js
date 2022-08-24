function prepareData(data)
{
    console.log(data)
    delete data.newEmail_confirm;
    return data;
}

function hasError(resultRequest, setError)
{
    if(resultRequest)
    {
        resultRequest.map((v) => setError(v['propertyPath'], { type: "manual", message: v['message']}, {shouldFocus: true}))
        return true
    }
       
    return false    
}

async function sendRequest(id,token,data)
{
    const formatedData = prepareData(data)

    return await fetch("/api/users/"+id+"/change-email",{
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer "+token
        },
        body: JSON.stringify(formatedData)
    }).then((response) => {
        if(response.ok)
            return "ok"
        else if(response.status == 401)
            return 401
        else if(response.status == 422 || response.status == 400)
            return response.json()
        else
            return "error"
    })
}

export { hasError, sendRequest }