$(function(){
    //登陆功能
    $(".submit").click(async function(e){
        let account = $(".userName").val().trim()
        let password = $(".userPass").val().trim()
        if(account ==="" || password === ""){
            alert("账号和密码不能为空~");
            return;
        }
        password = md5(password);
        //console.log(account,password)
        //async和await
        let res = await axios.post("/user/login",{account,password})
        //console.log(res)
        // axios.post("/user/login",{
        //     account,
        //     password
        // }).then(res=>{
        //     console.log(res)
        // }).catch(err=>{
        //     console.log(err)
        // })

        if(parseInt(res.code)===0){
            alert("登陆成功！")
            window.location.href="index.html"
            return;
        }
        alert("用户名和密码出错了，请重新输入!")
    })
})