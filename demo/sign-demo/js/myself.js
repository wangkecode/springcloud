// 签字控件集成   stard
let ws;
// 建立webSocket连接
window.onload = function webSocket() {
	"WebSocket" in window ? ws = new WebSocket("ws://127.0.0.1:8802/sign") : alert("浏览器不支持");
	//连接成功建立的回调方法
	ws.onopen = function(event){
		console.log("签字页面建立连接");
		ws.send('{"typeName":"StartSign"}');
		// 注册按钮信息
		let buttonInfo = getButtonsInfo();
		ws.send('{"typeName":"RegisterBtn","message":"'+buttonInfo+'"}');
		var videoAUrl = GetQueryString("name");
		document.getElementById("test").innerHTML=videoAUrl;
	};
	//接收到消息的回调方法
	ws.onmessage = function(event){
		const obj = JSON.parse(event.data);
		/**let {typeName,message,...other} = obj;*/
		switch(obj.typeName){
			case "SignBase64":
				//$("#signImg").attr('src','data:image/png;base64,'+obj.message);
				break;
			case "NextPage":
				window.scrollBy(0,250);
				break;
			case "PrePage":
				window.scrollBy(0,-250);
				break;
			case "BoardHide":
				$("#button_cancel").html("签字");
				break;
			case "BoardShow":
				$("#button_cancel").html("隐藏");
				break;
			default:
				console.log("非签字页面命令不处理");
		}
	};

	//连接关闭的回调方法
	ws.onclose = function(){
		alert("close");
	};
};
		
window.onbeforeunload = function closeWebSocket(){
	ws.send('{"typeName":"Close","message":"Sign"}');
	ws.close();
}
/** 
  * 接请求参数
*/
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null){
		 return  unescape(decodeURI(r[2]));
	 }else{
		return null;
	 }
}
/** 
* 获取签字区域和按钮区域  该方法返回主屏中控件需要用到的btnInfo 值
*/	
function getButtonsInfo(){
	const button_up = document.getElementById("button_up").getBoundingClientRect();
	const button_down = document.getElementById("button_down").getBoundingClientRect();
	const button_cancel = document.getElementById("button_cancel").getBoundingClientRect();
	
	const upInfo = getButRect("200", button_up);
	const downInfo = getButRect("201", button_down);
	const cancelInfo = getButRect("100", button_cancel);

	console.log(upInfo+downInfo+cancelInfo);  
	return upInfo+downInfo+cancelInfo;
};
function getButRect(rectName,dom){
	let rectInfo;
	rectInfo = dom.top;
	rectInfo += '@' + dom.left;
	rectInfo += '@' + dom.bottom;
	rectInfo += '@' + dom.right;
	rectInfo += '@' + rectName;
	return rectInfo + '@';	
};
// 签字控件集成   end