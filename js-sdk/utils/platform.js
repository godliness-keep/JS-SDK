var ua = navigator.userAgent;

function isAndroid() {
	return ua.indexOf('Android') > 0 || ua.indexOf('Linux') > 0;
}

function isIos() {
	return ua.indexOf('iPhone') > -1;
}

function isWechat() {
	if (ua.toLowerCase().indexOf('micromessenger') != -1) {
		return true;
	} else {
		return false;
	}
}

function isPc() {
	var agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
	var flag = true;
	for (var v = 0; v < agents.length; v++) {
		if (ua.indexOf(agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}
