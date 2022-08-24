function twoDigitNumber(number)
{
    return number.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

async function getInitialData(id,token) {
    return await fetch('/api/users/'+id,{
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
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

function formatBirthday(birthday)
{
    return birthday.getFullYear()+"-"+twoDigitNumber(birthday.getMonth()+1)+"-"+twoDigitNumber(birthday.getDate())
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

async function sendRequest(id,token,formatedData)
{
    const birthday = formatedData.birthday
    formatedData.birthday = formatBirthday(birthday)

    return await fetch('/api/users/'+id,{
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/merge-patch+json",
            "Authorization": "Bearer "+token
        },
        body: JSON.stringify(formatedData)
    }).then((response) =>{
        if(response.ok)
            return 'ok'
        else if(response.status == 401)
            return 401
        else if(response.status == 400 || response.status == 422)
            return response.json()
        else
            return "error"
    })
}

export {getInitialData, sendRequest, hasError}