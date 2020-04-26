var wx = (function() {

	function addMethod(methodName) {
		wx[methodName] = eval(methodName)
	}
	/**
	 * 分享微博
	 * @param {string} message.title - 分享标题.
	 * @param {string} message.desc - 分享描述.
	 * @param {string} message.link - 分享地址.
	 * @param {string} message.imgUrl - 分享图标.
	 * @param {function} message.success 成功回调.
	 * @param {function} message.cancel 取消回调.
	 */
	function onMenuShareWeibo(message) {
		var params = {
			title: message.title,
			desc: message.desc,
			link: message.link,
			imgUrl: message.imgUrl
		}

		let request = {
			methodName: 'onMenuShareWeibo',
			params: params,
			success: message.success,
			failed: message.cancel
		}

		lr.callNative(request);
	}

	/**
	 * 分享QQzone
	 * @param {string} message.title - 分享标题.
	 * @param {string} message.desc - 分享描述.
	 * @param {string} message.link - 分享地址.
	 * @param {string} message.imgUrl - 分享图标.
	 * @param {function} message.success 成功回调.
	 * @param {function} message.cancel 取消回调.
	 */
	function onMenuShareQZone(message) {
		var params = {
			title: message.title,
			desc: message.desc,
			link: message.link,
			imgUrl: message.imgUrl
		}
		let request = {
			methodName: 'onMenuShareQZone',
			params: params,
			success: message.success,
			failed: message.cancel
		}

		lr.callNative(request);
	}

	//---------------------------------------------------------------------------
	//file

	/**
	 * 选择图片
	 * @param {string} message.count - 选择图片数量 默认9.
	 * @param {array} message.sizeType - 可以指定是原图还是压缩图，默认二者都有 ['original', 'compressed'].
	 * @param {array} message.sourceType - 可以指定来源是相册还是相机，默认二者都有 ['album', 'camera'].
	 */
	function chooseImage(message) {
		var params = {
			count: message.count,
			sizeType: message.sizeType,
			sourceType: message.sourceType,
		}
		let request = {
			methodName: 'chooseImage',
			params: params,
			success: function(res) {
				let result = {
					localIds: res.result
				}
				message.success(result)
			}
		}
		lr.callNative(request);
	}

	/**
	 * 预览图片接口
	 * @param {string} message.current - 选择图片数量 默认9.
	 * @param {Array} message.urls - 可以指定是原图还是压缩图，默认二者都有 ['original', 'compressed'].
	 */
	function previewImage(message) {
		var params = {
			current: message.current,
			urls: message.urls
		}
		let request = {
			methodName: 'previewImage',
			params: params
		}
		lr.callNative(request);
	}

	/**
	 * 上传图片接口
	 * @param {string} message.localId - 需要上传的图片的本地ID，由chooseImage接口获得.
	 * @param {Array} message.isShowProgressTips - 默认为1，显示进度提示.
	 */
	function uploadImage(message) {
		let params = {
			localId: message.localId,
			isShowProgressTips: message.isShowProgressTips,
		}

		let request = {
			methodName: 'uploadImage',
			params: params,
			success: function(res) {
				let result = {
					serverId: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	}

	/**
	 * 下载图片接口
	 * @param {string} message.serverId - 需要下载的图片的服务器端ID，由uploadImage接口获得.
	 * @param {Array} message.isShowProgressTips - 默认为1，显示进度提示.
	 */
	function downloadImage(message) {
		var params = {
			serverId: message.serverId,
			isShowProgressTips: message.isShowProgressTips,
		}
		let request = {
			methodName: 'downloadImage',
			params: params,
			success: function(res) {
				let result = {
					localId: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	};

	/**
	 * 获取本地图片接口
	 * @param {string} message.localId - 图片的localID.
	 */
	function getLocalImgData(message) {
		var params = {
			localId: message.localId
		}
		let request = {
			methodName: 'getLocalImgData',
			params: params,
			success: function(res) {
				let result = {
					localData: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	};

	//---------------------------------------------------------------------------
	//录音
	function startRecord(message) {
		let request = {
			methodName: 'startRecord'
		}

		lr.callNative(request);
	}

	// 暂停录音
	function stopRecord(message) {
		let request = {
			methodName: 'stopRecord',
			success: function(res) {
				let result = {
					localId: res.result
				}
				message.success(result);
			}
		}

		lr.callNative(request);
	}

	// 自动停止录音
	// 录音时间超过一分钟没有停止的时候会执行 complete 回调
	function onVoiceRecordEnd(message) {
		let request = {
			methodName: 'onVoiceRecordEnd',
			success: function(res) {
				let result = {
					localId: res.result
				}
				message.complete(result);
			}
		}
		lr.callNative(request);
	}

	// 需要播放的音频的本地ID，由stopRecord接口获得
	function playVoice(message) {

		var params = {
			localId: message.localId
		}
		let request = {
			methodName: 'playVoice',
			params: params
		}
		lr.callNative(request);
	}

	// 需要暂停的音频的本地ID，由stopRecord接口获得
	function pauseVoice(message) {

		var params = {
			localId: message.localId
		}
		let request = {
			methodName: 'pauseVoice',
			params: params
		}
		lr.callNative(request);
	}

	// 停止播放接口
	// 需要停止的音频的本地ID，由stopRecord接口获得
	function stopVoice(message) {

		var params = {
			localId: message.localId
		}
		let request = {
			methodName: 'stopVoice',
			params: params
		}
		lr.callNative(request);
	}

	// 监听语音播放完毕接口
	function onVoicePlayEnd(message) {
		let request = {
			methodName: 'onVoicePlayEnd',
			success: function(res) {
				let result = {
					localId: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	}

	// 上传语音接口
	function uploadVoice(message) {

		var params = {
			localId: message.localId,
			isShowProgressTips: message.isShowProgressTips
		}
		let request = {
			methodName: 'uploadVoice',
			params: params,
			success: function(res) {
				let result = {
					serverId: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	}

	// 下载语音接口
	function downloadVoice(message) {

		var params = {
			serverId: message.serverId,
			isShowProgressTips: message.isShowProgressTips
		}
		let request = {
			methodName: 'downloadVoice',
			params: params,
			success: function(res) {
				let result = {
					localId: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	}

	//识别音频并返回识别结果接口
	function translateVoice(message) {
		var params = {
			localId: message.localId,
			isShowProgressTips: message.isShowProgressTips
		}
		let request = {
			methodName: 'translateVoice',
			params: params,
			success: function(res) {
				let result = {
					translateResult: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	}

	//-----------------------------------------------------------------------------------------------------------

	//设备信息

	//获取网络状态
	function getNetworkType(message) {
		let request = {
			methodName: 'getNetworkType',
			success: function(res) {
				let result = {
					networkType: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	}


	//-----------------------------------------------------------------------------------------------------------

	//地理位置
	/**
	 * 使用微信内置地图查看位置接口
	 * @param {string} message.latitude - 纬度，浮点数，范围为90 ~ -90.
	 * @param {string} message.longitude - 经度，浮点数，范围为180 ~ -180.
	 * @param {string} message.name - 位置名.
	 * @param {string} message.address - 地址详情说明.
	 * @param {function} message.scale 地图缩放级别,整形值,范围从1~28。默认为最大.
	 * @param {function} message.infoUrl 在查看位置界面底部显示的超链接,可点击跳转.
	 */
	function openLocation(message) {
		var params = {
			latitude: message.latitude,
			longitude: message.longitude,
			name: message.name,
			address: message.address,
			scale: message.scale,
			infoUrl: message.infoUrl
		}
		let request = {
			methodName: 'openLocation',
			params: params
		}
		lr.callNative(request);
	}


	/**
	 * 获取地理位置接口
	 * @param {string} message.type - 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'.
	 */
	function getLocation(message) {

		var params = {
			type: message.type
		}
		let request = {
			methodName: 'getLocation',
			params: params,
			success: function(res) {
				message.success(res.result);
			}
		}
		lr.callNative(request);
	}

	//-------------------------------------------------------------------------------------------------------
	//微信摇一摇

	//开启查找周边ibeacon设备接口
	function startSearchBeacons(message) {

		var params = {
			ticket: message.ticket
		}
		let request = {
			methodName: 'startSearchBeacons',
			params: params,
			success: function(res) {
				message.complete(res.result);
			}
		}
		lr.callNative(request);
	}
	//关闭查找周边ibeacon设备接口
	function stopSearchBeacons(message) {

		let request = {
			methodName: 'stopSearchBeacons',
			success: function(res) {
				message.complete(res.result);
			}
		}
		lr.callNative(request);
	}

	//监听周边ibeacon设备接口
	function onSearchBeacons(message) {

		let request = {
			methodName: 'onSearchBeacons',
			success: function(res) {
				message.complete(res.result);
			}
		}
		lr.callNative(request);
	}
	//-----------------------------------------------------------------------------------------------------------

	//界面操作
	//关闭当前网页窗口接口
	function closeWindow(message) {
		let request = {
			methodName: 'closeWindow'
		}
		lr.callNative(request);
	}

	//批量隐藏功能按钮接口
	function hideMenuItems(message) {

		var params = {
			menuList: message.menuList
		}
		let request = {
			methodName: 'hideMenuItems',
			params: params
		}
		lr.callNative(request);
	}

	//批量显示功能按钮接口
	function showMenuItems(message) {

		var params = {
			menuList: message.menuList
		}
		let request = {
			methodName: 'showMenuItems',
			params: params
		}
		lr.callNative(request);
	}

	//隐藏所有非基础按钮接口
	function hideAllNonBaseMenuItem(message) {
		let request = {
			methodName: 'hideAllNonBaseMenuItem'
		}
		lr.callNative(request);
	}

	//显示所有功能按钮接口
	function showAllNonBaseMenuItem(message) {
		let request = {
			methodName: 'showAllNonBaseMenuItem'
		}
		lr.callNative(request);
	}

	//----------------------------------------------------------------------------------------------

	//扫一扫
	//调起微信扫一扫接口
	function scanQRCode(message) {

		var params = {
			needResult: message.needResult,
			scanType: message.scanType
		}
		let request = {
			methodName: 'scanQRCode',
			params: params,
			success: function(res) {
				let result = {
					resultStr: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	}

	//---------------------------------------------------------------------------------------------------

	//跳转微信商品页接口
	function openProductSpecificView(message) {
		var params = {
			productId: message.productId,
			viewType: message.viewType
		}
		let request = {
			methodName: 'openProductSpecificView',
			params: params
		}
		lr.callNative(request);
	}

	//拉取适用卡券列表并获取用户选择信息
	function chooseCard(message) {
		var params = {
			shopId: message.shopId,
			cardType: message.cardType,
			cardId: message.cardId,
			timestamp: message.timestamp,
			nonceStr: message.nonceStr,
			signType: message.signType,
			cardSign: message.cardSign
		}
		let request = {
			methodName: 'chooseCard',
			params: params,
			success: function(res) {
				let result = {
					cardList: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	}

	/** 批量添加卡券接口
	 *
	 */
	function addCard(message) {
		var params = {
			cardList: message.cardList
		}
		let request = {
			methodName: 'addCard',
			params: params,
			success: function(res) {
				let result = {
					cardList: res.result
				}
				message.success(result);
			}
		}
		lr.callNative(request);
	}


	/** 查看微信卡包中的卡券接口
	 *
	 */
	function openCard(message) {
		var params = {
			cardList: message.cardList
		}
		let request = {
			methodName: 'openCard',
			params: params
		}
		lr.callNative(request);
	}


	//-------------------------------------------------------------------------------------------

	/**
	 * 微信支付
	 * @param {string} message.timestamp - 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符.
	 * @param {string} message.nonceStr - 支付签名随机串，不长于 32 位.
	 * @param {string} message.package - 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）.
	 * @param {string} message.signType - 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'.
	 * @param {function} message.signType 支付签名.
	 */
	function chooseWXPay(message) {
		var params = {
			timestamp: message.timestamp,
			nonceStr: message.nonceStr,
			package: message.package,
			signType: message.signType,
			paySign: message.paySign
		}
		let request = {
			methodName: 'chooseWXPay',
			params: params,
			success: function(res) {
				message.success(res.result);
			}
		}
		lr.callNative(request);
	}

	//----------------------------------------------------------------------------------------------
	/** 共享收货地址接口
	 *
	 */
	function openAddress(message) {
		let request = {
			methodName: 'openAddress',
			success: function(res) {
				message.success(res.result);
			}
		}
		lr.callNative(request);
	}

	return {

		config: function(message) {
			if (message.debug !== 'undefined') {
				var params = {
					debug: message.debug
				}
				let request = {
					methodName: 'config',
					params: params
				}
				lr.callNative(request)
			}

			var list = message.methodList;
			for (var i = 0; i < list.length; i++) {
				addMethod(list[i]);
			}
			wx.ready()
		},

		/**
		 * 通过ready接口处理成功验证
		 * @param {objct} message - 不用处理.
		 */
		ready: function(message) {

			if (typeof message == 'function') {
				message()
			}
		},

		/**
		 * 通过error接口处理失败验证
		 * @param {objct} message - 不用处理.
		 */
		error: function(message) {

		}
	}
})()
