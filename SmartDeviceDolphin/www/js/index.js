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

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    // readFileFromInternalStorage()

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
            }, function (error) {
                alert("Scanning failed: " + error);
            }
    );  
 }

 function productExists(value){
    globalThis.ValueToConfirm = "";
    if(globalThis.products.length<=0){
        document.getElementById('result').innerHTML = `<p style='color:red'>Немате 
        Вчитано листа на основни сретства пред да започнете со попис морате да вчитате
        шифра шифри на основни сретства</p>`;
    }else if(globalThis.products.filter(p=>p.barcode==value)!=""){
        if(globalThis.newProductArray.filter(p=>p.barcode==value)!="")
        {
            document.getElementById('result').innerHTML = `<p style='color:blue'>Ова основно средство е веќе 
            внесено во попис, не може да се повторуваат средствата!</p>`;   
            return;  
        }
        globalThis.ValueToConfirm = value;
        document.getElementById('btnConfirm').disabled = false;  
        document.getElementById("btnInsertNew").disabled = true;       
        document.getElementById('result').innerHTML = "Пронајдено, " + value +"<br/>" 
        + globalThis.products.filter(p=>p.barcode==value).map(function(p){
            return p.name;
        });
    }else {
        globalThis.ValueToConfirm = "";
        document.getElementById('btnConfirm').disabled = true;
        document.getElementById("btnInsertNew").disabled = false;
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
    }
}


function readFileFromInternalStorage() {
    globalThis.products=[];
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory
     + "www/Popis_Shifrarnik_2021.txt",function(fileEntry){
        fileEntry.file(function (file) {
            if(file.type === "text/plain"){
                var reader = new FileReader();
                reader.onloadend = function () {
    
                    var content = this.result;
                    var lines = content.split('\n');
                    
                    lines.forEach(function (line) {
                        line = line.split(";");
                        if(line[2]!=undefined){
                        globalThis.products.push({
                            code: line[0],
                            barcode: line[1],
                            name: line[2]
                        });
                    }
                    });
                };
                reader.readAsText(file);
            }
        })
     }, function(error){
        console.error(error);
     });
}
function displayProducts(){
    if(globalThis.products.length>0){
    document.querySelector("#productsTable tbody").innerHTML = globalThis.products.map(product =>
    `<tr><td>${product.code}</td><td>${product.name}</td></tr>`).join('');
    }
}

function btnConfirm(){
    let btn = document.getElementById('btnConfirm');
    btn.addEventListener('click',Confirm,false)
}

function Confirm(){
    if(globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm)!=""){
        document.getElementById('btnConfirm').disabled = true;
        document.getElementById("btnInsertNew").disabled = true;
        document.getElementById('result').innerText = "";
        document.getElementById('result').innerHTML = `<p style='color:green'>Пронајдено, ${globalThis.ValueToConfirm}
        ${globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).map(function(p){
            return p.name;
        })}<br>-> Основното средство е внесено во новиот попис</p>`;

        globalThis.newProductArray.push({
            code: globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).map(function(p){
                return p.code;
            }),
            barcode: globalThis.ValueToConfirm,
            name: globalThis.products.filter(p=>p.barcode==globalThis.ValueToConfirm).map(function(p){
                return p.name;
            })
        });
        alert(globalThis.newProductArray.length);
        globalThis.ValueToConfirm = "";
    }
}

function InsertNew(){
    var naziv = document.getElementById('naziv').value;
    var barcodeNew = document.getElementById('shifra').value;
    if(naziv=="")
    {
        alert("Мора да внесете назив на основното средство");
        document.getElementById("menuToShow").style.display = "none";
    } else if(barcodeNew==""){
        alert("Мора да внесете шифра на основното средство");
        document.getElementById("menuToShow").style.display = "none"; 
    }else {

                // alert(globalThis.newProductArray.filter(p=>p.barcode==barcodeNew)!="");
        if(globalThis.newProductArray.filter(p=>p.barcode==barcodeNew)!=""){
            document.getElementById('result').innerHTML = `<p style='color:blue'>Ова основно средство е веќе 
            внесено во попис, не може да се повторуваат средствата!</p>`;  
            document.getElementById('btnConfirm').disabled = true;
            document.getElementById("btnInsertNew").disabled = true;

            document.getElementById("custom-dialogIsert").style.display = "none";
            document.getElementById("menuToShow").style.display = "block"; 
        }else {
            alert(globalThis.newProductArray.length);
            document.getElementById('btnConfirm').disabled = true;
            document.getElementById("btnInsertNew").disabled = true;
            document.getElementById('result').innerText = "";
            document.getElementById('result').innerHTML = `<p style='color:orange'>Додадено, ${barcodeNew} Disk<br>
            -> Основното средство е додадено во новиот диск</p>`;
            
            globalThis.newProductArray.push({
                code: barcodeNew,
                barcode: barcodeNew,
                name: naziv
                });
            barcodeNew = "";
            naziv = ""
            document.getElementById("custom-dialogIsert").style.display = "none";
            document.getElementById("menuToShow").style.display = "block";
        }
    }
}

function insertClose(){
    document.getElementById("custom-dialogIsert").style.display = "none";  
    document.getElementById("menuToShow").style.display = "block";
}

document.getElementById('btnReset').addEventListener('click', function() {
    if(confirm("Дали навистина сакате да го ресетирате фајлот за попис и да започнете на ново") == true) {
    globalThis.newProductArray = [];
    }
    document.getElementById('result').innerText = "";
    document.getElementById('custom-dialog').style.display = 'none';
});


function fileWithOpener(){
    globalThis.products=[];
    window.fileChooser.open(function(uri) {
        window.resolveLocalFileSystemURI(uri, function(fileEntry){
            fileEntry.file(function(file){
                    if(file.type === "text/plain")
                {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        var content = this.result;
                        var lines = content.split('\n');
                        lines.forEach(function (line) {
                            line = line.split(";");
                            if(line[2]!=undefined){
                            globalThis.products.push({
                                code: line[0],
                                barcode: line[1],
                                name: line[2]
                             });
                        }
                        });
                    };
                }
                reader.readAsText(file);
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
        }else{
            alert("Немате внесено во попис нов или немате вчитано фајл со средства од диск");
        }
        document.getElementById('custom-dialog').style.display = 'none';
});



function writeFile(){
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(directoryEntry) {
        // alert(directoryEntry.toURL());

        directoryEntry.getFile("result.txt", { create: true }, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
               // fileWriter.onwriteend = function() {
                 //   alert("File saved successfully.");
               // };

              //  fileWriter.onerror = function(e) {
              //      alert("Failed to save file.");
              //  };
              var lines = [];
              globalThis.newProductArray.forEach(function(line){
            //    alert((line.code+";"+line.barcode+";"+line.name).toString());
                lines.push((line.code+";"+line.barcode+";"+line.name).toString())
              });
              var data = lines.join('\n');
              alert(data);

                var blob = new Blob([data], { type: 'text/plain' });
                fileWriter.write(blob);
                alert("Успешно креиран фајл");
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