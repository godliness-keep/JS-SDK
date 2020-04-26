var lr = (function() {

    const JAVASCRIPT_CALL_FINISHED = 'onJavaScriptCallFinished'
    const CALL_NATIVE_FROM_JAVASCRIPT = 'callNativeFromJavaScript'

	let RESULT_OK = 1

	let jsVersion = 1
	let jsCallbacks = {}
	let jsCallbackCurrentId = -1

	function callNativeInternal(mapObject, message) {
		let hasParams = (message.params != null || message.eventName != null)
		let request
		if (hasParams) {
			request = packageRequest(message)
		}

		if (isAndroid()) {
			sendToAndroid(mapObject, message.methodName, request)
		} else if (isIos()) {
			sendToiOS(mapObject, message.methodName, request)
		} else {
			alert('Unknown platform');
		}
	}

	function callEventInternal(mapObject, message) {
		message.methodName = CALL_NATIVE_FROM_JAVASCRIPT
		callNativeInternal(mapObject, message)
	}

	function notifyNativeInternal(mapObject, message) {
		let response = {
			version: jsVersion,
			id: message.id,
			result: message.result
		}
		if (isAndroid) {
			sendToAndroid(mapObject, JAVASCRIPT_CALL_FINISHED, response)
		} else if (isIos) {
			sendToiOS(mapObject, JAVASCRIPT_CALL_FINISHED, response)
		} else {
			alert('Unknown platform');
		}
	}

	function onNativeCallFinished(response) {
		let responseJson
		if (typeof response === 'object' && response != null) {
			responseJson = response;
		} else {
			responseJson = JSON.parse(response);
		}
		let protocolId = responseJson.id;
		let protocolVersion = responseJson.version;

		let callbacks = jsCallbacks[protocolId];
		let result = responseJson.result;
		if (result.state == RESULT_OK) {
			let successCallback = callbacks.successCallback;
			if (successCallback.length > 0) {
				successCallback(result)
			} else {
				successCallback();
			}
		} else {
			let failedCallback = callbacks.failedCallback;
			if (failedCallback.length > 0) {
				failedCallback(result);
			} else {
				failedCallback();
			}
		}
		delete jsCallbacks[protocolId];
	}

	function sendToAndroid(mapObject, methodName, request) {
		if (request != null) {
			mapObject[methodName](JSON.stringify(request))
		} else {
			mapObject[methodName]()
		}
	}

	function sendToiOS(methodName, request) {
		if (request != null) {
			webkit.messageHandlers[methodName].postMessage(JSON.stringify(request));
		} else {
			webkit.messageHandlers[methodName].postMessage();
		}
	}

	function packageRequest(message) {
		let request = {
			version: jsVersion,
			eventName: message.eventName,
			params: message.params
		}
		if ((message.success != null && typeof message.success === 'function') ||
			(message.failed != null) && typeof message.failed === 'function') {
			request.id = jsCallbackCurrentId++
			jsCallbacks[request.id] = {
				successCallback: message.success,
				failedCallback: message.failed
			}
		}
		return request
	}

	function addMethod(object, name, fn) {
		var old = object[name];
		object[name] = function() {
			if (fn.length === arguments.length) {
				return fn.apply(this, arguments);
			} else if (typeof old === 'function') {
				return old.apply(this, arguments);
			}
		}
	}

	return {

		ready: function() {
			/**
			 * @param {string} message.methodName - Native 方法名称，必填
			 * @param {object} message.params - Native 方法参数，选填（无参类型方法）
			 * @param {function} message.success - Native 回调（成功回调，取决于业务）选填
			 * @param {failed} message.failed - Native 回调（失败回调，取决于业务）选填
			 * */
			addMethod(lr, 'callNative', function(message) {
				lr.callNative(lrBridge, message)
			})

			/**
			 * @param {object} mapObject 来自原生的映射对象（Android可能会需要，iOS在使用WkWebView时则不需要）
			 * @param {object} message 参照上面方法message
			 * */
			addMethod(lr, 'callNative', function(mapObject, message) {
				callNativeInternal(mapObject, message)
			})

			/**
			 * @param {string} message.eventName - Native 事件名称，必填
			 * @param {object} message.params - Native 事件方法参数，选填（无参数类型）
			 * @param {function} message.success - Native 回调（成功回调，取决于业务）选填
			 * @param {function} message.failed - Native 回调（失败回调，取决于业务）选填
			 * */
			addMethod(lr, 'callEvent', function(message) {
				lr.callEvent(lrBridge, message)
			})

			/**
			 * @param {object} mapObject 来自原生的映射对象（Android可能会需要，iOS在使用WkWebView时则不需要）
			 * @param {object} message 参照上面方法message
			 * */
			addMethod(lr, 'callEvent', function(mapObject, message) {
				callEventInternal(mapObject, message)
			})

			/**
			 * @param {int} message.id - Native 回调id，必填
			 * @param {object} message.result - 返回值，选填
			 * 	{
			 * 		@param {int} message.result.state - 状态，必填
			 * 		@param {string} message.result.desc - 说明，必填
			 * 		@param {object} message.result.result - 返回参数，必填
			 * 	}
			 * */
			addMethod(lr, 'notifyNative', function(message) {
				lr.notifyNative(lrBridge, message)
			})

			/**
			 * @param {object} mapObject 来自原生的映射对象（Android可能会需要，iOS在使用WkWebView时则不需要）
			 * @param {object} message 参照上面方法message
			 * */
			addMethod(lr, 'notifyNative', function(mapObject, message) {
				notifyNativeInternal(mapObject, message)
			})
		},

		dispatchCallNativeCallback: function(response) {
			onNativeCallFinished(response)
		}
	}
})()

/**
 * 接收来自Native的通知, Native返回Response
 * */
function onNativeCallFinished(response) {
	lr.dispatchCallNativeCallback(response)
}

/**
 * 接收来自Native的事件调用
 * */
function callJavaScriptFromNative(request) {
	receiverManager.dispatchReceiver(JSON.parse(request))
}
