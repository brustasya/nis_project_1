const appCode = "domplace";
var photoes = []

start();

function start() 
{
  log(" ".repeat(tab*level++) + "start()"); 
//-------------------------------------------------------------------------------------
  doc.getElementById("saveTripName").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.saveTripName.onclick");
      
      saveTripName();
      
      level--;
    };

//-------------------------------------------------------------------------------------	
  doc.getElementById("saveThingList").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.saveThingList.onclick");
      
      saveThingList();
      hideThingListForTrip();
      
      level--;
    };

//-------------------------------------------------------------------------------------
  doc.getElementById("showThingListForTrip").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.showThingListForTrip.onclick");
      
      let isWithEdit = false;
      showThingListForTrip(isWithEdit);
      
      level--;
    }; 
   
  doc.getElementById("showThingListForTripWithEdit").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.showThingListForTrip.onclick");
      
      let isWithEdit = true;
      showThingListForTrip(isWithEdit);
      
      level--;
    }; 
    
  doc.getElementById("hideThingListForTrip").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.hideThingListForTrip.onclick");
      
      hideThingListForTrip();
      
      level--;
    };
    
  doc.getElementById("clearCollectThingList").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.clearCollectThingList.onclick");
      
      if (askUser("Снять отметку «Собрал» со всех вещей?"))
      {
        clearCollectThingList();
        hideThingListForTrip();
        showThingListForTrip();
      }
      
      level--;
    }; 
	
//-------------------------------------------------------------------------------------	
	
  doc.getElementById("savePlaceList").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.savePlaceList.onclick");
      
      savePlaceList();
      hidePlaceListForTrip();
      
      level--;
    };
		
//--------------------------------------------------------------------------------------
  doc.getElementById("download").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.download.onclick");
      
      let fileName = doc.getElementById("fileName").value;
      write("fileName", fileName);
      downloadLocalStorage(fileName);
      
      level--;
    };
  doc.getElementById("upload").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.upload.onclick");

      uploadLocalStorage(start);
      
      level--;
    };
    
//-------------------------------------------------------------------------------------

	doc.getElementById("showPlaceListForTrip").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.showPlaceListForTrip.onclick");
      
      let isWithEdit = false;
      showPlaceListForTrip(isWithEdit);
      
      level--;
    }; 
	
	doc.getElementById("showPlaceListForTripWithEdit").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.showPlaceListForTrip.onclick");
      
      let isWithEdit = true;
      showPlaceListForTrip(isWithEdit);
      
      level--;
    }; 
    
    doc.getElementById("hidePlaceListForTrip").onclick = 
    function()
    {
      log(" ".repeat(tab*level++) + "button.hidePlaceListForTrip.onclick");
      
      hidePlaceListForTrip();
      
      level--;
    };
	
	doc.getElementById("addDescr").onclick = 
	function()
    {
      log(" ".repeat(tab*level++) + "button.addDescr.onclick");
      
      addDescriptionsToPlaceList();
      
      level--;
    };
//-------------------------------------------------------------------------------------
  loadThingList();
  hideThingListForTrip();
  
  loadPlaceList();
  hidePlaceListForTrip();
  
  //loadPhotoes();
  
  setFileName();
  
  level--;
}

//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

function saveThingList()
{
  log(" ".repeat(tab*level++) + "saveThingList()");
  
  let textAreaElem;
  textAreaElem = doc.getElementById("thingList");
  write("thingList", textAreaElem.value);
  
  level--;
}

function saveTripName()
{
  log(" ".repeat(tab*level++) + "saveTripName()");
  
  let scopeNameElem;
  scopeNameElem = doc.getElementById("scopeName");
  write("scopeName", scopeNameElem.value);
  
  level--;
}

function setThingList(thingList)
{
  log(" ".repeat(tab*level++) + "setThingList()");
  
  let elemThingList = doc.getElementById("thingList");
  elemThingList.value = thingList;
  
  level--;
}

//-------------------------------------------------------------------------------------

