// current src image
current_image = ""

direction_val = {
    'seed':0,
    'age': 0,
    'angle_horizontal': 0,
    'angle_pitch':0,
    'beauty': 0,
    'emotion_angry': 0,
    'emotion_disgust':0,
    'emotion_easy':0,
    'emotion_fear':0,
    'emotion_happy':0,
    'emotion_sad':0,
    'emotion_surprise': 0,
    'eyes_open': 0,
    'face_shape': 0,
    'gender': 0,
    'glasses':0,
    'height': 0,
    'race_black': 0,
    'race_white': 0,
    'race_yellow': 0,
    'smile': 0,
    'width': 0,
}

$(function () {
    var html_str = "";
    $.each(direction_val,function (key,val){

        if(key !== 'seed')
        {
            html_str += '<div style="width:24%; float: left;border-bottom: #1b1e21 dashed;justify-content: center;align-items: center" >\n' +
                '                            <button class="btn-primary" style="margin-left:1%;margin-top:1%;margin-bottom:1%;font-family: 微软雅黑;font-size: large;float: left">'+key+'</button>\n' +
                '                            <input type="number" class="face_param" id='+key+' value='+val+' max="99" min="-99" style="margin-top:1%;margin-bottom:1%;font-family: 微软雅黑;font-size: large;">\n' +
                '                        </div>'
        }

    })
    html_str += '<div style="width:24%; float: left;border-bottom: #1b1e21 dashed;justify-content: center;align-items: center" >\n' +
        '                            <button class="btn-primary" style="margin-left:1%;margin-top:1%;margin-bottom:1%;font-family: 微软雅黑;font-size: large;float: left">seed</button>\n' +
        '                            <input type="number" class="face_param" id="seed" value=0 min="0" max="9999" style="margin-top:1%;margin-bottom:1%;font-family: 微软雅黑;font-size: large;">\n' +
        '                        </div>'
    html_str += '<div style="width:24%; float: left;justify-content: center;align-items: center" >\n' +
        '                                   <button id="image_generate" class="btn-warning" style="margin-left:100%;margin-top:1%;margin-bottom:1%;font-family: 微软雅黑;font-size: x-large;float: left">generate</button>\n' +
        '                                </div>'
    $('#gan-param-set').html(html_str);
    // 加载按键信息
    set_click_response();
    get_base_info();
});


// load src_imgs list
function get_base_info() {
    $.ajax({
        url:"/get_base_info/",
        contentType: "application/json; charset=utf-8",
        type:"GET",
        cache:false,
        success:function(data){
            //每次加载时重置一些参数

            var img_list = data['img_list'];//视频列表
            console.log("imgs",img_list)
            $('#current-image').empty();

            $.each(img_list, function (i, img_name) {
                $("#current-image").append("<option value=" + img_name + ">"+img_name+"</option>");
            });
            $('#current-image').on('change', function(e){
                if (e.originalEvent) {
                    let selected_img = $(this).find("option:selected").val();
                    if(selected_img !== current_image)
                    {
                        var img = new Image()
                        // 改变图片的src
                        img.src = "user_imgs/"+selected_img
                        // 加载完成执行
                        img.onload = function(){
                            $('#user_img').attr("src", "user_imgs/"+selected_img);
                            var windowW = $(window).width()*0.45;//获取当前窗口宽度
                            var windowH = $(window).height()*0.51;//获取当前窗口高度
                            var realWidth = img.width;//获取图片真实宽度
                            var realHeight = img.height;//获取图片真实高度
                            var scale = Math.max(realWidth/windowW,realHeight/windowH);//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
                            console.log(realWidth,realHeight,windowW,windowH,scale)
                            $('#user_img').css({"width":realWidth/scale,"height":realHeight/scale});
                            current_image = selected_img;
                        }

                    }
                    // console.log(current_video);
                }
            });

        },
        error:function(data){
            alert("数据加载出错，请联系管理员！");
            top.location.reload();
        }
    });
}

