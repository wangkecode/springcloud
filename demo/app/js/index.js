/**兼容IE8 webSocket*/
window.WEB_SOCKET_SWF_LOCATION = "app/js/WebSocketMain.swf";
const WEB_SOCKET_DEBUG = true;

/**
* 建立webSocket连接
*/
window.onload = webSocket = () =>{
    if (location.origin == undefined) {
        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }
    }
	// 建立连接
	"WebSocket" in window ?  websocket = new WebSocket("ws://localhost:8802/pc") :  alert("浏览器不支持");

    //连接成功建立的回调方法
    websocket.onopen = function (event) {
        console.log("PC服务连接已建立");
		cameraIndex = $('input:radio[name="cameras"]:checked').val();
		sendMessage("GetResolutionList",cameraIndex); // 获取对应摄像头分辨率
    };
    //接收到消息的回调方法
    websocket.onmessage = function (event) {
        const obj = JSON.parse(event.data);
		let {typeName,message,...b} = obj;
		switch (typeName){
			case "SignBase64":
				$("#signImg").attr('src', 'data:image/png;base64,' + message);
				$("#signBase64").html(message);
				$("#beginSign").attr("disabled", false);
				$("#beginSign").attr("style", "");
				break;
		    case "IDCardInfo":
			    let {cardaimg,cardfimg,cardbimg,cardhimg,...other} = message[0];
				//$("#cardaImg").attr('src', 'data:image/png;base64,' + cardaimg);  // 正反面
				$("#cardfImg").attr('src', 'data:image/png;base64,' + cardfimg);  // 仅正面
				$("#cardbImg").attr('src', 'data:image/png;base64,' + cardbimg);  // 仅背面
				//$("#cardhImg").attr('src', 'data:image/png;base64,' + cardhimg);  // 单独头像
				break;
			case "DeviceName":
                $("#DeviceInfo").attr("value", message);  // 设备型号：“MCA-HCXY-01B”  空表示设备和程序不匹配
				break;
			case "PhotographBase64":
			    img.src = "data:image/bmp;base64," + message;
			    $("#img").attr("style", "width:auto");
				break;
			case "FrameBase64":
			    if("" != message && cameraIsOpen){
					videoImg.src = "data:image/bmp;base64," + message;
				}
				break;
			case "GetResolutionList":
			    document.getElementById("resolution").innerHTML="";
			    setResolution(message);
				break;
			case "Error":
			    alert("错误信息：" + message);
				break;
			default:
			    console.log("非签字相关命令"+typeName+" 信息："+message);
		}
    };

    //连接关闭的回调方法
    websocket.onclose = function (e) {
		console.log('websocket 断开: ' + e.code + ' reason:' + e.reason + ' wasClean:' + e.wasClean);
		console.log("websocket for pc 连接关闭"); 
    };

    webSocket.onerror = function (e) {
		console.log(e);
	};
};

/**
* 给服务端发送消息
*/
let sendMessage = (typeName,message) => {
	let messageInfo = `{"typeName":"${typeName}","message":"${message}"}`;
	if(websocket.readyState == 1){
	  websocket.send(messageInfo);
	}
}

/**
*签字
*/
let beginSignClick = () =>{
    $("#beginSign").attr("style", "background: #888888;border: 1px solid #888888;");
    $("#beginSign").attr("disabled", "disabled");//禁用input标签
	$("#signImg").attr('src', '');
	$("#signBase64").html('');
	sendMessage("SignUrl","file:///C:/YFSignIDCardServer/demo/app/signDevice.html");
}

/**
* 签字完成断开连接
*/
let endSignClick = () =>{
    sendMessage("Close","All"); // 关闭连接
    window.location.href = "about:blank";
}
/**
* 开始读取身份证信息
*/
const readIDClick =() => sendMessage("StartIDCardInfo");    //开始读取身份证信息

/**
*  获取设备型号
*/
const getDevice =() => sendMessage("GetDeviceName");

/**
* 关闭签字程序
*/
window.onbeforeunload = closeWebSocket =() =>{
    sendMessage("Close","All"); // 关闭所有连接
}
