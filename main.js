let fixSize = () => {if(window.innerWidth>515 || window.innerHeight>540 || window.innerWidth<515 || window.innerHeight<540) window.resizeTo(515,540);};
setInterval(fixSize,100);
let globalStringCompressed=[];
let fileName="";
let LZW = {
    compress: function (uncompressed) {
        "use strict";
        // Build the dictionary.
        let i, dictionary = {}, c, wc, w = "", result = [], dictSize = 256, stringResult="";
        for (i = 0; i < 256; i += 1) dictionary[String.fromCharCode(i)] = i;
        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            //Do not use dictionary[wc] because javascript arrays
            //will return values for array['pop'], array['push'] etc
            // if (dictionary[wc]) {
            if (dictionary.hasOwnProperty(wc)) w = wc;
            else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }
        // Output the code for w.
        if (w !== "") result.push(dictionary[w]);
        for (let i=0;i<result.length;i++) globalStringCompressed[i]=result[i];
        for (let i=0;i<result.length;i++) result[i]=result[i].toString(2);
        for (let i=0;i<result.length;i++) i===0?stringResult+=result[i]:stringResult+=" "+result[i];
        return stringResult;
    },
    decompress: function (compressed) {
        "use strict";
        // Build the dictionary.
        let i, dictionary = [], w, result, k, entry = "", dictSize = 256;
        for (i = 0; i < 256; i += 1) dictionary[i] = String.fromCharCode(i);
        w = String.fromCharCode(compressed[0]);
        result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) entry = dictionary[k];
            else {
                if (k === dictSize) entry = w + w.charAt(0);
                else return null;
            }
            result += entry;
            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);
            w = entry;
        }
        return result;
    }
}; // For Test Purposes
let compressContent = document.getElementById('left');
let decompressContent = document.getElementById('right');
let compressedString="";
let isOpendForCompress=false;
let Compress, Decompress, FileContent = document.getElementById("fileContent"), FileContentDec=document.getElementById("decompressContent");
let compressFile = () => {
    compressContent.textContent = "";
    isOpendForCompress=true;
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = function () {
        let fr = new FileReader();
        fr.onload = function (info) {
            compressedString = info.target.result.toString();
            FileContent.textContent = compressedString;
            Compress = LZW.compress(compressedString);
            compressContent.textContent = Compress;
        };
        fileName = this.files[0].name;
        fr.readAsText(this.files[0], "CP1251");
    };
    input.click();
};
let decompressedString="";
let isOpendForDecompress=false;
let decompressFile = () => {
    decompressContent.textContent = "";
    isOpendForDecompress=true;
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = function () {
        let fr = new FileReader();
        fr.onload = function (info) {
            decompressedString = info.target.result.toString();
            FileContentDec.textContent = decompressedString;
            decompressedString=decompressedString.split(" ");
            for (let i=0;i<decompressedString.length;i++) decompressedString[i]=parseInt(decompressedString[i],2);
            Decompress = LZW.decompress(decompressedString);
            decompressContent.textContent = Decompress;
        };
        fileName = this.files[0].name;
        fr.readAsText(this.files[0], "CP1251");
    };
    input.click();
};
let saveCom = () =>{
    if (!isOpendForCompress) alert("You haven't compressed any file!");
    else {
        let textToWrite = document.getElementById("left").textContent;
        console.log(textToWrite);
        let textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
        //var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
        let downloadLink = document.createElement("a");
        downloadLink.download = fileName;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null) {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        } else {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    }
};
let saveDec = () => {
    if (!isOpendForDecompress) alert("You haven't decompessed any file!");
    else {
        let textToWrite = document.getElementById("right").textContent;
        console.log(textToWrite);
        let textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
        //var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
        let downloadLink = document.createElement("a");
        downloadLink.download = fileName;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null) {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        } else {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    }
};