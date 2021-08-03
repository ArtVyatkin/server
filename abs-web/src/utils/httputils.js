import {properties} from "../properties";

export default function requestInconsistencyChecking(data, onSuccess, onError) {
    fetch(properties.inconsistencyUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok)
            throw new Error('Request failed.')
        return response.json()
    })
        .then(response => onSuccess(response))
        .catch(reason => onError(reason))
}