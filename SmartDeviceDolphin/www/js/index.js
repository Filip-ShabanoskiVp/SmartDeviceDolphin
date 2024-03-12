/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

var products = [];
var ValueToConfirm = "";
var newProductArray = [];
var locations = [];
var getYear="";
var codeToDelete=undefined;

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    // readFileFromInternalStorage("products");
    // readFileFromInternalStorage("locations");

    btnScanner();  
    searchBtn();
    btnConfirm();


        
}


// document.getElementById('b1').addEventListener('click', function(){
//     alert(1);
//     window.fileChooser.open(function(uri) {
//         window.FilePath.resolveNativePath(uri, function(filePath) {
//             alert(filePath);
//             var filename = filePath.split('/').pop();
//             alert(2);
//             alert(filename);
//           }, function(error){
//             console.log("Error resolving native path: ", error);
//             alert("Error resolving native path: " + JSON.stringify(error));
//           });
//     }, function(error){
//         console.log("Error selecting file: ", error);
//         alert("Error selecting file: " + JSON.stringify(error));
//     });
//     alert(3);
// }, function(error){
//     console.log("Error adding event listener: ", error);
//     alert("Error adding event listener: " + JSON.stringify(error));
// });

function btnScanner(){
    let btn = document.getElementById('btnScan');
    btn.addEventListener('click',scan,false)
}



function scan(){
    cordova.plugins.barcodeScanner.scan(
             function (result) {
                if(!result.cancelled)
                {
                    document.getElementById('result').innerText = "";

                    // if(result.format == "QR_CODE")
                    // {
                       var value = result.text;
                       productExists(value);
                    // }
                }
            }, function () {
                document.getElementById("alertScanner").style.display = "block";
                document.getElementById('ReviewsNew').style.display = "none";
                document.getElementById("menuToShow").style.display = "none";
                document.getElementById("homePage").style.display = "none";
                document.getElementById('myBody').style.backgroundColor = "#a6a6a6";
                
            }
    );  
 }

document.getElementById('closeScanError').addEventListener('click',function(){

    document.getElementById("alertScanner").style.display = "none";
    document.getElementById("menuToShow").style.display = "block";
    document.getElementById("homePage").style.display = "block";
    document.getElementById('myBody').style.backgroundColor = "white";
},false)





 function productExists(value){
    // globalThis.ValueToConfirm = "";
    if(globalThis.products.length<=0){

        document.getElementById('result').innerHTML = `<p style='color:red'>Немате 
        вчитано листа на основни сретства, пред да започнете со попис морате да вчитате
        шифри на основни сретства !</p>`;
        document.getElementById("btnInsertNew").style.opacity = 0.5;
        document.getElementById("btnInsertNew").disabled = true;  
        document.getElementById('barkod').value = ""
    } else if(globalThis.locations.length<=0) {
        document.getElementById('result').innerHTML = `<p style='color:red'>Немате 
        вчитано листа на локации, пред да започнете со попис морате да вчитате
        шифри на локациите !</p>`;
        document.getElementById("btnInsertNew").style.opacity = 0.5;
        document.getElementById("btnInsertNew").disabled = true;  
        document.getElementById('barkod').value = ""
    }
    else if(globalThis.products.filter(p=>p.barcode==value)!=""){
        if(globalThis.newProductArray.filter(p=>p.barcode==value)!="")
        {
            document.getElementById('barkod').value = ""
            document.getElementById('result').innerHTML = `<p style='color:blue'>Ова основно средство е веќе 
            внесено во попис, не може да се повторуваат средствата!</p>`;   
            return;  
        }
        globalThis.ValueToConfirm = value;
        document.getElementById('btnConfirm').disabled = false;  
        document.getElementById('btnConfirm').style.opacity = 1;
        document.getElementById("btnInsertNew").disabled = true;   
        document.getElementById("btnInsertNew").style.opacity = 0.5;  
        document.getElementById('barkod').value = ""  
        document.getElementById('result').innerHTML = "Пронајдено, Баркод: " + value +"<br/>" 
        + ", Назив: "+ globalThis.products.filter(p=>p.barcode==value).map(function(p){
            return p.name;
        }) + ", Шифра на локација: " + globalThis.products.filter(p=>p.barcode==value).map(function(p){
            return p.codeLocation;
        }) + ", Назив на локација: " +  globalThis.products.filter(p=>p.barcode==value).map(function(p){
            return globalThis.locations.find(location=>location.code==p.codeLocation).name;
        })
    }else {
        globalThis.ValueToConfirm = value;
        document.getElementById('barkod').value = value;
        document.getElementById('shifra').value = value;
        document.getElementById('btnConfirm').disabled = true;
        document.getElementById("btnInsertNew").disabled = false;
        document.getElementById("btnInsertNew").style.opacity = 1;
        document.getElementById("btnConfirm").style.opacity = 0.5;
        document.getElementById('result').innerHTML = "<p style='color:red'>Основнот средство, " + value +
         ", не е пронајдено или не постои. Побарајте консултација, или внесете го како ново !</p>"
    }
 }


