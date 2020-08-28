//对axios进行二次封装
axios.defaults.baseURL = "http://localhost:8888"; 
// 数据以表单的形式扔给服务器
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
//以表单的形式扔给服务器，数据格式   name=?&age=?
axios.defaults.transformRequest = function(data){
    if(!data) return data;
    let result = "";
    for (const attr in data) {
        if (!data.hasOwnProperty(attr)) break;
        result += `&${attr}=${data[attr]}`;
    }
    return result.substring(1);
}

//配置请求拦截
axios.interceptors.request.use(config=>{
    return config
})
//配置响应拦截
axios.interceptors.response.use(response=>{
    return response.data;
},reason=>{
    if(reason.response){
        switch (String(reason.response.status)) {
            case "404":
                alert("当前请求的地址不存在！")
                break;
        
            default:
                break;
        }
    }
    return Promise.reject(reason)
})