function showThingListForTrip(isWithEdit = false)
{
  log(" ".repeat(tab*level++) + "showThingListForTrip(isWithEdit = " + isWithEdit + ")"); 
  
  let thingListInfo = getThingListInfo();
  let {length, thing, descr, collect, collectLength} = thingListInfo;
  if (length)
  {
    let template, section, table, tr, th, td, bttn;
    section = doc.getElementById("thingListToCollect");
    template = doc.getElementById("thingListToCollectTemplate");
    section.innerHTML = template.innerHTML;

    table = doc.getElementById("thingListToCollectTable");
    if (!isWithEdit)
    {
      doc.getElementById("thSaveDescription").remove();
      doc.getElementById("tdSaveDescription").remove();
    }
    let rowTemplate = doc.getElementById("trThing");
    rowTemplate.remove();

    for(let i = 0; i < length; i++)
    {
      if (!collect.includes(thing[i]))
      {
        table.appendChild(rowTemplate.cloneNode(true));
		
        let trThing = doc.getElementById("trThing");
        let tdThing = doc.getElementById("tdThing");
        let buttonCollect = doc.getElementById("btnCollect");
        let thing_i = thing[i];
        let scopeName = read("scopeName");
		
        trThing.id = "row" + i;
        tdThing.id = "thing" + i;
        tdThing.setAttribute("data-thing", thing_i);
        tdThing.innerHTML = thing_i;
        
        buttonCollect.id = "btnCollect" + i;
        buttonCollect.onclick = buttonCollectThingOnClick;
		
        if (isWithEdit)
        {
          let buttonSaveDescription = doc.getElementById("btnSaveDescription");
		  
          buttonSaveDescription.id = "btnSaveDescription" + i;
          buttonSaveDescription.onclick = buttonSaveDescriptionOnClick;
          tdThing.setAttribute("contenteditable", "");
        }
      }
    }
    refreshStat(length, collectLength);
    
	//-------------------------------------------------------------------------------------
    doc.getElementById("downloadThingListXLS").onclick = 
      function()
      {
        log(" ".repeat(tab*level++) + "button.downloadThingListXLS.onclick");
        
        let fileName = doc.getElementById("fileName").value;
        write("fileName", fileName);
        downloadThingListXLS(fileName);
        
        level--;
      }; 
	//-------------------------------------------------------------------------------------
  }
  
  level--;
  return {length, thing, descr, collect, collectLength};
}

function hideThingListForTrip()
{
  log(" ".repeat(tab*level++) + "hideThingListForTrip()");
  
  let section = doc.getElementById("thingListToCollect");
  section.innerHTML = "";
  
  level--;
}

function clearCollectThingList()
{
  let collectThingList = getRemeberThingList();
  let thingList = getThingListInfo().thing;
  for(let thing of thingList)
  {
    if (thingList.includes(thing))
    {
      collectThingList.splice(collectThingList.indexOf(thing), 1);
    }
  }
  write("collectThingList", collectThingList.join("\n"));
}

function getThingListInfo()
{  
  let thingListStr = read("thingList");
  let thingList = (thingListStr ? thingListStr.split("\n") : []);
  let length = Math.floor(thingList.length);
  let collectThingList = getRemeberThingList();
  let thing = [];
  let collect = [];
  let descr = [];
  
  for (let row of thingList) 
  {
	  thing.push(row);
      if (collectThingList.includes(row))
      {
        collect.push(row);
      }
  }
  
  let collectLength = collect.length;
  
  return {length, thing, descr, collect, collectLength};
}

function getRemeberThingList()
{  
  let collectThingListStr = read("collectThingList");
  let collectThingList = (collectThingListStr ? collectThingListStr.split("\n") : []);
  
  return collectThingList;
}

//-------------------------------------------------------------------------------------
function downloadThingListXLS(fileName = "thing_list")
{
  log(" ".repeat(tab*level++) + "downloadThingListXLS(" + fileName + ")");

  let tableElem = doc.getElementById("thingListToCollectTable").cloneNode(true);
  if (tableElem)
  {
    let tdList = tableElem.querySelectorAll(".control");
    for(let td of tdList)
    {
      td.parentNode.removeChild(td);  
    }
    removeAllAttributes(tableElem.querySelectorAll("tr, td, th"));
    exportTableToExcel(tableElem, getFileName(fileName, "xls"), (fileName || "thingList"));
  }

  level--;
}