function searchBtn(){
    document.getElementById('result').innerText = "";
    let btn = document.getElementById('btnSearch');
    btn.addEventListener('click',Search,false)
}

function Search(){
    var value = document.getElementById('barkod').value;
    if(value!="")
    {
        productExists(value);
    }else{
        document.getElementById('result').innerText = "";
        document.getElementById('barkod').value = ""
    }
}


function readFileFromInternalStorage(type) {
    var path = "";
    var fileName = "";
    if(type=='products') {
        path = "www/Popis_Shifrarnik_2024.txt";
        fileName = "Popis_Shifrarnik_2024.txt";
    } else {
        path = "www/Lokacii_2024.txt";
        fileName = "Lokacii_2024.txt";
    }
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory
     + path,function(fileEntry){
        fileEntry.file(function (file) {
            if(file.type === "text/plain"){
                var reader = new FileReader();
                reader.onloadend = function (evt) {
    
                    var content = this.result;

                    var fileContent = new Uint8Array(evt.target.result);

                    var isUTF8 = isUTF8Encoded(fileContent);  
                    
                    if(type=='products'){ 
                         globalThis.products=[];
                    }else {
                          globalThis.locations=[];
                    }
                    if(isUTF8){

                    content  = new TextDecoder("utf-8").decode(content);

                    var lines = content.split('\n');

                    lines.forEach(function (line) {
                        line = line.trim();

                        if(type=='products'){ 
                            if(/^[^;]+;[^;]+;[^;]+;[^;]+;$/.test(line)){
                                line = line.split(";");
                            if(line[2]!=undefined){
                            globalThis.products.push({
                                code: line[0],
                                barcode: line[1],
                                name: line[2],
                                codeLocation: line[3]
                            });
                        }
                      }
                    } else {
                        if(/^[^;]+;[^;]+$/.test(line)){
                            line = line.split(";");
                            // if(line[1]!="..."){
                                globalThis.locations.push({
                                    code: line[0],
                                    name: line[1],
                                });
                            // }
                         }
                    }
                })

                if(type=='products'){
                    globalThis.getYear = fileName.substring(fileName.lastIndexOf("_")+1,fileName.lastIndexOf("."));
                    document.getElementById('result').innerHTML = ""; 
                    document.getElementById('result').innerHTML =
                    "<p style='color:green'>Успечно вчитан фајл од средства од  "+ globalThis.getYear +" година</p>";
                }else{
                    globalThis.getYear = fileName.substring(fileName.lastIndexOf("_")+1,fileName.lastIndexOf("."));
                    document.getElementById('result').innerHTML = ""; 
                    document.getElementById('result').innerHTML = 
                    "<p style='color:green'>Успечно вчитан фајл од локации од "+ globalThis.getYear +" година</p>";
                }
            }else{
                if(type=='products'){
                    document.getElementById("btnInsertNew").style.opacity = 0.5;
                    document.getElementById("btnInsertNew").disabled = true; 
    
                    globalThis.products=[];
                } else {
                    globalThis.locations=[];
                }
                document.getElementById('result').innerHTML = 
                `<p style='color:red'>Неуспешен вчитан формат на фајл</p>`;
                 return;
                }
            }
        }else{

            if(type=='products'){
                document.getElementById("btnInsertNew").style.opacity = 0.5;
                document.getElementById("btnInsertNew").disabled = true; 
    
                globalThis.products=[];
                document.getElementById('result').innerHTML = 
                "<p style='color:red'>Неуспешно вчитан фајл од средства</p>"; 
            } else{
                globalThis.locations=[];
                document.getElementById('result').innerHTML = 
                "<p style='color:red'>Неуспешно вчитан фајл од локации</p>";      
            }
        }
        reader.readAsArrayBuffer(file);
        }
        )
     }, function(error){
        console.error(error);
     });
}


function isUTF8Encoded(bytes) {
       // Check for UTF-8 BOM
       if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
        return true;
    }

    // Check for UTF-8 multi-byte characters
    for (var i = 0; i < bytes.length; i++) {
        if ((bytes[i] & 0x80) && !(bytes[i] & 0x40)) {
            return true; // Found multi-byte character, indicating UTF-8 encoding
        }
    }
    
    return false;
}


