function prepareData(data)
{
    data.imageFile = data.imageFile[0]
    return data;
}

function createFormData(data)
{
    const formData = new FormData()
    formData.append("imageFile",data.imageFile)
    delete data.imageFile
    formData.append("json", JSON.stringify(data))
    return formData
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

async function processForm(data,token)
{
    const formattedData = prepareData(data)
    const formData = createFormData(formattedData)

    return await fetch("/api/playlists",{
        method: "POST",
        body: formData,
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer "+token
        },
    }).then(
        res => {
            switch (res.status) {
                case 201:
                    return "ok"
                case 401:
                    return 401;
                case 422:
                    return res.json()                
                default:
                    return "error";
            }
        }
    )
}

export { hasError, processForm }