//-------------------------------------------------------------------------------------

function buttonCollectThingOnClick(e)
{
  log(" ".repeat(tab*level++) + "button.collectThing.onclick");
  
  let rowId = e.target.id.replace("btnCollect", "row");
  let rowElem = doc.getElementById(rowId);
  
  let thingId = e.target.id.replace("btnCollect", "thing");
  let tdThing = doc.getElementById(thingId);
  
  collectThing(tdThing.getAttribute("data-thing"));
  
  rowElem.remove();
  
  refreshStat();
  
  level--;
}

function collectThing(thing)
{
  log(" ".repeat(tab*level++) + "collectThing(" + thing + ")");
  
  let collectThingList = getRemeberThingList();
  if (!collectThingList.includes(thing))
  {
    collectThingList.push(thing);
  }
  write("collectThingList", collectThingList.join("\n"));
  
  level--;
}

//-------------------------------------------------------------------------------------
function buttonSaveDescriptionOnClick(e)
{
  log(" ".repeat(tab*level++) + "button.buttonSaveDescriptionOnClick.onclick");
  
  let thingId = e.target.id.replace("btnSaveDescription", "thing");
  let tdThing = doc.getElementById(thingId);
  
  //let descrId = e.target.id.replace("btnSaveDescription", "descr");
  //let tdDescr = doc.getElementById(descrId);
  
  let thing = tdThing.getAttribute("data-thing");
  let description = tdThing.innerText;
  
  saveDescription(thing, description);
  
  level--;
}

function saveDescription(thing, description)
{
  log(" ".repeat(tab*level++) + "saveDescription(thing, description)");
  
  let thingListStr = getThingList();
  thingList = thingListStr.split("\n");
  
  let thingIndex = thingList.indexOf(thing);
  
  if (thingIndex >= 0)
  {
    thingList[thingIndex] = description.replaceAll("\n", " ");
  }
  
  thingListStr = thingList.join("\n");
  setThingList(thingListStr);
  saveThingList();
  

  level--;
}
//-------------------------------------------------------------------------------------

function refreshStat(thingAmo, thingCollectAmo)
{
  log(" ".repeat(tab*level++) + "refreshStat(thingAmo = " + thingAmo + ", thingCollectAmo = " + thingCollectAmo + ")"); 
  
  let elem, thingCollectPerc = 0, thingNotCollectPerc = 0;
  elem = doc.getElementById("thingAmo");
  if (elem) 
  {
    if (thingAmo === undefined)
    {
      thingAmo = Number(elem.innerHTML);
    }
    else
    {
      elem.innerHTML = thingAmo;
    }
  }
  elem = doc.getElementById("thingCollectAmo");
  if (elem) 
  {
    if (thingCollectAmo === undefined)
    {
      thingCollectAmo = Number(elem.innerHTML);
      thingCollectAmo++;
    }
    elem.innerHTML = thingCollectAmo;
  }
  elem = doc.getElementById("thingNotCollectAmo");
  if (elem) 
  {
    elem.innerHTML = thingAmo - thingCollectAmo;
  }
  
  thingNotCollectPerc = ((thingAmo - thingCollectAmo) * 100 / thingAmo).toFixed(0);
  thingCollectPerc = 100 - thingNotCollectPerc;
  
  elem = doc.getElementById("thingCollectPerc");
  if (elem) 
  {
    elem.innerHTML = thingCollectPerc;
  }
  
  elem = doc.getElementById("thingNotCollectPerc");
  if (elem) 
  {
    elem.innerHTML = thingNotCollectPerc;
  }
  
  elem = doc.getElementById("thingCollectPercMeter");
  if (elem) 
  {
    elem.value = thingCollectPerc;
  }
  
  level--;
}

//-------------------------------------------------------------------------------------