function displayProducts(value=''){

    document.getElementById('yearReview').innerText =  "Преглед - Пописна Листа од "+ globalThis.getYear + " година";
    if(globalThis.products.length>0){
        if(value!=''){

            document.querySelector("#productsTable tbody").innerHTML = globalThis.products.filter(p=>p.code==value ||
                 p.name.toLowerCase()==value.toLowerCase() ||
                   globalThis.locations.
                   find(location=>location.code == p.codeLocation).name.toLowerCase()==value.toLocaleLowerCase())
                   .map(product => {
                    
                var locationName = '';
                var location = globalThis.locations.find(location=>location.code == product.codeLocation);
                if(location) {
                    locationName = location.name;
                }
                return `<tr><td>${product.code}</td><td>${product.name}</td><td>${product.codeLocation=='000' ? 'Нема локација'
                : locationName}</td></tr>`;
             }).join('');
        }else {
            document.querySelector("#productsTable tbody").innerHTML = globalThis.products.map(product => {
                var locationName = '';
                var location = globalThis.locations.find(location=>location.code == product.codeLocation);
                if(location) {
                    locationName = location.name;
                }
                return `<tr><td>${product.code}</td><td>${product.name}</td><td>${product.codeLocation=='000' ? 'Нема локација'
                : locationName}</td></tr>`;
             }).join('');
        }
    }else{
        document.querySelector("#productsTable tbody").innerHTML = "";
    }
    document.getElementById('searchVal').value = "";
}

document.getElementById('btnPorductSearch').addEventListener('click',function(){
    var value = document.getElementById('searchVal').value;
    displayProducts(value);
},false)


document.getElementById('btnProductClear').addEventListener('click',function(){
    displayProducts();
},false)


function displayLocations(){
    document.getElementById("lokacija").innerHTML = "";
        var selectLocationList = "";
        selectLocationList = document.getElementById("lokacija");
        globalThis.locations.forEach(function(location) {
            var option = document.createElement('option');
            option.text = location.name;
            option.value = location.code;
            selectLocationList.appendChild(option);
        })
}

function btnConfirm(){
    let btn = document.getElementById('btnConfirm');
    btn.addEventListener('click',Confirm,false)
}

function Confirm(){
    if(globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).length > 0){

        var datum = new Date();

        var day = datum.getDate().toString().padStart(2,'0');
        var month  = (datum.getMonth() + 1).toString().padStart(2,'0');
        var year = datum.getFullYear().toString();
        var hours =  datum.getHours().toString().padStart(2,'0');
        var minutes = datum.getMinutes().toString().padStart(2,'0');
        var seconds = datum.getSeconds().toString().padStart(2,'0');

     
        var dateTimeString = (day + "/" + month + "/" + year + " "+  hours 
        + ":" + minutes + ":" + seconds);

        document.getElementById('btnConfirm').disabled = true;
        document.getElementById("btnInsertNew").disabled = true;
        document.getElementById('btnConfirm').style.opacity = 0.5;
        document.getElementById("btnInsertNew").style.opacity = 0.5;
        document.getElementById('result').innerText = "";
        document.getElementById('result').innerHTML = `<p style='color:green'>Пронајдено, ${globalThis.ValueToConfirm}
        ${globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).map(function(p){
            return p.name;
        })}<br>-> Основното средство е внесено во новиот попис</p>`;

        let codeToAdd;
        if (globalThis.newProductArray.length === 0) {
            codeToAdd = "000000";
        } else {
            let lastItem = parseInt(globalThis.newProductArray[globalThis.newProductArray.length - 1].code, Infinity);;
            if(isNaN(lastItem)) {
                lastItem = 0;
            }
            lastItem++; // Increment
            codeToAdd = lastItem.toString().padStart(6, "0"); // Pad with leading zeros
        }
        if(globalThis.locations.length > 0) {
            
            var product = globalThis.products.find(p=>p.barcode==globalThis.ValueToConfirm);
            var codeLocation = product.codeLocation;

            globalThis.newProductArray.push({
                code:codeToAdd.toString(),
                barcode: globalThis.ValueToConfirm,
                name: globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).map(function(p){
                    return p.name;
                }),
                codeLocation: codeLocation,
                nameLocation: globalThis.locations.forEach(function(loc){
                    if(loc.code==codeLocation) {
                        return loc.name
                    }
                }),
                //  globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).map(function(p){
                //      globalThis.locations.forEach(function(loc){
                //         if(loc.code == p.codeLocation){
                //             return loc.name;
                //         }
                //      });
                // }),
                dateTimesString: dateTimeString
            });
            //p.codeLocation
        } else {
             globalThis.newProductArray.push({
            code: codeToAdd,
            barcode: globalThis.ValueToConfirm,
            name: globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).map(function(p){
                return p.name;
            }),
            codeLocation: '',
            nameLocation:'',
            dateTimesString: dateTimeString
        });
        }
        // alert(globalThis.newProductArray.length);
        globalThis.ValueToConfirm = "";
    }
}

document.getElementById('closeNaziv').addEventListener('click',function(){
    document.getElementById("alertNaziv").style.display = "none"; 
    document.getElementById('myBody').style.backgroundColor = "white";
    document.getElementById("menuToShow").style.display = "none"; 
    document.getElementById("homePage").style.display = "none";
    document.getElementById("custom-dialogIsert").style.display = "block"
},false)

