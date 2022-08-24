function prepareData(data)
{
    data.songFile = data.songFile[0]
    data.imageFile = data.imageFile[0]
    return data;
}

function createFormData(data)
{
    const formData = new FormData()
    Object.keys(data).map((value) => formData.append(value,data[value]))

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

    return await fetch("/api/songs",{
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