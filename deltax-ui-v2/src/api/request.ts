const BASE_URL = "/api/v1"

export function GetHeader() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
    }
}

export function Get<T>(url: string) {
    return fetch(`${BASE_URL}/${url}`,
        {
            method: "GET",
            headers: GetHeader()
        })
        .then(resp => resp.json())
        .then(resp => resp as T);
}

export function Post<T>(url: string, data?: any) {
    return fetch(`${BASE_URL}/${url}`,
        {
            method: "POST",
            body: JSON.stringify(data),
            headers: GetHeader()
        })
        .then(resp => resp.json())
        .then(resp => resp as T);
}

export function Put<T>(url: string, data?: any) {
    return fetch(`${BASE_URL}/${url}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
            headers: GetHeader()
        })
        .then(resp => resp.json())
        .then(resp => resp as T);
}

export function Delete<T>(url: string, data?: any) {
    return fetch(`${BASE_URL}/${url}`,
        {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: GetHeader()
        })
        .then(resp => resp.json())
        .then(resp => resp as T);
}