document.getElementById('closeShifra').addEventListener('click',function(){
    document.getElementById("alertShifra").style.display = "none"; 
    document.getElementById('myBody').style.backgroundColor = "white";
    document.getElementById("menuToShow").style.display = "none"; 
    document.getElementById("homePage").style.display = "none";
    document.getElementById("custom-dialogIsert").style.display = "block"
},false)

document.getElementById('insertNew').addEventListener('click',function(){
        var naziv = document.getElementById('naziv').value;
        var barcodeNew = document.getElementById('shifra').value;
        var location = "";
        if( globalThis.locations.length > 0){
        location = document.getElementById('lokacija').value;
        }
        document.getElementById('ReviewsNew').style.display = "none";
        if(naziv=="")
        {
            document.getElementById("alertNaziv").style.display = "block";
            document.getElementById('myBody').style.backgroundColor = "#a6a6a6";
            document.getElementById("menuToShow").style.display = "none";
            document.getElementById("homePage").style.display = "none";
            document.getElementById("custom-dialogIsert").style.display = "none";
        } else if(barcodeNew==""){
            document.getElementById("alertShifra").style.display = "block";
            document.getElementById('myBody').style.backgroundColor = "#a6a6a6";
            document.getElementById("menuToShow").style.display = "none"; 
            document.getElementById("homePage").style.display = "none";
            document.getElementById("custom-dialogIsert").style.display = "none"
        }else {
    
                    // alert(globalThis.newProductArray.filter(p=>p.barcode==barcodeNew)!="");
            if(globalThis.newProductArray.filter(p=>p.barcode==barcodeNew)!=""){
                document.getElementById('result').innerHTML = `<p style='color:blue'>Ова основно средство е веќе 
                внесено во попис, не може да се повторуваат средствата!</p>`;  
                document.getElementById('btnConfirm').disabled = true;
                document.getElementById("btnInsertNew").disabled = true;
    
                document.getElementById('btnConfirm').style.opacity = 0.5;
                document.getElementById("btnInsertNew").style.opacity = 0.5;
    
                document.getElementById('naziv').value="";
                document.getElementById('shifra').value="";
                document.getElementById('barkod').value = ""
                document.getElementById("lokacija").value = ""; 
    
                document.getElementById("custom-dialogIsert").style.display = "none";
                document.getElementById("homePage").style.display = "block";
                document.getElementById("menuToShow").style.display = "block"; 
                document.getElementById('ReviewsNew').style.display = "none";
            }else {
                var datum = new Date();
                var day = datum.getDate().toString().padStart(2,'0');
                var month  = (datum.getMonth() + 1).toString().padStart(2,'0');
                var year = datum.getFullYear().toString();
                var hours =  datum.getHours().toString().padStart(2,'0');
                var minutes = datum.getMinutes().toString().padStart(2,'0');
                var seconds = datum.getSeconds().toString().padStart(2,'0');
        
             
                var dateTimeString = (day + "/" + month + "/" + year + " "+  hours 
                + ":" + minutes + ":" + seconds)

                document.getElementById('btnConfirm').disabled = true;
                document.getElementById("btnInsertNew").disabled = true;
    
                document.getElementById('btnConfirm').style.opacity = 0.5;
                document.getElementById("btnInsertNew").style.opacity = 0.5;
                document.getElementById('result').innerText = "";
                document.getElementById('result').innerHTML = `<p style='color:orange'>Додадено, ${barcodeNew} Disk<br>
                -> Основното средство е додадено во новиот попис.</p>`;

                let codeToAdd;
                if (globalThis.newProductArray.length === 0) {
                    codeToAdd = "000000";
                } else {
                    let lastItem = parseInt(globalThis.newProductArray[globalThis.newProductArray.length - 1].code, Infinity);;
                    if(isNaN(lastItem)) {
                        lastItem = 0;
                    }
                    lastItem++; // Increment
                    codeToAdd = lastItem.toString().padStart(6, "0");
                }

                if( globalThis.locations.length > 0) {

                    globalThis.newProductArray.push({
                        code: codeToAdd.toString(),
                        barcode: barcodeNew,
                        name: naziv,
                        codeLocation:location,
                        nameLocation: globalThis.locations.forEach(function(loc){
                            if(loc.code == location){
                                return loc.name;
                            }
                        }),
                        dateTimesString: dateTimeString
                        });

                } else {
                    globalThis.newProductArray.push({
                        code: codeToAdd,
                        barcode: barcodeNew,
                        name: naziv,
                        codeLocation:'',
                        nameLocation:'',
                        dateTimesString: dateTimeString
                        });
                }
                // alert(globalThis.newProductArray.length);
                document.getElementById('naziv').value="";
                document.getElementById('shifra').value="";
                document.getElementById('barkod').value = "" 
                document.getElementById("lokacija").value = ""; 
    
                document.getElementById("custom-dialogIsert").style.display = "none";
                document.getElementById("homePage").style.display = "block";
                document.getElementById("menuToShow").style.display = "block";
                document.getElementById('ReviewsNew').style.display = "none";
            }
        }
    }
    ,false);

    document.getElementById('insertClose').addEventListener('click',function(){
        document.getElementById('result').innerHTML = "";
        document.getElementById("custom-dialogIsert").style.display = "none";  
        document.getElementById("menuToShow").style.display = "block";
        document.getElementById("homePage").style.display = "block";
        document.getElementById('ReviewsNew').style.display = "none";
    },false);

