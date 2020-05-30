$(document).ready(function() {

	$('#timestampInput').on('input',function(e){
    	this.value=this.value.replace(/[^\d]/g,'')
    	refresh()
	});

	$('#timestampSelect').on('change',function(e){
    	refresh()
	});

});

function refresh(argument) {
	$('#timestampOutput').val(calcuate(parseInt($('#timestampInput').val()) * parseInt($('#timestampSelect').val())))
}

function calcuate(time = +new Date()) {
	if (isNaN(time)) {
		return
	}
    var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
    if (isNaN(date.getTime())) {
    	return "Invalid Timestamp"
    }
    return date.toJSON().substr(0, 19).replace('T', ' ');
}