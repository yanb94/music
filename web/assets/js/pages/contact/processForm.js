async function sendRequest(data)
{
    return await fetch('/api/contact',{
        method: "POST",
        headers: {
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    }).then((response) =>{
        if(response.ok)
            return 'ok'
        else if(response.status == 422)
            return response.json()
        else
            return "error"
    })
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

export { sendRequest, hasError }