document.getElementById('btnReset').addEventListener('click', function() {
    document.getElementById("custom-dialog").style.display = "none";
    document.getElementById("menuToShow").style.display = "none";
    document.getElementById("homePage").style.display = "none";
    document.getElementById("confirmAlert").style.display = 'block';
    document.getElementById('myBody').style.backgroundColor = "#a6a6a6";
    document.getElementById('ReviewsNew').style.display = "none";
});


document.getElementById('btnYes').addEventListener('click',function(){
    globalThis.newProductArray = [];
    document.getElementById('result').innerHTML = "<p style='color:green'>Нов попис е ресетиран!</p>";
    document.getElementById("confirmAlert").style.display = 'none';
    document.getElementById("menuToShow").style.display = "block";
    document.getElementById("homePage").style.display = "block";
    document.getElementById('ReviewsNew').style.display = "none";
    document.getElementById('myBody').style.backgroundColor = "white";
    },false);
 document.getElementById('btnNo').addEventListener('click',function(){
        document.getElementById('result').innerText = "";
        document.getElementById("confirmAlert").style.display = 'none';
        document.getElementById("menuToShow").style.display = "block";
        document.getElementById("homePage").style.display = "block";
        document.getElementById('myBody').style.backgroundColor = "white";
        document.getElementById('ReviewsNew').style.display = "none";
    },false);


    // function chooseFile() {
    //     window.fileChooser.open(function(uri) {
    //         window.FilePath.resolveNativePath(uri, function(filePath) {
    //             var fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    //             alert("Selected file:", fileName);
    //         }, errorHandler);   
    //     }, errorHandler);
    // }

    // function errorHandler(error) {
    //     console.error("Error:", error.message);
    //     console.error("Error Object:", error);
    //     console.error("Stack Trace:", error.stack);
    // }

    // window.onload = function() {

    //     cordova.plugins.permissions.checkPermission(cordova.plugins.permissions.READ_EXTERNAL_STORAGE, function(status) {
    //         if (status.hasPermission) {
    //             // Permission is granted, proceed with accessing external storage
    //             chooseFile();
    //         } else {
    //             // Permission is not granted, request it from the user
    //             cordova.plugins.permissions.requestPermission(cordova.plugins.permissions.READ_EXTERNAL_STORAGE, function(status) {
    //                 if (status.hasPermission) {
    //                     // Permission granted, proceed with accessing external storage
    //                     chooseFile();
    //                 } else {
    //                     // Permission denied, provide guidance to the user
    //                     alert("Permission denied to read external storage. You can grant the permission manually from the app settings.");
    //                 }
    //             }, function() {
    //                 // Error occurred while requesting permission
    //                 alert("Error occurred while requesting permission");
    //             });
    //         }
    //     }, function() {
    //         // Error occurred while checking permission
    //         alert("Error occurred while checking permission");
    //     });
    // }

     function fileWithOpener(type){
            window.fileChooser.open({ "mime": "text/plain" } ,function(uri) {
                var filename = "";
                var fileError="";
                window.FilePath.resolveNativePath(uri, function(filePath) {
                    filename = filePath.split('/').pop();
                    // alert(filename);
                  }, function(error){
                    // alert("Error resolving native path: " + JSON.stringify(error));
                    fileError = "Погрешно избрана патека за датотеката";
                  });
                window.resolveLocalFileSystemURI(uri, function(fileEntry){
                    fileEntry.file(function(file){  
                            if(file.type === "text/plain"){
                                var reader = new FileReader();
                                reader.onloadend = function (evt) {
                    
                                    var content = this.result;
                
                                    var fileContent = new Uint8Array(evt.target.result);
                
                                    var isUTF8 = isUTF8Encoded(fileContent);   

                                    if(type=='products'){ 
                                        globalThis.products=[];
                                   }else {
                                         globalThis.locations=[];
                                   }

                                    if(isUTF8){
                
                                    content  = new TextDecoder("utf-8").decode(content);
                
                                    var lines = content.split('\n');
                                    
                                    lines.forEach(function (line) {
                                        line = line.trim()

                                        if(type=='products'){ 
                                            if(/^[^;]+;[^;]+;[^;]+;[^;]+;$/.test(line)){
                                                line = line.split(";");
                                            if(line[2]!=undefined){
                                            globalThis.products.push({
                                                code: line[0],
                                                barcode: line[1],
                                                name: line[2],
                                                codeLocation: line[3]
                                            });
                                        }
                                      }
                                        } else{
                                            if(/^[^;]+;[^;]+$/.test(line)){
                                                line = line.split(";");
                                                // if(line[1]!="..."){
                                                    globalThis.locations.push({
                                                        code: line[0],
                                                        name: line[1],
                                                    });
                                                // }
                                             }
                                        }
                                }   )
                                if(type=='products'){
                                    document.getElementById('result').innerHTML = ""; 
                                    if(globalThis.products.length > 0){
                                        if(fileError==""){
                                        globalThis.getYear = filename.substring(filename.lastIndexOf("_")+1,filename.lastIndexOf("."));
                                        // alert(globalThis.getYear);
                                        document.getElementById('result').innerHTML = 
                                        "<p style='color:green'>Успечно вчитан фајл од средства од  "+ globalThis.getYear +" година</p>";
                                        } else{
                                            globalThis.products=[];
                                            document.getElementById('result').innerHTML = "<p style='color:red'>" + fileError + "</p>"    
                                        }
                                    } else {
                                        document.getElementById('result').innerHTML = 
                                    "<p style='color:red'>Вчитан е не соодветен фајл!</p>";
                                    }
                                }else{
                                    document.getElementById('result').innerHTML = ""; 
                                    if(globalThis.locations.length > 0){
                                        if(fileError==""){
                                        globalThis.getYear = filename.substring(filename.lastIndexOf("_")+1,filename.lastIndexOf("."));
                                        // alert(globalThis.getYear);
                                        document.getElementById('result').innerHTML = 
                                        "<p style='color:green'>Успечно вчитан фајл од локации од "+ globalThis.getYear +" година</p>";
                                        }else{
                                            globalThis.locations=[];
                                            document.getElementById('result').innerHTML = "<p style='color:red'>" + fileError + "</p>"
                                        }
                                    } else {
                                        document.getElementById('result').innerHTML = 
                                        "<p style='color:red'>Вчитан е не соодветен фајл!</p>";  
                                    }
                                }
                        }else{
                            if(type=='products'){
                                document.getElementById("btnInsertNew").style.opacity = 0.5;
                                document.getElementById("btnInsertNew").disabled = true; 
                
                                globalThis.products=[];
                            } else {
                                globalThis.locations=[];
                            }
                            document.getElementById('result').innerHTML = 
                            `<p style='color:red'>Неуспешен вчитан формат на фајл</p>`;
                             return;
                            }
                        }
                        reader.readAsArrayBuffer(file);
                    }else{
                        if(type=='products'){
                            document.getElementById("btnInsertNew").style.opacity = 0.5;
                            document.getElementById("btnInsertNew").disabled = true; 
                
                            globalThis.products=[];
                            document.getElementById('result').innerHTML = 
                            "<p style='color:red'>Неуспешно вчитан фајл од средства</p>"; 
                        } else{
                            globalThis.locations=[];
                            document.getElementById('result').innerHTML = 
                            "<p style='color:red'>Неуспешно вчитан фајл од локации</p>";      
                        }
                    }
                    }, function(error){
                        alert(error);
                    })
                }, function(error){
                    alert(error)
                }, function(){
                    alert(error)
                });
             })
            }

    document.getElementById('btnSaveOnDisk').addEventListener('click', function() {
        if(globalThis.newProductArray.length>0){
            writeFile();
            document.getElementById('result').innerHTML = "<p style='color:green'>Успечно креиран фајл</p>";
            document.getElementById("menuToShow").style.display = "block";
            document.getElementById("homePage").style.display = "block";
            document.getElementById("Reviews").style.display = "none";
            document.getElementById('custom-dialog').style.display = 'none';
        }else{
            document.getElementById("alertError").style.display = "block";
            document.getElementById('myBody').style.backgroundColor = "#a6a6a6";
            document.getElementById("menuToShow").style.display = "none";
            document.getElementById("homePage").style.display = "none";
            document.getElementById("Reviews").style.display = "none";
        }
        document.getElementById('custom-dialog').style.display = 'none';
        document.getElementById('ReviewsNew').style.display = "none";
        });
        
        document.getElementById('closeError').addEventListener('click',function(){
            document.getElementById("alertError").style.display = "none";
            document.getElementById('myBody').style.backgroundColor = "white";
            document.getElementById("menuToShow").style.display = "block";
            document.getElementById("homePage").style.display = "block";
            },false);



