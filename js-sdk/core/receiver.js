let receiverManager = (function() {

	let events = {}
	let lifecycles = {}

	function addEventInternal(eventName) {
		events[eventName] = document;
	}

	function addLifecycleInternal(eventName, event) {
		if (lifecycles[document] == null) {
			lifecycles[document] = {}
		}
		let eventMap = lifecycles[document]
		eventMap[eventName] = event
	}

	function dispatchReceiverInternal(request) {
		let host = events[request.eventName];
		let eventMap = lifecycles[host];
		let targetMethod = eventMap[request.eventName];
		let targetResult;
		if (targetMethod.length > 0) {
			targetResult = targetMethod(request.params);
		} else {
			targetResult = targetMethod();
		}
		if (targetResult != null) {
			let message = {
				id: request.id,
				result: targetResult
			}
			lr.notifyNative(message);
		}
	}

	function removeLifecycleInternal(host) {
		let eventMap = lifecycles[host]
		if (eventMap != null) {
			for (key in eventMap) {
				delete events[key]
			}
			delete lifecycles[host]
		}
	}

	return {

		/**
		 * @param {string} eventName 事件名称
		 * */
		addEvent: function(eventName) {
			addEventInternal(eventName)
		},

		/**
		 * @param {string} eventName 事件名称
		 * @param {function} event 事件
		 * */
		addLifecycle: function(eventName, event) {
			addLifecycleInternal(eventName, event)
		},

		/**
		 * @param {object} request 来自Native的请求体
		 * */
		dispatchReceiver: function(request) {
			dispatchReceiverInternal(request)
		},

		/**
		 * @param {object} host 事件宿主
		 * */
		removeLifecycle: function(host) {
			removeLifecycleInternal(host)
		}
	}
})()

let receiver = new Proxy(receiverManager, {

	set: function(target, key, value) {
		if (typeof value === 'function') {
			target.addEvent(key);
			target.addLifecycle(key, value);
		} else {
			throw 'The property \'' + key + '\' must function type'
		}
	}
});

