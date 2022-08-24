function prepareData(data,id)
{
    delete data.email_confirm
    data.image = data.image[0]
    data.user = "/api/users/"+id
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

async function processForm(id,data,token)
{
    const formattedData = prepareData(data,id)
    const formData = createFormData(formattedData)

    return await fetch("/api/artists",{
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

export {processForm, hasError}