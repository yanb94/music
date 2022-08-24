
function prepareData(data)
{
    delete data.email_confirm;
    delete data.plainPassword_confirm;
    delete data.legal;

    return data;
}

async function sendRequest(data)
{
    const formatedData = prepareData(data);
    
    return await fetch('/api/users',{
        method: "POST",
        body: JSON.stringify(formatedData),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if(response.ok)
            return "ok"
        else if(response.status == 422 || response.status == 400)
            return response.json()
        else
            return "error"
    });
}

async function processFormData(data)
{
    const formatedData = prepareData(data);
    const result = await sendRequest(formatedData);

    console.log(result);

    return result['violations'];
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


export {processFormData, sendRequest, hasError};