    $(document).ready(function() {
        // 关闭内推
        // $('#closeTencentModal').modal('show');
        // $("#closeTencentModal").on('hide.bs.modal', function(e) {
        //     window.location.href = "https://wxdut.com";
        //     return false;
        // });
        // return;

        AV.init('2nXbFYzdoqj5FAx7hfCQC0qy-gzGzoHsz', '16nEBcbmAC9UrosE0jFJ7AtK');

        $('#confirm-commit-btn').click(function(event) {
            $('#modal').modal('hide');
            window.location.href = "https://wxdut.com";
        });
        $('#send-sms-code-btn').click(function(event) {
            if (!check_form()) {
                return;
            }
            $('#phone').prop('disabled', true);
            sms_code_countdown();

            AV.Cloud.requestSmsCode({
                mobilePhoneNumber: $('#selectpicker').val() + $.trim($('#phone').val()),
                name: '腾讯内推',
                ttl: 2                     // 验证码有效时间为 2 分钟
            }).then(function(){
                alert("验证码发送成功");
            }, function(err){
                console.log(err.message);
                alert("验证码发送失败，请重试");
            });
            // $.ajax({
            //     url: 'https://wxdut.com/index.php/tencent/sendSmsCode',
            //     type: "GET",
            //     data: { "phone": $.trim($('#phone').val()), "countryCode": $('#selectpicker').val().substring($('#selectpicker').val().indexOf("+") + 1) },
            //     success: function(data) {
            //         if (data.ret == 0) {
            //             alert("验证码发送成功");
            //         } else {
            //             alert("验证码发送失败，请重试");
            //         }
            //     }
            // })
        });

        var countryCodeStr = "";
        $.getJSON('https://cdn.wxdut.com/asset/data/country_code.json', function(json, textStatus) {
            $.each(json, function(index, val) {
                countryStr = val['en'] + " " + val['zh'] + " +" + val['code'];
                if (val['code'] == 86) {
                    countryCodeStr += "<option data-tokens='" + countryStr + "' selected >" + countryStr + "</option>";
                } else {
                    countryCodeStr += "<option data-tokens='" + countryStr + "'>" + countryStr + "</option>";
                }
                $("#selectpicker").html("");
                $('#selectpicker').append(countryCodeStr);
                $('select[name=selValue]').val(2);
                $('#selectpicker').selectpicker('refresh');
            });
        });

    });
    (function() {
        'use strict';
        $('form').submit(function(event) {
            if (!check_form()) {
                return false;
            }
            if (!check_verify_code()) {
                alert("请输入六位数字验证码");
                return false;
            }
            AV.Cloud.run('offer-commit', {
                phone: $.trim($('#phone').val()),
                code: $.trim($('#verify-code').val()),
                name: $.trim($('#name').val()),
                email: $.trim($('#email').val()),
                school: $.trim($('#school').val()),
                major: $.trim($('#major').val()),
                countryCode: $('#selectpicker').val()
            }).then(function () {
                $('#modal').modal('show');
            }, function (err) {
                console.log(err.message);
                alert("验证码错误，请重试");
            });
            // $.ajax({
            //     url: 'https://wxdut.com/index.php/tencent/verifySmsCode',
            //     type: 'GET',
            //     data: { "phone": $.trim($('#phone').val()), "code": $.trim($('#verify-code').val()),
            //         "name": $.trim($('#name').val()), "email": $.trim($('#email').val()), "school": $.trim($('#school').val()),
            //         "major": $.trim($('#major').val()), "countryCode": $('#selectpicker').val().substring($('#selectpicker').val().indexOf("+") + 1) },
            //     success: function(data) {
            //         if (data.ret == 0) {
            //             $('#modal').modal('show');
            //         } else {
            //             alert("验证码错误，请重试");
            //         }
            //     }
            // })
            return false;
        });
    })();

    function check_form() {
        if (!check_name()) {
            alert("请输入正确的姓名");
            return false;
        }
        if (!check_email()) {
            alert("请输入正确的邮箱");
            return false;
        }
        if (!check_phone()) {
            alert("请输入正确的手机号");
            return false;
        }
        if (!check_school()) {
            alert("请输入正确的学校");
            return false;
        }
        if (!check_major()) {
            alert("请输入正确的专业");
            return false;
        }
        if (!check_agreement()) {
            alert("请阅读并同意内推协议");
            return false;
        }
        return true;
    }

    function check_phone() {
        return $.trim($('#phone').val() != "");
    }

    function check_name() {
        return /^[\u4E00-\u9FA5]{1,6}$/.test($.trim($('#name').val()));
    }

    function check_email() {
        var reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        return $.trim($('#email').val()).match(reg);
    }

    function check_school() {
        return $.trim($('#school').val()).length != 0;
    }

    function check_major() {
        return $.trim($('#major').val()).length != 0;
    }

    function check_agreement() {
        return $('#agreement').prop('checked');
    }

    function check_verify_code() {
        return /^[0-9]{6}$/.test($.trim($('#verify-code').val()))
    }

    function sms_code_countdown() {
        var second = 60;
        var timer = setInterval(function() {
            second -= 1;
            if (second > 0) {
                $('#send-sms-code-btn').prop('disabled', true);
                $('#send-sms-code-btn').text(second + "秒后重新发送");
            } else {
                clearInterval(timer);
                $('#send-sms-code-btn').text("发送验证码");
                $('#send-sms-code-btn').prop('disabled', false);
            }
        }, 1000);
    }