function writeFile(){
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(directoryEntry) {
        // alert(directoryEntry.toURL());
        directoryEntry.getFile("Popis_"+new Date().getFullYear().toString() +".txt", { create: true }, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
               // fileWriter.onwriteend = function() {
                 //   alert("File saved successfully.");
               // };

              //  fileWriter.onerror = function(e) {
              //      alert("Failed to save file.");
              //  };
              var lines = [];
              lines.push("Код средство, Баркод, Назив средство, Код локација, Назив локација, Датум и време");
              globalThis.newProductArray.forEach(function(line){
                
            var locationName
            var location = globalThis.locations.find(location=>location.code == line.codeLocation);
            if(location){
                locationName = location.name;
            }

            var myLocation = line.codeLocation=='000' ? 'Нема локација' + ", " : line.codeLocation + ", " + locationName + ", ";
            lines.push((line.code+", "+line.barcode+", "+line.name + ", " + myLocation
                 + line.dateTimesString).toString());
              });
              var data = lines.join('\n');

                var blob = new Blob([data], { type: 'text/plain' });
                fileWriter.write(blob);
                // alert("Успешно креиран фајл");
                globalThis.newProductArray = [];
            }, function() {
                alert("Error creating file writer.");
            });
        }, function() {
            alert("Error creating file.");
        });
    }, function() {
        alert("Error resolving file system URL.");
    });
}


