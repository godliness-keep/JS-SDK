### JS-SDK 框架（JavaScript 部分）

>**JS-SDK 框架（Native 部分）可以帮助快速构建如下两种交互场景：**

- 接收来自 Native 的调用 / 并 return 回 Native 调用者
- 调用 Native 方法 / 并接收来自 Native 方法的 return 

---

JS-SDK 框架（JavaScript 部分）对外提供的 API 如下：
    
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
		}
	}

<font color='#FF0000'>在使用之前需要先初始化通信框架：</font>

	// 初始化之后，便可以正常使用内部功能
	lr.ready()

---


#### 调用 Native 方法 / 并接收来自 Native 方法的 return

JS-SDK 框架（JavaScript 部分）对于 JavaScript 调用 Native 提供了两种不同的实现思路：

- **直接调用 Native 方法**
- **通过事件调用到 Native**

>**两种方式有各自的适用场景，详情请参照《[JS-SDK 框架（Native 部分）](http://note.youdao.com/noteshare?id=267a30a383d878aa0a6b020ef1219dbe)》**

直接调用 Native 方法（callNative）和 通过事件调用到 Native（callEvent） 同样存在如下 4 中场景：

定义事件类型相比扩展 Bridge 更加灵活和方便管理，事件总共划分为以下四种场景：

- **无参无返回值**
- **有参无返回值** （此时通过 callNative 的方式无法获取 Native 的返回值的，callEvent 则允许）
- **无参有返回值**
- **有参有返回值**

##### 1、直接调用 Native 方法


    let params = {
		link: '中国特色社会主义道路',
		age: '人民日益增长的物质文化需求同落后的生产关系之间的矛盾'
	}
	let message = {
		methodName: 'fromJavaScriptWithParamsWithReturn',
		params: params,
		success: function(res) {
			alert('来自 Native 的返回：' + JSON.stringify(res))
	    }
    }
    // 通 callNative 调用Native方法
	lr.callNative(message)
	
也可以添加失败类型的回调，**具体取决于您的业务场景。**

    
    let message = {
        methodName: 'fromJavaScriptWithParamsWithReturn',
        params: params,
        success: function(res) {
            alert('来自 Native 的返回：' + JSON.stringify(res))
		},
		failed:function(res){
			alert('来自 Native 的返回：' + JSON.stringify(res))
		}
    }
    
或者不需要 Native 返回信息

    let message = {
        methodName: 'fromJavaScriptWithParamsWithReturn',
        params:params
    }
    
或者无参类型，**注意无参数类型，此时添加 success 或 failed 无意义，因为该场景无法得到 Native 的 return**，

    let message = {
        methodName: 'fromJavaScriptWithParamsWithReturn',
    }
    
---

##### 2、通过事件调用到 Native

对于上述 4 种场景，事件类型则都可以满足。关于 Native 自定义事件规则请参照《[JS-SDK 框架（Native 部分）](http://note.youdao.com/noteshare?id=267a30a383d878aa0a6b020ef1219dbe)》


    let message = {
        eventName: 'onVoiceRecordEnd',
        params: params,
        success: function(res) {
            alert('来自 Native 的返回：' + JSON.stringify(res))
        },
        failed: function(res) {
            alert('来自 Native 的返回：' + JSON.stringify(res))
        }
	}
	// 通过 callEvent 调用 Native 中自定义事件类型
	lr.callEvent(message)
	
> 通过事件类型最大的区别是要通过 callEvent 发起调用，并且不会受限于 callNative 当无参数类型时无法获取 Native 的 return 的限制。

此时无参数类型，依然可以接收来自 Native 方法的 return:

    let message = {
        eventName: 'onVoiceRecordEnd',
        success: function(res) {
            alert('来自 Native 的返回：' + JSON.stringify(res))
        },
	}
	// 通过 callEvent 调用 Native 中自定义事件类型
	lr.callEvent(message)
    

---

#### 接收来自 Native 的调用 / 并 return 回 Native 调用者

JS-SDK框架（JavaScript 部分）对于 Native 调用 JavaScript 提供了两种不同的实现思路：

- **自定义 JavaScript 方法**
- **自定义事件（JS-SDK框架（JavaScript 部分）暂不支持）**

>**两种方式的具体使用场景，请参照《[JS-SDK 框架（Native 部分）](http://note.youdao.com/noteshare?id=267a30a383d878aa0a6b020ef1219dbe)》。总体来讲自定义 JavaScript 方法存在与 Native 扩展方法类似问题。解决方案是自定义事件类型**

##### 1、自定义 JavaScript 方法

关于自定义方法，大家都非常熟悉，不过多叙述，看示例：

（1）无参无返回值

    /**
     * 无参无返回值
     */
    function callFromNativeNoParamsNoReturn() {
        alert('来自 Native 的调用');
    }
    
（2）含参无返回值

    /**
     * 无参无返回值
     */
    function callFromNativeWithParamsNoReturn(request) {
        var jsonRequest = JSON.parse(request);
        alert('来自 Native 的参数：' + JSON.stringify(jsonRequest.params));
    }
    
（3）无参有返回值（存在与 Native 类似问题，无法响应回 Native）

    function callFromNativeNoParamsWithReturn() {
        alert('来自 Native 的调用'');
        
        // 通过 notifyNative 无法 return 回 Native 调用者
    }
    
（4）含参含返回值

    function callFromNativeWithParamsWithReturn(request) {
        let jsonRequest = JSON.parse(request);
        alert('来自 Native 的参数：' + JSON.stringify(jsonRequest.params));
    
        // 以下 return 回 Native 调用者
        let params = {
            name: '苏佩',
            age: 18,
            sex: 'boy'
        }
        
        let message = {
            id: jsonRequest.id,
            result: {
                state: 1,
                desc: '不说也可以',
                result: params
            }
        }
        // 通过 notifyNative return 回 Native 调用者
        lr.notifyNative(message)
    }
    
> 注意 result 为标准响应格式即：state 状态值，desc 描述状态，result 具体返回内容

> notifyNative 用于 return 回 Native 调用者。

---

##### 2、自定义事件类型

> JavaScript 的事件类型，允许在方法体直接 return 回 Native 调用者。

> 定义 JavaScript 事件类型允许无参场景下 return，相比直接定义 JavaScript 方法更加灵活；每个 JavaScript 事件生命周期将会自动管理，事件将会根据当前页面的生命周期自动销毁。

定义JavaScript事件类型的接收者

    receiver.login = function(params) {
		alert('来自Native的参数: ' + JSON.stringify(params))
			
		// 该return将直接回到Native调用者：Android/iOS	
		return {
		    state: 1,
			desc: '这里返回说明信息',
			result: '这里是具体的内容'
		};
	}
	
	receiver.share = function() {
			
		// 该return将直接回到Native调用者：Android/iOS	
		return {
		    state: 1,
			desc: '这里返回说明信息',
			result: '这里是具体的内容'
		};
	}

> 注意 login/share 为该事件的名称，Native 将会根据该事件名称匹配到目标方法。！目前事件类型暂不支持 callback 操作 ！。

	


