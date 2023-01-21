const log = console.log;
const warn = console.warn;
const info = console.info;
const error = console.error;
const debug = console.debug;
const doc = document;
const tab = 4; 
let level = 0; 

function write(name, value, prefix = appCode)
{
  localStorage.setItem(prefix + (prefix ? "_" : "") + name, value);
  return value;
}

function read(name, prefix = appCode)
{
  let value = localStorage.getItem(prefix + (prefix ? "_" : "") + name);
  return value;
}

function clear(prefix = appCode)
{
  if (prefix)
  {
    for(let name in localStorage)
    {
      if (name.split("_")[0] === prefix)
      {
        localStorage.removeItem(name);
      }
    }
  }
  else
  {
    localStorage.clear();
  }
}

function askUser(question)
{
  return confirm(question);
}

function setFileName(prefix = appCode)
{
  log(" ".repeat(tab*level++) + "setFileName()");
  
  let fileName = read("fileName");
  fileName = fileName || (prefix + (prefix && "_") + "data");
  let elem = doc.getElementById("fileName");
  if (elem)
  {
    elem.value = fileName;
  }
  
  level--;
}

function getYMD(date = (new Date()), sep = "")
{
  let year, month, day, YMD;
  year = String(date.getFullYear());
  month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + String(month);
  day = date.getDate();
  day = (day < 10 ? "0" : "") + String(day);
  YMD = year + sep + month + sep + day;
  return YMD;
}


function getHMS(date = (new Date()), sep = "")
{
  let hours, minutes, seconds, HMS;
  hours = date.getHours();
  hours = (hours < 10 ? "0" : "") + String(date.getHours());
  minutes = date.getMinutes();
  minutes = (minutes < 10 ? "0" : "") + String(minutes);
  seconds = date.getSeconds();
  seconds = (seconds < 10 ? "0" : "") + String(seconds);
  HMS = hours + sep + minutes + sep + seconds;
  return HMS;
}


function getFileName(fileName, ext, prefix = appCode)
{
  let date = new Date();
  let suffix = getYMD(date) + "_" + getHMS(date);
  return (fileName || (prefix + "_data")) + "_" + suffix + "." + ext;
}

function downloadLocalStorage(fileName, prefix = appCode) 
{
  log(" ".repeat(tab*level++) + "downloadLocalStorage( prefix =", prefix, ")");
  
  let obj = {};
  for(let name in localStorage)
  {
    if (name.split("_")[0] === prefix)
    {
      obj[name] = localStorage.getItem(name);
    }
  }
  let str = JSON.stringify(obj);
  let file = new Blob([str], {type: 'application/json'});
  
  
  let url = URL.createObjectURL(file);
  //fileName = (fileName || (prefix + "_data")) + "_" + suffix + ".json";
  fileName = getFileName(fileName, "json");
  
  downloadFile(url, fileName);
  
  level--; 
}

function downloadFile(url, fileName)
{
  let a = doc.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}


function uploadLocalStorage(callBackFunction = null, prefix = appCode)
{
  log(" ".repeat(tab*level++) + "uploadLocalStorage()");
  let levelTmp = level;
  
  let fileReader = new FileReader();
  let inputFile = doc.createElement("input");
  inputFile.setAttribute("type", "file");
  inputFile.addEventListener('change', 
    function inputFileOnChange(e)
    {
      let files = event.target.files;
      let file = files[0];
      fileReader.readAsText(file);
      fileReader.addEventListener('load', 
        function fileReaderOnLoad(e)
        {
          if (askUser("Загрузить данные из файла " + file.name + "?"))
          {  
            let str = fileReader.result;
            let obj = JSON.parse(str);
            if (prefix)
            {
              clear(prefix);
            }
            //log(obj);
            for(let name in obj)
            {
              let value = obj[name];
              if (value.length <= 2)
              {
                //info(name, "=", value);
              }
              localStorage.setItem(name, value);
            }
            if (typeof callBackFunction === "function")
            {
              level = levelTmp;
              callBackFunction();
            }
          }
        });
  });
  inputFile.click();
  
  level--; 
}