document.getElementById('menuToShow').addEventListener('click', function() {
    document.getElementById('result').innerHTML='';
    document.getElementById('resultReviewsNew').innerHTML = "";
    document.getElementById('custom-dialog').style.display = 'block';
    document.getElementById("homePage").style.display = "none";
    document.getElementById("Reviews").style.display = "none";
    document.getElementById('ReviewsNew').style.display = "none";
    if(globalThis.products.length>0 && globalThis.locations.length>0){
    document.getElementById('btnReview').disabled= false;
    document.getElementById('btnReview').style.opacity = 1;
    }else{
        document.getElementById('btnReview').disabled =true;
        document.getElementById('btnReview').style.opacity = 0.5;
    }
    if(globalThis.newProductArray.length>0){
        document.getElementById('btnReset').disabled = false;
        document.getElementById('btnReset').style.opacity = 1;
        document.getElementById('btnPopisNov').disabled = false;
        document.getElementById('btnPopisNov').style.opacity = 1;
        document.getElementById("btnSaveOnDisk").disabled = false;
        document.getElementById('btnSaveOnDisk').style.opacity = 1;
    }else{
        document.getElementById('btnReset').disabled = true;
        document.getElementById('btnReset').style.opacity = 0.5;
        document.getElementById('btnPopisNov').disabled = true;
        document.getElementById('btnPopisNov').style.opacity = 0.5;
        document.getElementById('btnSaveOnDisk').disabled = true;
        document.getElementById('btnSaveOnDisk').style.opacity = 0.5;
    }
});
ReviewsNew

document.getElementById('btnPopisNov').addEventListener('click', function(){
    displayNewProducts()
    document.getElementById('ReviewsNew').style.display = "block";
    document.getElementById("homePage").style.display = "none";
    document.getElementById("Reviews").style.display = "none";
    document.getElementById("Reviews").style.display = "none";
    document.getElementById('custom-dialog').style.display = 'none';
})


function displayNewProducts(value='') {
    if (globalThis.newProductArray.length > 0) {
        if (value != '') {
            const filterProducts = globalThis.newProductArray.filter(product => {
                const productName = (product.name || '').toString().toLowerCase();
                const locationName = globalThis.locations.find(location => location.code == product.codeLocation)?.name.toLowerCase() || '';
                return (
                    product.code == value || 
                    productName.includes(value.toLowerCase()) || 
                    locationName.includes(value.toLowerCase())
                );
            });

            document.querySelector("#productsNewTable tbody").innerHTML = filterProducts.map(product => {
                var locationName = '';
                if (product.codeLocation == '000') {
                    locationName = '...';
                } else {
                    var location = globalThis.locations.find(location => location.code == product.codeLocation);
                    if (location) {
                        locationName = location.name;
                    }
                }

                return `<tr>
                    <td>${product.code.toString()}</td>
                    <td>${product.name}</td>
                    <td>${product.codeLocation == '000' ? 'Нема локација' : product.codeLocation }</td>
                    <td>${product.codeLocation == '000' && locationName === '...' ? 'Нема локација' : locationName}</td>
                    <td>${product.dateTimesString}</td>
                    <td class='lokacijaPromeni'></td>
                    <td><button class='btn btn-danger' onclick="deleteReview(${product.code})">Избриши</button></td>
                </tr>`;
            }).join('');

        
            displayLocationsForNewReviews(globalThis.newProductArray, filterProducts);
        } else {
            document.querySelector("#productsNewTable tbody").innerHTML = globalThis.newProductArray.map(product => {
                var locationName = '';
                var location = globalThis.locations.find(location => location.code == product.codeLocation);
                if (location) {
                    locationName = location.name;
                }

                return `<tr>
                    <td>${product.code.toString()}</td>
                    <td>${product.name}</td>
                    <td>${product.codeLocation == '000' ? 'Нема локација' : product.codeLocation }</td>
                    <td>${locationName === '...' ? 'Нема локација' : locationName}</td>
                    <td>${product.dateTimesString}</td>
                    <td class='lokacijaPromeni'></td>
                    <td><button class='btn btn-danger' onclick="deleteReview(${product.code})">Избриши</button></td>
                </tr>`;
            }).join('');

            displayLocationsForNewReviews(globalThis.newProductArray, globalThis.newProductArray);
        }
    } else {
        document.querySelector("#productsTable tbody").innerHTML = "";
    }
    document.getElementById('searchNewVal').value = "";
}

