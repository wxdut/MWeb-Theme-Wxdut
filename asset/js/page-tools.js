$(document).ready(function() {

	// 时间戳转换

	$('#timestampInput').on('input',function(e){
    	this.value=this.value.replace(/[^\d]/g,'')
    	refreshTimestrapOutput()
	});

	$('#timestampSelect').on('change',function(e){
    	refreshTimestrapOutput()
	});

	// 大小写转换

	$('#caseInput').on('input',function(e){
		let val = this.value
    	$('#caseUpper').val(val.toUpperCase())
    	$('#caseLower').val(val.toLowerCase())
	});

});

// 时间戳转换

function refreshTimestrapOutput(argument) {
	$('#timestampOutput').val(calcuateTimestamp(parseInt($('#timestampInput').val()) * parseInt($('#timestampSelect').val())))
}

function calcuateTimestamp(time = +new Date()) {
	if (isNaN(time)) {
		return
	}
    var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
    if (isNaN(date.getTime())) {
    	return "Invalid Timestamp"
    }
    return date.toJSON().substr(0, 19).replace('T', ' ');
}