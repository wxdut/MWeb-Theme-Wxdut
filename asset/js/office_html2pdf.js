
$uploadToken = '';
$uploadRandom = '';
$progressToken = false;

$uploadFile = '';
$progressUpload = false;

$retFileKey = '';
$retEmail = '';

$aping = false;

$(document).ready(function () {
    stepToken();
});

function stepToken() {
    if ($uploadToken.length > 0) {
        console.log("already got token");
        return;
    }
    $progressToken = true;
    $.get("https://qcloud.wxdut.com/index.php/api/uploadtoken", function (data) {
        $uploadToken = data['upToken'];
        $uploadRandom = data['randomStr'];
        $progressToken = false;
        checkQueue();
    });
}

function stepUpload() {
    if (!$uploadFile) {
        console.log("no file to upload");
        return;
    }
    if ($progressToken || $uploadToken.length == 0) {
        console.log("wait for token");
        return;
    }
    if ($progressUpload) {
        console.log("already one upload task in process");
        return;
    }
    if ($retFileKey.length > 0) {
        console.log("already upload ok");
        return;
    }
    $progressUpload = true;
    $('#inputGroupLabel01').text($uploadFile.name);
    let config = {
        useCdnDomain: true // 使用cdn加速
    };
    // https://developer.qiniu.com/kodo/sdk/1283/javascript
    let observable = qiniu.upload($uploadFile, $uploadRandom + "/" + $uploadFile.name, $uploadToken, {}, config);
    let observer = {
        next(res) {
            console.log(res);
            $progressUpload = false;
        },
        error(err) {
            alert("上传失败，请重试（" + err.code + ":" + err.message + "）");
            console.log(err);
            $progressUpload = false;
            onFinish(false);
        },
        complete(res) {
            console.log(res);
            $retFileKey = res.key;
            $progressUpload = false;
            checkQueue();
        }
    };
    observable.subscribe(observer); // 上传开始
}

function handleFiles(files) {
    if (!files || files.length == 0) {
        console.error("empty files");
        return;
    }
    if (files[0].size > 1024 * 1024 * 4) {
        alert("所选文件太大，请选择小于4M的文件。");
        return;
    }
    $uploadFile = files[0];
    stepUpload();
}

function check_email(email) {
    let reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return $.trim(email).match(reg);
}

function onSubmit() {
    const file = $('#inputGroupFile01')[0].files[0];
    if (!file || file.name.length == 0) {
        alert("请先选择要转换的HTML文件。");
        return false;
    }
    let email = $('#exampleInputEmail1').val();
    if (!check_email(email)) {
        alert("请输入正确的邮箱。");
        return false;
    }
    $retEmail = email;
    checkQueue();

    $('#exampleInputEmail1').prop('disabled', true);
    $('#commit-normal').hide();
    $('#commit-loading').show();

    return false;
}

function api() {
    $aping = true;
    $.post("https://qcloud.wxdut.com/index.php/api/html2pdf", {
        email: $retEmail,
        url: "https://qiniu.wxdut.com/" + $retFileKey
    }, function (data) {
        console.log(data);
        if (data && data['success'] === true) {
            alert("任务提交成功，系统会把转码后的PDF文件发送到你填写的邮箱中。");
        } else {
            alert("哇哦，出错了，请重试。");
        }
        onFinish(true);
    }, "json");
}

function checkQueue() {
    if ($uploadToken.length == 0) {
        stepToken();
        return;
    } else if ($retFileKey.length == 0) {
        stepUpload();
        return;
    } else if ($retEmail.length == 0) {
        return;
    }
    else if ($aping == false) {
        api();
        return;
    }
}

function onFinish($success) {
    window.location.reload();
}