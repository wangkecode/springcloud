let cameraIndex,compress;
let cameraIsOpen = false;

/**
* 打开摄像头
*/
function openCamera(){
	if(cameraIsOpen){
		sendMessage("CloseDevice",cameraIndex);
		document.getElementById("autoCrop").checked = false;
		cameraIsOpen = false;
		videoImg.src="app/images/watingOpenDevice2.jpg";
		$("#cameID").html("打开摄像头");
	}else{	
		$("#img").attr("style", "width:auto");
		document.getElementById("img").src="app/images/watingOpen2.jpg";
		sendMessage("OpenDevice",cameraIndex); // A 拍素材  B 拍人像
		cameraIsOpen = true;
		$("#cameID").html("关闭摄像头");
	}
}

/**
* 拍照
*/
let papersCame = ()=> {
	cameraIsOpen ? sendMessage("Photograph",compress) : 0;
}

/**
*旋转摄像头
*/
let RotateLeft = () =>{
    let x = 90; // 旋转角度
	"A" == cameraIndex ? sendMessage("VideoAngleA",x) : sendMessage("VideoAngleB",x);
}

/**
* 切换摄像头 并关闭已打开的摄像头
*/
function radioChange(e){
	cameraIndex = e.value;
	if(cameraIsOpen){
		videoImg.src="app/images/watingOpenDevice2.jpg";
	    sendMessage("GetResolutionList",cameraIndex); // 获取对应摄像头分辨率
		cameraIsOpen = false;
		openCamera();
	}
}
/**
* 设置分辨率列表
*/
let setResolution = (resolutionInfo) =>{
	let resolutionList = resolutionInfo.split("@");
	let selectLabel = document.getElementById("resolution");
	for(let openVal of resolutionList){
		let optionInfo =  new Option(openVal,openVal);
		openVal == "640*480" ? optionInfo.selected="selected" : 0;
		selectLabel.options.add(optionInfo);
	}
}

/**
* 改变分辨率
*/
function resolutionChange(){
	let index = document.getElementById("resolution").selectedIndex;
	let selectVal = document.getElementById("resolution").options[index].value;
	sendMessage("SetResolution"+cameraIndex,selectVal);  // 设置分辨率
}

/**
* 设置素材拍摄是否自动裁剪
*/
let autoCropChange =(e) =>{
	if("A" == cameraIndex){
		if($(e).is(":checked")){  
		    sendMessage("AutoCrop",1);
		}else{
			sendMessage("AutoCrop",0);
		}
	}
};

/**
* 是否压缩
*/
function compressChange(e){
	$(e).is(":checked")? compress=1 : compress=0;
};

/**
*  放大/缩小
*/
function changeZoom(zoom){
	$("#img").attr("style", "width:"+img.width*zoom+"px");
}


/**
* 截图
*/
function screen(){
	sendMessage("Screenshot");
}