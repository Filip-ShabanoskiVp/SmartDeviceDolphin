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
            }, function () {
        document.getElementById("alertScanner").style.display = "block";
        document.getElementById("menuToShow").style.display = "none";
        document.getElementById("homePage").style.display = "none";
            }
    );  
 }

document.getElementById('closeScanError').addEventListener('click',function(){

    document.getElementById("alertScanner").style.display = "none";
    document.getElementById("menuToShow").style.display = "block";
    document.getElementById("homePage").style.display = "block";
},false)





 function productExists(value){
    globalThis.ValueToConfirm = "";
    if(globalThis.products.length<=0){
        document.getElementById('result').innerHTML = `<p style='color:red'>Немате 
        вчитано листа на основни сретства, пред да започнете со попис морате да вчитате
        шифри на основни сретства !</p>`;
    }else if(globalThis.products.filter(p=>p.barcode==value)!=""){
        if(globalThis.newProductArray.filter(p=>p.barcode==value)!="")
        {
            document.getElementById('result').innerHTML = `<p style='color:blue'>Ова основно средство е веќе 
            внесено во попис, не може да се повторуваат средствата!</p>`;   
            return;  
        }
        globalThis.ValueToConfirm = value;
        document.getElementById('btnConfirm').disabled = false;  
        document.getElementById('btnConfirm').style.opacity = 1;
        document.getElementById("btnInsertNew").disabled = true;   
        document.getElementById("btnInsertNew").style.opacity = 0.5;    
        document.getElementById('result').innerHTML = "Пронајдено, " + value +"<br/>" 
        + globalThis.products.filter(p=>p.barcode==value).map(function(p){
            return p.name;
        });
    }else {
        globalThis.ValueToConfirm = "";
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
    }
    document.getElementById('barkod').value = ""
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
        document.getElementById('btnConfirm').style.opacity = 0.5;
        document.getElementById("btnInsertNew").style.opacity = 0.5;
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
        // alert(globalThis.newProductArray.length);
        globalThis.ValueToConfirm = "";
    }
}

document.getElementById('closeNaziv').addEventListener('click',function(){
    document.getElementById("alertNaziv").style.display = "none"; 
    document.getElementById("menuToShow").style.display = "none"; 
    document.getElementById("homePage").style.display = "block";
    document.getElementById("custom-dialogIsert").style.display = "block"
},false)

document.getElementById('closeShifra').addEventListener('click',function(){
    document.getElementById("alertShifra").style.display = "none"; 
    document.getElementById("menuToShow").style.display = "none"; 
    document.getElementById("homePage").style.display = "block";
    document.getElementById("custom-dialogIsert").style.display = "block"
},false)

document.getElementById('insertNew').addEventListener('click',function(){
        var naziv = document.getElementById('naziv').value;
        var barcodeNew = document.getElementById('shifra').value;
        if(naziv=="")
        {
            document.getElementById("alertNaziv").style.display = "block";
            document.getElementById("menuToShow").style.display = "none";
            document.getElementById("homePage").style.display = "none";
            document.getElementById("custom-dialogIsert").style.display = "none";
        } else if(barcodeNew==""){
            document.getElementById("alertShifra").style.display = "block";
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
    
                document.getElementById("custom-dialogIsert").style.display = "none";
                document.getElementById("menuToShow").style.display = "block"; 
            }else {
                document.getElementById('btnConfirm').disabled = true;
                document.getElementById("btnInsertNew").disabled = true;
    
                document.getElementById('btnConfirm').style.opacity = 0.5;
                document.getElementById("btnInsertNew").style.opacity = 0.5;
                document.getElementById('result').innerText = "";
                document.getElementById('result').innerHTML = `<p style='color:orange'>Додадено, ${barcodeNew} Disk<br>
                -> Основното средство е додадено во новиот диск</p>`;
                
                globalThis.newProductArray.push({
                    code: barcodeNew,
                    barcode: barcodeNew,
                    name: naziv
                    });
                // alert(globalThis.newProductArray.length);
                document.getElementById('naziv').value="";
                document.getElementById('shifra').value="";
    
                document.getElementById("custom-dialogIsert").style.display = "none";
                document.getElementById("menuToShow").style.display = "block";
            }
        }
    }
    ,false);

    document.getElementById('insertClose').addEventListener('click',function(){
        document.getElementById("custom-dialogIsert").style.display = "none";  
        document.getElementById("menuToShow").style.display = "block";
    },false);

document.getElementById('btnReset').addEventListener('click', function() {
    document.getElementById("custom-dialog").style.display = "none";
    document.getElementById("menuToShow").style.display = "none";
    document.getElementById("homePage").style.display = "none";
    document.getElementById("confirmAlert").style.display = 'block';
});

document.getElementById('btnYes').addEventListener('click',function(){
    globalThis.newProductArray = [];
    document.getElementById('result').innerHTML = "<p style='color:green'>Нов попис е ресетиран!</p>";
    document.getElementById("confirmAlert").style.display = 'none';
    document.getElementById("menuToShow").style.display = "block";
    document.getElementById("homePage").style.display = "block";
    },false);
 document.getElementById('btnNo').addEventListener('click',function(){
        document.getElementById('result').innerText = "";
        document.getElementById("confirmAlert").style.display = 'none';
        document.getElementById("menuToShow").style.display = "block";
        document.getElementById("homePage").style.display = "block";
    },false);

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
                        document.getElementById('result').innerHTML = 
                        "<p style='color:green'>Успечно вчитан фајл од средства</p>";
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
            document.getElementById('result').innerHTML = "<p style='color:green'>Успечно креиран фајл</p>";
            document.getElementById("menuToShow").style.display = "block";
            document.getElementById("homePage").style.display = "block";
            document.getElementById("Reviews").style.display = "none";
            document.getElementById('custom-dialog').style.display = 'none';
        }else{
            document.getElementById("alertError").style.display = "block";
            document.getElementById("menuToShow").style.display = "none";
            document.getElementById("homePage").style.display = "none";
            document.getElementById("Reviews").style.display = "none";
        }
        document.getElementById('custom-dialog').style.display = 'none';
        });
        
        document.getElementById('closeError').addEventListener('click',function(){
            document.getElementById("alertError").style.display = "none";
            document.getElementById("menuToShow").style.display = "block";
            document.getElementById("homePage").style.display = "block";
            },false);



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
            //   alert(data);

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