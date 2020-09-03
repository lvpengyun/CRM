$(function(){

    let checklist = null;

    //获取部门信息
    initDepartMent();
    async function initDepartMent(){
        let result = await queryDepart();
        if(result.code == 0){
            let str = "";
            result.data.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`;
            });
            $(".selectBox").append(str);
        }
    }

    //展示员工列表
    showUserList();
    async function showUserList(){
        let params = {
            departmentId:$(".selectBox").val(),
            search:$(".searchInp").val().trim()
        }
        let result = await axios.get("/user/list",{params})
        //console.log(result)
        if(result.code !== 0) return;
        let str = "";
        result.data.forEach(element => {
            let{
                id,
                name,
                sex,
                email,
                phone,
                department,
                job,
                desc
            } = element;
            str +=`
            <tr>
<td class="w3"><input type="checkbox" userId="${id}"></td>
<td class="w10">${name}</td>
<td class="w5">${sex==0?'男':'女'}</td>
<td class="w10">${department}</td>
<td class="w10">${job}</td>
<td class="w15">${email}</td>
<td class="w15">${phone}</td>
<td class="w20">${desc}</td>
<td class="w12" userId="${id}">
    <a href="javascript:;">编辑</a>
    <a href="javascript:;">删除</a>
    <a href="javascript:;">重置密码</a>
</td>
</tr>
            `
        });
        $("tbody").html(str)

        checklist = $("tbody").find('input[type = "checkbox"]')
    }

    //根据条件显示员工列表
    searchHandle();
    function searchHandle(){
        $(".selectBox").change(showUserList);
        $(".searchInp").on("keydown",e=>{
            if(e.keyCode === 13){
                showUserList();
            }
        })

    }

    //基于事件委托使用编辑、删除、修改密码   delegate代理
    delegate();
    function delegate(){
        $("tbody").on("click","a",async e=>{
           // console.log(e);
           let target = e.target,
               tag = target.tagName,
               text = target.innerHTML.trim();
            if(tag === "A"){
                let userId = $(target).parent().attr("userid")
                if(text === "编辑"){
                    //console.log("编辑")
                    window.location.href = `useradd.html?id=${userId}`
                    //console.log(window.location.href+"----------")
                    return;
                }
                if(text === "删除"){
                    //console.log("删除")
                    let flag = confirm("你确定要删除此用户么？");
                    if(!flag) return;
                    let result = await axios.get("/user/delete",{
                        params:{userId}
                    })
                    if(result.code === 0){
                        alert("删除用户信息~");
                        $(target).parent().parent().remove();
                        checklist = $("tbody").find('input[type = "checkbox"]')
                        return;
                    }
                    return;
                }
                if(text === "重置密码"){
                    //console.log("重置密码")
                    let flag = confirm("你确定要重置此用户的密码么？")
                    if(!flag) return;
                    let result = await axios.post("/user/resetpassword",{
                        userId
                    })
                    if(result.code === 0){
                        alert("重置密码成功，告诉你的员工~")
                        return;
                    }
                    return;
                }
            }

        })
    }

    //全选处理
    selectHandle();
    function selectHandle(){
        $("#checkAll").click(e=>{
            let checked = $("#checkAll").prop("checked")
            checklist.prop("checked",checked)
        })
    }

    //小框框被全部选中后，全选框自动勾选
    $("tbody").on("click","input",e=>{
        if(e.target.tagName === "INPUT"){
            let flag = true;
            [].forEach.call(checklist,item=>{
                if(!$(item).prop("checked")){
                    flag = false;
                }
            })
            $("#checkAll").prop("checked",flag)
        }
    })

    //批量删除
    $(".deleteAll").click(e=>{
        let arr = [];
        [].forEach.call(checklist,item=>{
            if($(item).prop("checked")){
                //console.log($(item))
                arr.push($(item).attr('userid'))
            }
        })
        //console.log(arr)
        if(arr.length === 0){
            alert("你需要先选中一些用户！")
            return;
        }

        let flag = confirm("你确定要删除这些用户么？")
        if(!flag) return;


        //递归删除

        let index = -1;
        async function deleteUser(){
            let userId = arr[++index];
            if(index>=arr.length){
                alert("成功删除员工~")
                showUserList();
                return;
            }

            let result = await axios.get("/user/delete",{
                params:{
                    userId
                }
            })
            if(result.code!= 0){
                alert("删除失败了")
                return;
            }
            deleteUser();
        }
        deleteUser()
    })
}) 