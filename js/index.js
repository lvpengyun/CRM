$(function(){
    init();
//发布订阅
    let $plan = $.Callbacks();

    $plan.add((_,baseInfo)=>{
        $(".baseBox>span").html(`你好，${baseInfo.name||''}`)
        $(".baseBox>a").click(async function(){
            let result = await axios.get("/user/signout")
            if(result.code == 0){
                window.location.href = "login.html"
                return;
            }
            alert("网络不给力，稍后再试")
        })
    })
    $plan.add((power)=>{

    })

    async function init(){
        //判断当前用户有没有登陆
        let result = await axios.get("/user/login");
        //console.log(result)
        if(result.code != 0){
            alert("你还没有登陆，请先登录！")
            window.location.href="login.html";
            return; 
        }
        let [power,baseInfo] = await axios.all([
            axios.get("/user/power"),
            axios.get("/user/info"),
        ])

        baseInfo.code === 0 ? baseInfo = baseInfo.data :null;

        $plan.fire(power,baseInfo)
    }
})