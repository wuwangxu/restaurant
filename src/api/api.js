import axios from 'axios'

// let base = '/api'
let base = '/order-system/api'
let tqbase= '/tqapi'

var formData = function (data) {
    let _formData = new FormData()
    for (var i in data) {
        _formData.append(i, data[i])
    }
    return _formData
}
// MenuManage 页面的接口
export const requestLogin = params => {
    return axios.get(`${base}/window/login?windowName=${params.windowName}&windowPassword=${params.windowPassword}`, {}).then(res => res.data)
}

export const getUserList = params => {
    return axios.get(`${base}/user/list`, {params: params})
}

export const getFoodsListPage = params => {
    return axios.get(`${base}/window/${params}`, {})
}

export const getFoodsListPageByName = params => {
    return axios.get(`${base}/menu/queryMenusByCondition?menuName=${params.menuName}&windowId=${params.windowId}`, {})
}

export const removeFood = params => {
    return axios.delete(`${base}/menu/${params}`, {})
}

export const batchRemoveUser = params => {
    return axios.get(`${base}/user/batchremove`, {params: params})
}

export const editFood = params => {
    return axios.post(`${base}/menu/updateMenu`, params)
}

export const addFood = params => {
    return axios.post(`${base}/menu/saveMenu`, params)
}

export const gettq = params => {

    return axios.post(`${tqbase}/weatherGis/web/weather/weatherFcst/getCurrentCondition`, params)
}

// OrderManage 页面的接口
export const getWindowOrders = params => {
    return axios.get(`${base}/order/getWindowOrders/${params}`)
}

// Order 页面的接口
export const getMenus = params => {
    return axios.get(`${base}/menu/queryMenusByCondition`)
}

// OrderSubmit 页面的接口
export const submitOrderapi = params => {
    return axios.post(`${base}/order/saveCustomerOrder`, params)
}