function loadThingList() 
{
  log(" ".repeat(tab*level++) + "loadThingList()"); 
  
  let textAreaElem;
  textAreaElem = doc.getElementById("thingList");
  textAreaElem.value = read("thingList");
  
  let scopeNameElem;
  scopeNameElem = doc.getElementById("scopeName");
  scopeNameElem.value = read("scopeName");
  
  level--;
}

function getThingList()
{
  log(" ".repeat(tab*level++) + "getThingList()");
  
  let textAreaElem;
  textAreaElem = doc.getElementById("thingList");

  level--;
  
  return textAreaElem.value;
}

//-------------------------------------------------------------------------------------

function savePlaceList()
{
  log(" ".repeat(tab*level++) + "savePlaceList()");
  
  let textAreaElem;
  textAreaElem = doc.getElementById("placeList");
  write("placeList", textAreaElem.value);
  
  level--;
}


function setPlaceList(placeList)
{
  log(" ".repeat(tab*level++) + "setPlaceList()");
  
  let elemPlaceList = doc.getElementById("placeList");
  elemPlaceList.value = placeList;
  
  level--;
}

//-------------------------------------------------------------------------------------

function loadPlaceList() 
{
  log(" ".repeat(tab*level++) + "loadPlaceList()"); 
  
  let textAreaElem;
  textAreaElem = doc.getElementById("placeList");
  textAreaElem.value = read("placeList");
  
  level--;
}

function getPlaceList()
{
  log(" ".repeat(tab*level++) + "getPlaceList()");
  
  let textAreaElem;
  textAreaElem = doc.getElementById("placeList");

  level--;
  
  return textAreaElem.value;
}

//-------------------------------------------------------------------------------------

function showPlaceListForTrip(isWithEdit = false)
{
  log(" ".repeat(tab*level++) + "showPlaceListForTrip(isWithEdit = " + isWithEdit + ")"); 
  
  let placeListInfo = getPlaceListInfo();
  let {length, place, descr} = placeListInfo;
  if (length)
  {
    let template, section, table, tr, th, td, bttn;
    section = doc.getElementById("placeListForTrip");
    template = doc.getElementById("placeListForTripTemplate");
    section.innerHTML = template.innerHTML;

    table = doc.getElementById("placeListForTripTable");
    if (!isWithEdit)
    {
      doc.getElementById("thSaveDescr").remove();
      doc.getElementById("tdSaveDescr").remove();
    }
	
    let rowTemplate = doc.getElementById("trPlace");
    rowTemplate.remove();

    for(let i = 0; i < length; i++)
    {
      
        table.appendChild(rowTemplate.cloneNode(true));
        let trPlace = doc.getElementById("trPlace");
        let tdName = doc.getElementById("tdName");
        
		
        let tdDescr = doc.getElementById("tdDescr");
        let place_i = place[i];
        let descr_i = descr[i];
        let scopeName = read("scopeName");
		
        trPlace.id = "row" + i;
        tdName.id = "place" + i;
        tdName.setAttribute("data-place", place_i);
        tdName.innerHTML = place_i;
			       
        tdDescr.id = "descr" + i;
        tdDescr.innerHTML = descr_i;
		
        if (isWithEdit)
        {
          let buttonSaveDescription = doc.getElementById("btnSaveDescr");
          buttonSaveDescription.id = "btnSaveDescr" + i;
          buttonSaveDescription.onclick = buttonSaveDescrOnClick;
          tdDescr.setAttribute("contenteditable", "");
        }
    }
	
	
    doc.getElementById("downloadPlaceListXLS").onclick = 
      function()
      {
        log(" ".repeat(tab*level++) + "button.downloadPlaceListXLS.onclick");
        
        let fileName = doc.getElementById("fileName").value;
        write("fileName", fileName);
        downloadPlaceListXLS(fileName);
        
        level--;
      }; 
  }
  
  level--;
  return {length, place, descr};
}

//-------------------------------------------------------------------------------------