function rnd(min, max, amo = -1, cnst) 
{
  let res, valueList = [], resList = [];
  if (amo == -1)
  {
    res = Math.floor(min + Math.random() * (max + 1 - min));
  }
  else
  {
    for(let i = min; i <= max; i++)
    {
      valueList.push(i);
    }
    //log("amo =", amo, "valueList =", valueList);
    if (amo > valueList.length)
    {
      amo = valueList.length;
    }
    //log("amo =", amo);
    for(let j = 0; j < amo; j++)
    {
      res = rnd(0, valueList.length - 1);
      resList.push(valueList[res]);
      valueList.splice(res, 1);
      //log("resList =", resList, " valueList =", valueList);
    }
    
    if (cnst !== undefined && !resList.includes(cnst))
    {
      let delInd = rnd(0, resList.length - 1);
      resList.splice(delInd, 1, cnst);
    }
    
    res = resList;
  }
  //log(valueList, resList);
  return res;
}

function convertToBase64(str)
{
  let result =  window.btoa(unescape(encodeURIComponent(str)));
  return result;
}

function removeAllAttributes(elemList)
{
  //warn(elemList);
  for(let elem of elemList)
  {
    let attrList = Array.from(elem.attributes);
    if (attrList.length)
    {
      for(let attr of attrList)
      {
        elem.removeAttribute(attr.name);
      }
    }   
  }
}

function getAttributes(elem)
{
  let attrList = Array.from(elem.attributes);
  let attributes = {};
  if (attrList.length)
  {
    for(let attr of attrList)
    {
      attributes[attr.name] = attr.value;
    }
  }
  return attributes;
}
 
