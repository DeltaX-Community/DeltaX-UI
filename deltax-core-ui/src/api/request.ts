
export function GetHeader() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
    }
}

export function Get<T>(url: string) {
    return fetch(url,
        {
            method: "GET",
            headers: GetHeader()
        })
        .then(resp => resp.json())
        .then(resp => resp as T);
}

export function Post<T>(url: string, data?: any) {
    return fetch(url,
        {
            method: "POST",
            body: JSON.stringify(data),
            headers: GetHeader()
        })
        .then(resp => resp.json())
        .then(resp => resp as T);
}

export function Put<T>(url: string, data?: any) {
    return fetch(url,
        {
            method: "PUT",
            body: JSON.stringify(data),
            headers: GetHeader()
        })
        .then(resp => resp.json())
        .then(resp => resp as T);
}

export function Delete<T>(url: string, data?: any) {
    return fetch(url,
        {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: GetHeader()
        })
        .then(resp => resp.json())
        .then(resp => resp as T);
}


export interface TagValue {
    updated: Date;
    value: string;
}

export function GetTopicHistory(
    baseUrl = "http://127.0.0.1:5010/api/v1",
    tagName: string,
    options = {
        beginDateTime: null,
        endDateTime: null,
        maxPoints: 1000,
        lastSeconds: 30,
        strictMode: false,
    }
) {
    const q = [];
    const {
        beginDateTime,
        endDateTime,
        maxPoints,
        lastSeconds,
        strictMode,
    } = Object.assign(
        {},
        {
            beginDateTime: null,
            endDateTime: null,
            maxPoints: 1000,
            lastSeconds: 60,
            strictMode: null,
        },
        options
    );

    if (beginDateTime) {
        q.push(`beginDateTime=${new Date(beginDateTime).toISOString()}`);
    }
    if (endDateTime) {
        q.push(`endDateTime=${new Date(endDateTime).toISOString()}`);
    }
    if (maxPoints) {
        q.push(`maxPoints=${maxPoints}`);
    }
    if (lastSeconds) {
        q.push(`lastSeconds=${lastSeconds}`);
    }
    if (strictMode != null) {
        q.push(`strictMode=${strictMode}`);
    }

    // http://127.0.0.1:5010/api/v1/History/topic/tag1?maxPoints=1000&lastSeconds=300
    return Get<any[]>(`${baseUrl}/History/topic/${tagName}?${q.join("&")}`)
        .then(e => e.map(v => {
            return { ...v, updated: new Date(v.updated) } as TagValue
        }));
}


