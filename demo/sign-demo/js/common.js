
//根据key拿到汉字
 function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).map(key => {
    if (datas[key].dictCode === "" + value) {
      actions.push(datas[key].dictValue);
      return false;
    }
  });
  return actions.join("");
}

 function selectDictLabels(datas, value) {
  if (value !== null && value !== "" && value !== undefined) {
    var actions = [];
    var arry = [];
    arry = value.split(",");
    Object.keys(datas).map(key => {
      for (let j = 0; j < arry.length; j++) {
        if (datas[key].dictCode === "" + arry[j]) {
          actions.push(datas[key].dictValue + " , ");
          return false;
        }
      }
    });

    return actions.join("");
  }
}


//根据人员类别获取图片
//图片字段路径 汉字名称
 function getPhoto(datas, n, msgData) {
  if (datas !== null && datas !== "" && datas !== undefined) {
    var arr = [];
    arr = datas.split(",");
    for (let j = 0; j < arr.length; j++) {
      if ("" !== arr[j] && null !== arr[j]) {
        var src = 'http://10.221.2.93:7899/'+ arr[j];
        var name = n;
        var pData = { name, src };
        msgData.push(pData);
      }
    }
    return msgData;
  }
}
//获取已经上传的多少张照片
 function getImgNum(data) {
  let i=0;
  if(data==null || data==''){
    return i;
  }else{
    let arr =data.split(",");
    for(let x=0;x<arr.length;x++){
      if(arr[x]!=null && arr[x]!=''){
        i++
      }
    }
  }
  return i;
}