function displayLocationsForNewReviews(newProductArray, filterProducts) {
    var tds = document.querySelectorAll('.lokacijaPromeni');
    tds.forEach((td, index) => {
        td.innerHTML = ''; 
        var product = filterProducts[index];
        var select = document.createElement('select');
        select.className = "form-control";
        select.addEventListener("change", function() {
            UpdateLocation(this.value, td.parentNode);
            saveChangesToNewProductArray();
        });
        select.id = "locationSelects";

        globalThis.locations.forEach(function(location) {
            var option = document.createElement('option');
            option.value = location.code;
            option.text = location.name;
            select.appendChild(option);
        });

        if (product) {
            var productIndex = newProductArray.findIndex(prod => prod.code === product.code);
            var selectedIndex = globalThis.locations.findIndex(location => location.code === newProductArray[productIndex].codeLocation);
            if (selectedIndex !== -1) {
                select.selectedIndex = selectedIndex;
            }
        }
        td.appendChild(select);
    });
}

function UpdateLocation(selectedCode, row){
    var selectedLocation = globalThis.locations.find(location=>location.code == selectedCode);
    if(selectedLocation) {
        row.cells[2].innerText = selectedLocation.code=='000' ? 'Нема локација' : selectedLocation.code;
        row.cells[3].innerText = selectedLocation.code=='000' ? 'Нема локација' : selectedLocation.name;

        var rowIndex = Array.from(row.parentNode.children).indexOf(row); // Get the index of the row
        globalThis.newProductArray[rowIndex].codeLocation = selectedLocation.code;
    } 
}

function saveChangesToNewProductArray() {
    console.log(globalThis.newProductArray);
}


function deleteReview(code){
    globalThis.codeToDelete=code;
    document.getElementById("menuToShow").style.display = "none";
    document.getElementById('ReviewsNew').style.display = "none";
    document.getElementById("confirmDeleteAlert").style.display = 'block';
}



document.getElementById('btnNoDelete').addEventListener('click',function(){
    // globalThis.newProductArray = [];
    globalThis.codeToDelete=undefined;
    document.getElementById('resultReviewsNew').innerHTML = "";
    document.getElementById("confirmDeleteAlert").style.display = 'none';
    document.getElementById("menuToShow").style.display = "block";
    document.getElementById('ReviewsNew').style.display = "block";
    },false);
 document.getElementById('btnYesDelete').addEventListener('click',function(){
    var productIndex = globalThis.newProductArray.findIndex(product=>product.code==globalThis.codeToDelete);
    var product = globalThis.newProductArray.find(product=>product.code==globalThis.codeToDelete);

    globalThis.newProductArray.splice(productIndex,1);
    if(globalThis.newProductArray.length==0){
        globalThis.codeToDelete=undefined
        document.getElementById('result').innerHTML = "<p style='color:green'>Нов попис е ресетиран!</p>";
        document.getElementById("ReviewsNew").style.display = 'none';
        document.getElementById("confirmDeleteAlert").style.display = 'none';
        document.getElementById("menuToShow").style.display = "block";
        document.getElementById("homePage").style.display = "block";
        document.getElementById('resultReviewsNew').innerHTML = "";
    }else{
        document.getElementById("confirmDeleteAlert").style.display = 'none';
        document.getElementById("menuToShow").style.display = "block";
        document.getElementById('ReviewsNew').style.display = "block";
        document.getElementById('resultReviewsNew').innerHTML = `<p style='color:green'>Пописот ${product.name} 
    е избришан од листата на нов попис!</p>`;
    globalThis.codeToDelete=undefined;
    displayNewProducts()
    }

    },false);


document.getElementById('btnPorductNewSearch').addEventListener('click',function(){
    var value = document.getElementById('searchNewVal').value;
    displayNewProducts(value)
},false)


document.getElementById('btnProductNewClear').addEventListener('click',function(){
    displayNewProducts()
},false)