// 设置各个功能响应
function set_click_response() {
    // ai功能响应
    $('#convert_0').blur().on("click",function () {
        blend_img("0","0");
    });
    $('#convert_1').blur().on("click",function () {
        blend_img("0","1");
    });

    $('#upload_image').blur().on("click",function () {
        upload_image();
    })

    $('#image_generate').blur().on("click",function ()
    {
        generate_image();
    })

}

// blend images
function blend_img(blend_obj,blend_type){
    var post_data = JSON.stringify({
        user_img: current_image,
        fake_img: $('#fake_img').attr("src").replace('fake_imgs/',''),
        blend_obj:blend_obj,
        blend_type:blend_type
    });
    $.ajax({
        url: "/convert_img/",
        type: "POST",
        cache:false,
        data:post_data,
        success: function (data) {
            var blend_img;
            if (blend_type==="0")
                blend_img = "/static/blend_imgs/"+blend_obj+"_" + current_image.replace(".jpeg","").replace(".jpg","").replace(".png","") + "_" +$('#fake_img').attr("src").replace('fake_imgs/','')
            else
                blend_img = "/static/blend_imgs/"+blend_obj+"_" + $('#fake_img').attr("src").replace('fake_imgs/','').replace('.png','') + "_" + current_image.replace(".jpeg","").replace(".jpg","").replace(".png","")+'.png'
            var img = new Image()
            // 改变图片的src
            img.src = blend_img
            // 加载完成执行
            img.onload = function(){
                $('#blend_img').attr("src", blend_img);
                var windowW = $(window).width()*0.45;//获取当前窗口宽度
                var windowH = $(window).height()*0.51;//获取当前窗口高度
                var realWidth = img.width;//获取图片真实宽度
                var realHeight = img.height;//获取图片真实高度
                var scale = Math.max(realWidth/windowW,realHeight/windowH);//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
                console.log(realWidth,realHeight,windowW,windowH,scale)
                $('#blend_img').css({"width":realWidth/scale,"height":realHeight/scale});
            }
            alert("blend success!")
        },
        error: function (data) {
            alert("出现错误，请联系管理员！");
        }
    })
}

// upload images
function upload_image() {
    //首先监听input框的变动，选中一个新的文件会触发change事件
    document.querySelector("#file").addEventListener("change",function () {
        //获取到选中的文件
        var file = document.querySelector("#file").files[0];
        var name = file.name;

        //创建formdata对象
        var formdata = new FormData();
        formdata.append("file",file);
        //创建xhr，使用ajax进行文件上传
        var xhr = new XMLHttpRequest();
        xhr.open("post","/upload_file/");
        //回调
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4 && xhr.status==200){
                alert("上传成功！");
                get_base_info();
            }
        }
        //获取上传的进度
        xhr.upload.onprogress = function (event) {
            if(event.lengthComputable){
                var percent = event.loaded/event.total *100;
                document.querySelector("#up_progress .progress-item").style.width = percent+"%";
            }
        }
        //将formdata上传
        xhr.send(formdata);
    });
}

// generate images
function generate_image(){
    $('.face_param').each(function (){
        direction_val[$(this).attr('id')] = $(this).val()
    })
    var post_data = JSON.stringify(direction_val)
    $.ajax({
        url: "/generate_img/",
        type: "POST",
        cache:false,
        data:post_data,
        success: function (data) {
            var fake_img = "fake_imgs/"
            $.each(direction_val,function (key,val){
                fake_img+=val.toString()
            })
            fake_img += '.png'
            $('#fake_img').attr("src", fake_img);
            var img = new Image()
            // 改变图片的src
            img.src = fake_img
            // 加载完成执行
            img.onload = function(){
                var windowW = $(window).width()*0.45;//获取当前窗口宽度
                var windowH = $(window).height()*0.51;//获取当前窗口高度
                var realWidth = img.width;//获取图片真实宽度
                var realHeight = img.height;//获取图片真实高度
                var scale = Math.max(realWidth/windowW,realHeight/windowH);//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
                // console.log(realWidth,realHeight,windowW,windowH,scale)
                $('#fake_img').css({"width":realWidth/scale,"height":realHeight/scale});
            }
            alert("generate success!")
        },
        error: function (data) {
            alert("出现错误，请联系管理员！");
        }
    })

}