function getPlaceListInfo()
{  
  let placeListStr = read("placeList");
  let placeList = (placeListStr ? placeListStr.split("\n") : []);
  let length = Math.floor(placeList.length / 2);

  let place = [];
  let descr = [];
  
  for (let row of placeList)
  {
    if (place.length > descr.length)
    {
      descr.push(row);
    }
    else
    {
      place.push(row);
    }
  }
  
  return {length, place, descr};
}

//-------------------------------------------------------------------------------------

function buttonSaveDescrOnClick(e)
{
  log(" ".repeat(tab*level++) + "button.buttonSaveDescrOnClick.onclick");
  
  let placeId = e.target.id.replace("btnSaveDescr", "place");
  let tdPlace = doc.getElementById(placeId);
	  
  let descrId = e.target.id.replace("btnSaveDescr", "descr");
  let tdDescr = doc.getElementById(descrId);
	  
  let place = tdPlace.getAttribute("data-place");
  let description = tdDescr.innerText;
	  
  saveDescr(place, description);
	  
  level--;
}

function saveDescr(place, description)
{
	log(" ".repeat(tab*level++) + "saveDescr(place, description)");
	  
	let placeListStr = getPlaceList();
	placeList = placeListStr.split("\n");
		  
	let placeIndex = placeList.indexOf(place);
		  
	if (placeIndex >= 0)
	{
		placeList[placeIndex + 1] = description.replaceAll("\n", " ");
	}
		  
	placeListStr = placeList.join("\n");
	setPlaceList(placeListStr);
	savePlaceList();
		  
	level--;
}


//-------------------------------------------------------------------------------------

function downloadPlaceListXLS(fileName = "place_list")
{
  log(" ".repeat(tab*level++) + "downloadPlaceListXLS(" + fileName + ")");

  let tableElem = doc.getElementById("placeListForTripTable").cloneNode(true);
  if (tableElem)
  {
    let tdList = tableElem.querySelectorAll(".control");
    for(let td of tdList)
    {
      td.parentNode.removeChild(td);  
    }
    removeAllAttributes(tableElem.querySelectorAll("tr, td, th"));
    exportTableToExcel(tableElem, getFileName(fileName, "xls"), (fileName || "placeList"));
  }

  level--;
}


function hidePlaceListForTrip()
{
  log(" ".repeat(tab*level++) + "hidePlaceListForTrip()");
  
  let section = doc.getElementById("placeListForTrip");
  section.innerHTML = "";
  
  level--;
}


function addDescriptionsToPlaceList()
{
  log(" ".repeat(tab*level++) + "addDescriptionsToPlaceList()");
  
  
  if (askUser("Добавить в список достопримечательносте после каждой строки строку с пустым описанием?"))
  {
    let placeListStr = getPlaceList();
    let placeList = placeListStr.split("\n");
    placeList = placeList.map(v => [v, ""]).flat();
    setPlaceList(placeList.join("\n"));
  }
  
  level--;
}

function handleFiles(files) {

	for (let i = 0; i < files.length; i++) {

		const img = document.createElement("img");
		let scr = URL.createObjectURL(files[i]);
		img.src = scr;
		
		img.style.maxHeight = '100px';

		img.onload = function() {

			URL.revokeObjectURL(this.src);

		}
		document.getElementById("photoes").appendChild(img);	
		//photoes.push(getBase64Image(img));
	}
	//savePhotoes();
}

/*function loadPhotoes() {
	log(" ".repeat(tab*level++) + "loadPhotoes()"); 
  
	photoes = read("photoes").split("\n");
	
	for (let photo of photoes)
	{
		const img = document.createElement("img");
		img.src = "data:image/png;base64," + photo;
		img.style.maxHeight = '100px';

		img.onload = function() {

			URL.revokeObjectURL(this.src);

		}
		
		document.getElementById("photoes").appendChild(img);
	}
}


function savePhotoes()
{
  log(" ".repeat(tab*level++) + "savePhotoes()");
  
  var str = "";
  for (let photo of photoes)
  {
	  str += photo + "\n";
  }
  write("photoes", photoes);
  
  level--;
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}*/