function exportTableToExcel(tableElem, fileName, workSheetName = "Worksheet") 
{
  //warn("tableElem.innerHTML =", tableElem.innerHTML);
  let innerHTML = tableElem.innerHTML;
  innerHTML = innerHTML.replaceAll(/(<b>|<\/b>|<mark>|<\/mark>|<font.*?>|<\/font>|<tbody>|<\/tbody>)/g, "");
  innerHTML = innerHTML.replaceAll(/ +\n/g, "\n");
  innerHTML = innerHTML.replaceAll(/\n{2,}/g, "\n");
  let html = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <!--[if gte mso 9]>
    <xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet> 
            <x:Name>${workSheetName}</x:Name>
            <x:WorksheetOptions><x:DisplayGridlines/>
            </x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <meta http-equiv='content-type' content='text/plain; charset=UTF-8'/>
  </head>
  <body>
    <table border="1">${innerHTML}
    </table>
  </body>
</html>`;
  let url = "data:application/vnd.ms-excel;base64," + convertToBase64(html);
  downloadFile(url, fileName);
}

function readURL(url, callBackFunction = null)
{
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = function()
  {       
    let response = xhr.response;
    //console.log(response);
    if (typeof callBackFunction === "function")
    {
      callBackFunction(response);
    }
  }
  xhr.send();
}


function clickUseCase(useCaseNum, useCaseName)
{
  //log(" ".repeat(tab*level++) + "clickUseCase(" + useCaseNum + ")");
  
  let useCaseInfoElem = doc.getElementById("useCaseInfo");
  let scriptC = doc.getElementById("c" + useCaseNum);
  let scriptL = doc.getElementById("l" + useCaseNum);
  if (!scriptL) {scriptL = doc.getElementsByClassName("l" + useCaseNum)[0];}
  let scriptP = doc.getElementById("p" + useCaseNum);
  let tableTemplate = doc.getElementById("useCaseInfoTable");
  
  useCaseInfoElem.innerHTML = tableTemplate.innerHTML;
  let useCaseCaptionElem = doc.getElementById("useCaseCaption");
  useCaseCaptionElem.innerHTML = useCaseName;
  let tdC = doc.getElementById("tdC");
  let tdL = doc.getElementById("tdL");
  let tdP = doc.getElementById("tdP");
  
  if (scriptC)
  {
    tdC.innerHTML = scriptC.outerHTML;
  }
  if (scriptL)
  {
    tdL.innerHTML = scriptL.outerHTML;
  }
  if (scriptP)
  {
    tdP.innerHTML = scriptP.outerHTML;
  }
  
  //level--;
}


function getHash(str) 
{
  let hash = 0;
  let i, chr;
  let len = str.length;
  if (len === 0) return hash;
  for (i = 0; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

function checkPsw(hash, cbf = null, ...params)
{
  let result = false;
  let storageName = "code";
  let psw = sessionStorage.getItem(storageName) || prompt("Введите код доступа:");
  if (hash && psw !== null)
  {
    let hashPsw = getHash(psw);
    if (hashPsw == hash)
    {
      sessionStorage.setItem(storageName, psw);
      result = true; 
    }
  }
  if (result && typeof(cbf) === "function")
  {
    cbf(...params);
  }
  return result;
}


function getStepChart(data, id)
{
  log(" ".repeat(tab*level++) + "getStepChart(data, id)");
  
  let canvas = doc.createElement("canvas");
  let context = canvas.getContext("2d");
  let stepWidth = data.stepWidth || 20;
  let stepHeight = data.stepHeight || 10;
  let minValue = Math.min(...data.stepList);
  let maxValue = data.maxValue || Math.max(...data.stepList);
  let stepCount = data.stepList.length;
  let margin = 10;
  let lineWidth = data.lineWidth || 2;
  let canvasWidth = stepCount * stepWidth + margin * 2;
  let canvasHeight = maxValue * stepHeight + margin * 2; // + stepHeight;
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  if (id) {canvas.id = id;}
  
  for(let x = margin; x <= canvasWidth - margin; x += stepWidth)
  {
    drawLine(x, margin, x, canvasHeight - margin, 1, "silver");
  }
  
  for(let y = margin; y <= canvasHeight - margin; y += stepHeight)
  {
    drawLine(margin, y, canvasWidth - margin, y, 1, "silver");
  }
  
  data.stepList.forEach((value, index, array) =>
  {
    //warn("value =", value, "index =", index, "stepWidth =", stepWidth, "stepHeight =", stepHeight, "value * stepHeight =", value * stepHeight);
    drawLine(index * stepWidth + margin, canvasHeight - value * stepHeight - margin, (index + 1) * stepWidth + margin, canvasHeight - value * stepHeight - margin, lineWidth);
    if (index > 0)
    {
      let delta = 0;
      let valuePrev = array[index - 1];
      if (valuePrev > value)
      {
        delta = lineWidth / 2;
      }
      if (valuePrev < value)
      {
        delta = -lineWidth / 2;
      } 
      let x = index * stepWidth;
      drawLine(x + margin, canvasHeight - value * stepHeight + delta - margin, x + margin, canvasHeight - valuePrev * stepHeight - delta - margin, lineWidth);
    }
  });
  
  function drawLine(xFrom, yFrom, xTo, yTo, width = 1, color = "black")
  {
    context.beginPath();
    context.moveTo(xFrom, yFrom);
    context.lineTo(xTo, yTo);
    context.lineWidth = width;
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
  }
  
  level--;
  
  return canvas;
}


function getTagCloud(tagList, id)
{
  log(" ".repeat(tab*level++) + "getTagCloud(tagList, id)");
  let minValue = Math.min(...Object.values(tagList));
  let maxValue = Math.max(...Object.values(tagList));
  let range = maxValue - minValue;
  let elem = doc.createElement("div");
  if (id) {elem.id = id;}
  let result = "";
  for(let tagName in tagList)
  {
    result += (result && " ") + "<font size='" + getFontSize(tagList[tagName]) + "'>" + tagName + "</font>";
  }
  
  function getFontSize(value)
  {
    let perc = range ? (value - minValue) * 100 / range : 50;
    let fontSize = 1;
    if (perc > 10 && perc <= 30) {fontSize = 2;}
    else if (perc > 30 && perc <= 50) {fontSize = 3;}
    else if (perc > 50 && perc <= 70) {fontSize = 4;}
    else if (perc > 70 && perc < 90) {fontSize = 5;}
    else if (perc >= 90) {fontSize = 6;}
    return fontSize;
  }
  
  elem.innerHTML = result;
  
  level--;
  
  return elem;
}

function deleteAll(prefix = appCode)
{
  log(" ".repeat(tab*level++) + "deleteAll()");
  
  if (prefix) {clear(prefix);}

  level--;
}


function showDialog(dialogId, message)
{
  //log(" ".repeat(tab*level++) + "deleteAll()");
  
  let dialog = doc.getElementById(dialogId);
  if (dialog)
  {
    dialog.innerHTML = "";
    let divForButtonClose = doc.createElement("div");
    divForButtonClose.style.textAlign = "center";
    let buttonClose = doc.createElement("button");
    buttonClose.innerHTML = "Закрыть";
    buttonClose.onclick = function(){this.closest('dialog').open=false;}
    let pForMessage = doc.createElement("p");
    pForMessage.innerHTML = "<b>" + message + "</b>";
    divForButtonClose.append(buttonClose);
    dialog.append(pForMessage, divForButtonClose);
    dialog.open = true;
  }

  //level--;
}



