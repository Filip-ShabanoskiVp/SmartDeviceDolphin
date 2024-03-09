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

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    readFileFromInternalStorage("products");
    readFileFromInternalStorage("locations");

    btnScanner();  
    searchBtn();
    btnConfirm()  
    
}


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
    if(type=='products') {
        path = "www/Popis_Shifrarnik_2024.txt";
    } else {
        path = "www/Lokacii_2024.txt";
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
                            if(line[1]!="..."){
                                globalThis.locations.push({
                                    code: line[0],
                                    name: line[1],
                                });
                            }
                         }
                    }
                })

                if(type=='products'){
                    document.getElementById('result').innerHTML = ""; 
                    document.getElementById('result').innerHTML = 
                    "<p style='color:green'>Успечно вчитан фајл од средства</p>";
                }else{
                    document.getElementById('result').innerHTML = ""; 
                    document.getElementById('result').innerHTML = 
                    "<p style='color:green'>Успечно вчитан фајл од локации</p>";
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


function displayProducts(){

    if(globalThis.products.length>0){

    document.querySelector("#productsTable tbody").innerHTML = globalThis.products.map(product => {
        var locationName = '';
        var location = globalThis.locations.find(location=>location.code == product.codeLocation);
        if(location) {
            locationName = location.name;
        }
        return `<tr><td>${product.code}</td><td>${product.name}</td><td>${locationName}</td></tr>`;
     }).join('');
    }else{
        document.querySelector("#productsTable tbody").innerHTML = "";
    }
}

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
    if(globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm)!=""){

        var datum = new Date();
        var day = datum.getDay().toString().padStart(2,'0');
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
            globalThis.newProductArray.push({
                code:codeToAdd,
                barcode: globalThis.ValueToConfirm,
                name: globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).map(function(p){
                    return p.name;
                }),
                codeLocation: globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).map(function(p){
                    return p.codeLocation;
                }),
                nameLocation: globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).map(function(p){
                     globalThis.locations.filter(location=>location.code==p.codeLocation).map(function(l){
                        return l.name;
                     });
                }),
                dateTimesString: dateTimeString
            });
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
                var day = datum.getDay().toString().padStart(2,'0');
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

     function fileWithOpener(type){
            window.fileChooser.open(function(uri) {
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
                                                if(line[1]!="..."){
                                                    globalThis.locations.push({
                                                        code: line[0],
                                                        name: line[1],
                                                    });
                                                }
                                             }
                                        }
                                }   )
                                if(type=='products'){
                                    document.getElementById('result').innerHTML = ""; 
                                    document.getElementById('result').innerHTML = 
                                    "<p style='color:green'>Успечно вчитан фајл од средства</p>";
                                }else{
                                    document.getElementById('result').innerHTML = ""; 
                                    document.getElementById('result').innerHTML = 
                                    "<p style='color:green'>Успечно вчитан фајл од локации</p>";
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
              globalThis.newProductArray.forEach(function(line){
                
            var locationName
            var location = globalThis.locations.find(location=>location.code == line.codeLocation);
            if(location){
                locationName = location.name;
            }

            lines.push((line.code+";"+line.barcode+";"+line.name + ";" + line.codeLocation  + ";" + locationName + ";"
                 + line.dateTimesString).toString()) + ";";
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


function displayNewProducts(){
    if(globalThis.newProductArray.length>0){

        document.querySelector("#productsNewTable tbody").innerHTML = globalThis.newProductArray.map(product => {
            var locationName = '';
            var location = globalThis.locations.find(location=>location.code == product.codeLocation);
            if(location) {
                locationName = location.name;
            }

            return `<tr><td>${product.code.toString()}</td><td>${product.name}</td><td>${product.codeLocation}</td>
            <td>${locationName}</td> <td>${product.dateTimesString}</td>
            <td class='lokacijaPromeni'></div></td>
            <td><button class='btn btn-danger' onclick="deleteReview(${product.code})">Избриши</button</td></tr>`;
        }).join('');
        displayLocationsForNewReviews()
    }else{
        document.querySelector("#productsTable tbody").innerHTML = "";
    }
}
function displayLocationsForNewReviews(){
    var tds = document.querySelectorAll('.lokacijaPromeni');
    tds.forEach(td => {
        var select = document.createElement('select');
        select.className = "form-control"
        select.addEventListener("change", function() {
            UpdateLocation(this.value,td.parentNode);
        })
        select.id = "locationSelects";

        globalThis.locations.forEach(function(location) {
            var option = document.createElement('option');
            option.value = location.code;
            option.text = location.name;
            select.appendChild(option);
    })
    td.appendChild(select);
})

}

function UpdateLocation(selectedCode, row){
    var selectedLocation = globalThis.locations.find(location=>location.code == selectedCode);
    if(selectedLocation) {
        row.cells[2].innerText = selectedLocation.code;
        row.cells[3].innerText = selectedLocation.name;
    } 
}


function deleteReview(code){
    var nova = globalThis.newProductArray.indexOf(code);
    globalThis.newProductArray.splice(nova,1);
    if(globalThis.newProductArray.length==0){
        document.getElementById('result').innerHTML = "<p style='color:green'>Нов попис е ресетиран!</p>";
    }else{
    document.getElementById('result').innerHTML = "<p style='color:green'>Пописот е избришан од листата на нов попис!</p>";
    }
    document.getElementById("ReviewsNew").style.display = 'none';
    document.getElementById("menuToShow").style.display = "block";
    document.getElementById("homePage").style.display = "block";

}




