$(function(){
    initDeptAndJob();
    async function initDeptAndJob(){
        let departmentData = await queryDepart();
        let jobData = await queryJob();
        //console.log(departmentData)
        //console.log(jobData)
        if(departmentData.code === 0){
            departmentData = departmentData.data;
            let str = "";
            departmentData.forEach(item => {
                str += `
                <option value="${item.id}">${item.name}</option>
                `
            });
            $(".userdepartment").html(str);
        }
        if(jobData.code === 0){
            jobData = jobData.data;
            let str = "";
            jobData.forEach(item => {
                str += `
                <option value="${item.id}">${item.name}</option>
                `
                $(".userjob").html(str);
            });
        }
    }

    function username(){
        let val = $(".username").val().trim();
        if(val.length === 0){
            $(".spanusername").attr("style","color:red").html("此为必填项~")
            return false;
        }
        if(!/^[\u4e00-\u9fa5]{2,10}$/.test(val)){
            $(".spanusername").attr("style","color:red").html("名字必须是2~10个汉字~")
            return false;
        }
        $(".spanusername").attr("style","color:green").html("姓名ok")
        return true;
    }
    function useremail(){
        let val = $(".useremail").val().trim();
        if(val.length === 0){
            $(".spanuseremail").attr("style","color:red").html("此为必填项~")
            return false;
        }
        if(!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val)){
            $(".spanuseremail").attr("style","color:red").html("请填写正确的邮箱~")
            return false;
        }
        $(".spanuseremail").attr("style","color:green").html("邮箱ok")
        return true;
    }
    function userphone(){
        let val = $(".userphone").val().trim();
        if(val.length === 0){
            $(".spanuserphone").attr("style","color:red").html("此为必填项~")
            return false;
        }
        if(!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(val)){
            $(".spanuserphone").attr("style","color:red").html("请填写正确的手机号~")
            return false;
        }
        $(".spanuserphone").attr("style","color:green").html("手机号ok")
        return true;
    }

    $(".username").blur(username);
    $(".useremail").blur(useremail);
    $(".userphone").blur(userphone);


    $(".submit").click(async function(){
        if(!username() || !useremail() ||!userphone()){
            alert("你填写的数据不合法，请填写合法数据！")
        }

        let params = {
            name:$(".username").val().trim(),
            sex:$("#man").prop("checked")?0 : 1,   //用prop获取checked的值
            email:$(".useremail").val().trim(),
            phone:$(".userphone").val().trim(),
            userdepartmentId:$(".userdepartment").val().trim(),
            jobId:$(".userjob").val().trim(),
            desc:$(".userdesc").val().trim(),
        }
        //console.log(params)

        let result = await axios.post("/user/add",params)
        if(result.code === 0){
            alert("添加员工成功~");
            window.location.href = "userlist.html"
            return;
        }
        alert("网络不给力")
    })
})