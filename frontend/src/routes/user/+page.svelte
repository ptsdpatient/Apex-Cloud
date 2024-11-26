<script>
    import { onMount } from 'svelte';
    import * as XLSX from 'xlsx';

    let workbookName=''
    let visible=false
    let username='Tanishq Dhote',email='tanishqbakka1@gmail.com'
    let token
    let uploadOpen=false
    let receipt
    let uploadFolder=false
    let payment_id=''
    let files=[]
    let workbook=[
        {
    name: 'Sheet 1',
    data: [
      ["w"],[],[],[] 
    ]
  },
    ]
    let excelSheets=[
        'Sheet 1'        
    ]
    function addRows(numRows = 10) {
        workbook[sheetIndex].data = extendExcelData(workbook[sheetIndex].data, workbook[sheetIndex].data.length + numRows, workbook[sheetIndex].data[0].length);
    }

    function addColumns(numCols = 5) {
    const targetCols = workbook[sheetIndex].data[0].length + numCols;
    workbook[sheetIndex].data = extendExcelData(workbook[sheetIndex].data, workbook[sheetIndex].data.length, targetCols, true);
    }

    
    function generateExcelTable(rows, columns) {
        function generateColumnHeaders(limit) {
            const headers = [];
            for (let i = 0; i < limit; i++) {
            let header = '';
            let index = i;
            while (index >= 0) {
                header = String.fromCharCode((index % 26) + 65) + header;
                index = Math.floor(index / 26) - 1;
            }
            headers.push(header);
            }
            return headers;
        }

        if (rows <= 0 || columns <= 0) {
            throw new Error('Rows and columns must be greater than 0');
        }

        const columnHeaders = generateColumnHeaders(columns);

        const table = new Array(rows + 1).fill(null).map(() => new Array(columns + 1).fill(''));

        for (let col = 1; col <= columns; col++) {
            table[0][col] = columnHeaders[col - 1];
        }

        for (let row = 1; row <= rows; row++) {
            table[row][0] = row.toString();
        }

        return table;
    }

    workbook[0].data = generateExcelTable(100,100);
    workbook[0].data=extendExcelData([],100,100,true)


    let url='http://localhost:2000/api'
    let panelButtons=["Dashboard","Excel","Docs","Notifications","Bookmarks","Bin","Subscriptions"] 
    let operationButtons=["Download","Move Files"]
    let currentFiles=[]
    let subscriptions=[]
    let subscription=''
    let currentDirectory=[]
    let filePath='/'+currentDirectory.join("/")
    let showSubscriptions=false
    let folderName=''
    let sheetIndex=0
    let captchaImage='';
    let currentPanel=1
    let payment=false
    let purchaseStorageSpace=1
    let purchaseFullName=''
    let purchaseMobile=''
    let purchaseEmail=''
    let purchaseUPI=''
    let purchaseCaptcha=''
    let spaceRate = 12
    let qrImage=`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49 49" shape-rendering="crispEdges"><path fill="#ffffff" d="M0 0h49v49H0z"/><path stroke="#000000" d="M4 4.5h7m1 0h1m6 0h5m2 0h3m1 0h1m1 0h1m3 0h1m1 0h7M4 5.5h1m5 0h1m3 0h5m1 0h2m1 0h1m8 0h1m1 0h3m1 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m2 0h1m1 0h3m1 0h2m2 0h1m1 0h1m3 0h1m2 0h3m1 0h1m1 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h1m2 0h3m1 0h3m2 0h2m1 0h1m2 0h1m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h2m1 0h4m3 0h1m1 0h4m1 0h3m1 0h1m2 0h1m1 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m1 0h1m1 0h2m1 0h1m5 0h1m5 0h1m2 0h1m1 0h3m1 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 11.5h2m1 0h4m1 0h2m3 0h3m3 0h1m1 0h4M4 12.5h1m3 0h1m1 0h3m1 0h2m1 0h1m3 0h3m1 0h2m1 0h1m2 0h4m2 0h5m2 0h1M4 13.5h1m6 0h1m2 0h2m1 0h1m1 0h2m1 0h1m1 0h4m1 0h5m4 0h1m1 0h1m1 0h3M5 14.5h2m2 0h2m1 0h2m3 0h2m2 0h2m1 0h1m2 0h3m1 0h1m1 0h2m1 0h1m1 0h1m2 0h1m1 0h2M5 15.5h5m4 0h3m1 0h9m4 0h1m1 0h2m2 0h2m2 0h1m2 0h1M6 16.5h3m1 0h3m3 0h1m1 0h1m1 0h4m1 0h2m1 0h1m1 0h3m2 0h2m6 0h2M4 17.5h1m1 0h2m1 0h1m3 0h1m1 0h1m1 0h1m2 0h1m2 0h2m4 0h1m3 0h3m3 0h2m3 0h1M5 18.5h1m1 0h2m1 0h3m1 0h2m2 0h4m2 0h2m5 0h1m1 0h3m3 0h4m1 0h1M6 19.5h1m4 0h1m1 0h1m1 0h1m4 0h3m2 0h1m2 0h1m1 0h7m2 0h1m1 0h1m1 0h2M5 20.5h1m1 0h1m2 0h1m2 0h4m2 0h1m1 0h7m5 0h1m2 0h1m4 0h1m1 0h1M4 21.5h1m1 0h1m1 0h2m1 0h1m1 0h1m4 0h1m3 0h2m1 0h1m1 0h1m1 0h2m1 0h2m4 0h1m1 0h2m2 0h1M4 22.5h2m1 0h1m2 0h1m2 0h1m1 0h7m5 0h1m3 0h1m2 0h1m1 0h2m1 0h2m3 0h1M6 23.5h1m1 0h1m3 0h1m1 0h3m1 0h1m2 0h3m2 0h3m1 0h3m5 0h4m1 0h2M5 24.5h1m1 0h4m2 0h1m2 0h1m2 0h1m2 0h2m2 0h1m1 0h4m4 0h1m4 0h1M4 25.5h1m4 0h1m5 0h1m3 0h3m5 0h1m1 0h1m1 0h1m1 0h2m3 0h2m3 0h2M5 26.5h4m1 0h1m2 0h4m1 0h1m1 0h3m2 0h3m3 0h1m2 0h1m3 0h2m1 0h1m2 0h1M6 27.5h3m2 0h1m7 0h4m2 0h1m1 0h2m1 0h1m1 0h3m2 0h1m2 0h1m2 0h1M5 28.5h1m2 0h1m1 0h1m1 0h5m3 0h3m1 0h3m5 0h2m1 0h3m4 0h1M5 29.5h4m2 0h1m1 0h1m2 0h1m1 0h1m1 0h1m4 0h3m1 0h3m6 0h5m1 0h1M5 30.5h1m1 0h2m1 0h1m2 0h3m4 0h1m3 0h5m1 0h2m1 0h2m4 0h1m4 0h1M6 31.5h1m4 0h1m2 0h2m3 0h3m1 0h1m1 0h1m1 0h1m3 0h4m2 0h1m3 0h1m2 0h1M4 32.5h3m1 0h1m1 0h1m2 0h3m5 0h7m2 0h1m4 0h1m1 0h2m2 0h1M4 33.5h1m3 0h2m2 0h1m3 0h1m2 0h2m2 0h1m1 0h2m1 0h3m1 0h1m2 0h2m2 0h3M6 34.5h3m1 0h2m4 0h2m4 0h2m3 0h4m1 0h3m1 0h1m3 0h3m1 0h1M6 35.5h1m4 0h1m2 0h3m1 0h1m2 0h1m1 0h3m1 0h1m2 0h1m2 0h2m4 0h1m1 0h1m1 0h2M4 36.5h2m1 0h5m1 0h1m3 0h2m2 0h1m2 0h1m1 0h1m1 0h2m1 0h1m3 0h6M12 37.5h1m2 0h1m3 0h1m1 0h2m3 0h1m3 0h1m1 0h1m1 0h3m3 0h1M4 38.5h7m1 0h2m1 0h3m2 0h1m1 0h1m1 0h8m1 0h1m1 0h2m1 0h1m1 0h3m1 0h1M4 39.5h1m5 0h1m3 0h6m3 0h3m1 0h3m3 0h4m3 0h2m2 0h1M4 40.5h1m1 0h3m1 0h1m1 0h2m2 0h5m2 0h2m2 0h1m1 0h1m4 0h7M4 41.5h1m1 0h3m1 0h1m3 0h3m1 0h1m1 0h1m1 0h1m3 0h1m3 0h1m1 0h1m3 0h2m1 0h1m1 0h3M4 42.5h1m1 0h3m1 0h1m2 0h1m3 0h5m2 0h1m1 0h8m5 0h1m4 0h1M4 43.5h1m5 0h1m3 0h1m1 0h1m3 0h4m1 0h1m1 0h2m2 0h1m1 0h1m1 0h2m1 0h1m4 0h2M4 44.5h7m1 0h2m1 0h1m1 0h1m1 0h3m1 0h1m1 0h4m4 0h1m2 0h1m1 0h1m2 0h3"/></svg>`


    

    function extendExcelData(data, targetRows, targetCols, isColumnExtension) {
    // Function to generate column headers like A, B, C, D, etc.
    function generateColumnHeaders(limit) {
        const headers = [];
        for (let i = 0; i < limit; i++) {
            let header = '';
            let index = i;
            while (index >= 0) {
                header = String.fromCharCode((index % 26) + 65) + header;
                index = Math.floor(index / 26) - 1;
            }
            headers.push(header);
        }
        return headers;
    }

    const currentRows = data.length;
    const currentCols = data[0] ? data[0].length : 0;

    // Generate column headers based on targetCols
    const columnHeaders = generateColumnHeaders(Math.max(targetCols, currentCols) - 1);

    const extendedData = [];

    // 1. Handle the header row (the first row with column labels) only once
    if (extendedData.length === 0) {
        const headerRow = ['#']; // Initialize top-left cell empty for the header row
        for (let col = 0; col < targetCols - 1; col++) {
            headerRow.push(columnHeaders[col]);
        }
        extendedData.push(headerRow);
    }

    // 2. Start adding the data starting from row 2 (i.e., B2, C2, etc.)
    for (let i = 0; i < currentRows; i++) {
        const newRow = Array(targetCols).fill('');
        newRow[0] = (i + 1).toString(); // Reference number for the row (1, 2, 3, etc.)

        // If data exists for this row, fill it; otherwise leave cells empty
        for (let j = 0; j < currentCols; j++) {
            newRow[j + 1] = data[i][j]; // Start filling from column B (index 1)
        }

        extendedData.push(newRow);
    }

    // 3. Adjust each row to ensure it matches the target number of columns
    for (let i = 0; i < extendedData.length; i++) {
        const row = extendedData[i];
        for (let col = row.length; col < targetCols; col++) {
            row[col] = '';
        }
    }

    // 4. If the target number of rows is greater than the current rows, add more empty rows
    if (targetRows > currentRows) {
        for (let i = currentRows; i < targetRows; i++) {
            const newRow = Array(targetCols).fill('');
            newRow[0] = (i + 1).toString(); // Reference number for the row
            extendedData.push(newRow);
        }
    }

    return extendedData;
}









    function downloadExcelWorkbook(){

    const downloadWorkbook = XLSX.utils.book_new();
    let downloadIndex=0
    let modifiedData=[]
    workbook.forEach((sheet) => {
        modifiedData = sheet.data.slice(1).map(row => row.slice(1));
        const worksheet = XLSX.utils.aoa_to_sheet(modifiedData);
        XLSX.utils.book_append_sheet(downloadWorkbook, worksheet, excelSheets[downloadIndex]);
        downloadIndex++;
    });

    XLSX.writeFile(downloadWorkbook, `${!workbookName?"newWorkbook":workbookName}.xlsx`);
    console.log("Downloading Excel workbook...");
    }

    async function confirmCaptcha(){
        try{
            const response = await fetch(`${url}/checkout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify({
                        solution:purchaseCaptcha,
                        storage:purchaseStorageSpace,
                        amount:purchaseStorageSpace*spaceRate,
                        name: purchaseFullName,
                        mobile: purchaseMobile,
                        email: purchaseEmail,
                        upi: purchaseUPI
                })
            });

            const data = await response.json();

            if(data.done){
                payment=true
                qrImage=data.qr
                payment_id=data.id
            }else{
                captchaImage=data.captcha
            }
        }catch(err){

        }
    }


    async function getCaptcha(){
        
        try{
            const response = await fetch(`${url}/captcha`, {
                method: 'GET',
                // headers: {
                //         'Authorization': `Bearer ${token}`, 
                //     }
            });
            const data = await response.json();
            captchaImage=data.captcha
        }catch(err){

        }
    }

    async function uploadFiles(formData){
        
        try {
            const response = await fetch(`${url}/upload`, {
                method: 'POST',
                headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                body: formData
            });

        } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during the upload.');
        }
    }

    const handleFilesChange=(event)=>{
        // if(payment){
        //     receipt = event.target.files;
        //     for(const r of receipt){
        //         alert(r.webkitRelativePath)
        //     }

        //     for (const file of files) {
        //         const formData = new FormData();
        //         const fullPath = file.webkitRelativePath;
        //         const directoryPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
        //         formData.append('files', file);
        //         formData.append('filePath',`${filePath}/${directoryPath}/`);
        //         uploadFiles(formData)                
        //     }            
        //     return
        // }
        files = event.target.files; 

        if(uploadFolder){
            for (const file of files) {
                const formData = new FormData();
                const fullPath = file.webkitRelativePath;
                const directoryPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
                formData.append('files', file);
                formData.append('filePath',`${filePath}/${directoryPath}/`);
                formData.append('sub',subscription)
                uploadFiles(formData)                
            }            
        }else {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });
            formData.append('filePath', filePath);
            formData.append('sub',subscription)
            uploadFiles(formData)
        }
    };

    function logout(){
        localStorage.removeItem("apex_cloud")
        window.location="/"
    }


    async function getSubscriptions() {
            try {
                const response = await fetch(`${url}/getSubscriptions`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json'
                    }
                });
    
                const data = await response.json();
                
                console.log(data)

                subscriptions = data
                subscription=subscriptions[0].sub_name
                getFiles()

            } catch (error) {
                // console.error('Error during token authentication:', error);
                // alert("An error occurred while authenticating the token.");
            }
    }

    async function getFiles() {
            try {
                const response = await fetch(`${url}/getFiles`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify({ 
                        path:filePath,
                        sub:subscription                       
                    })
                });
    
                const data = await response.json();
                
            
                currentFiles = data.map(file => {
                    return {
                        ...file, 
                        selected:false,
                        active:true
                    };
                });

                if(currentDirectory.length<15){
                    for(let i=0;i<15;i++){
                        currentFiles=[...currentFiles,{name:"",active:false,isDirectory:false}]
                    }
                }

            } catch (error) {
                // console.error('Error during token authentication:', error);
                // alert("An error occurred while authenticating the token.");
            }
    }

    function previousFolder(){
        if(currentDirectory.length>0){
            currentDirectory=currentDirectory.slice(0,-1 );
            filePath='/'+currentDirectory.join("/")
            getFiles()
        }
    }

    function gotoFolder(index){
        // if(index<1) return
        currentDirectory = currentDirectory.slice(0, index+1);
        filePath='/'+currentDirectory.join("/")
        getFiles()
    }

    function openFolder(file){
        currentDirectory=[...currentDirectory,file.name]
        filePath='/'+currentDirectory.join("/")
        getFiles()
    }

    async function confirmPayment(){
        const formData = new FormData()
        formData.append('receipt',receipt)
        try{
            const response = await fetch(`${url}/confirmPayment`,{
                method: 'POST',
                headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                body: formData
            })

            const data = await response.json()

            alert(data)

        }catch(err){

        }
    }

    async function handleFileEdit(file){
        try {
                const response = await fetch(`${url}/editFile`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify({ 
                        filePath:filePath,
                        name:file.name,
                        sub:subscription                       
                    })
                });
    
                const data = await response.json();
                
                workbook = Object.keys(data).map(sheetKey => ({
                    name: data[sheetKey].name,
                    data: data[sheetKey].data
                }));
                

                excelSheets=[]
                
                workbook.forEach(sheet => {
                    try{
                        console.log(JSON.stringify(sheet.data, null, 2))
                        sheet.data = extendExcelData(sheet.data, 100, 50,true);
                    }catch(err){
                        alert('error occured : '+err)
                    }
                    
                    excelSheets.push(sheet.name);
                });


                sheetIndex=0                
                // excelData = extendExcelData(data.data, 100, 50);
                currentPanel=1    
                workbook=[...workbook]
                                   

            } catch (error) {
                // console.error('Error during token authentication:', error);
                // alert("An error occurred while authenticating the token.");
            }
    }

    async function createFolder() {
        try {
            const response = await fetch(`${url}/createFolder`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                },body:JSON.stringify({
                    path:filePath
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Authenticated user:', data);
                if(data.error)window.location='/'
                
            } else {
                alert(data.error || 'Token is invalid');
                window.location='/'
            }
        } catch (error) {
            console.error('Error during token authentication:', error);
            alert("An error occurred while authenticating the token.");
        }
    }


    function changeSubscription(sub){
        subscription=sub;
        showSubscriptions=false;
        currentDirectory=[]
        filePath='/'
        getFiles()
    }

    async function authenticateToken() {
            try {
                const response = await fetch(`${url}/authenticateToken`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json'
                    }
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    console.log('Authenticated user:', data);
                    if(data.error)window.location='/'
                   
                } else {
                    alert(data.error || 'Token is invalid');
                    window.location='/'
                }
            } catch (error) {
                console.error('Error during token authentication:', error);
                alert("An error occurred while authenticating the token.");
            }
    }


            function updateCell(rowIndex, cellIndex, event) {
            excelData[rowIndex][cellIndex] = event.target.textContent.trim();
            }
    
    
    onMount(()=>{
        token=localStorage.getItem("apex_cloud")
        authenticateToken()
        getSubscriptions()
        getCaptcha()
    })
    </script>
    
    <title>Apex Cloud | {username}</title>
    
    <div class="{payment?"flex":"hidden"} bg-black bg-opacity-70 p-6 fixed z-50" style="height:100svh;width:100vw;">
        <div class="bg-gray-100 rounded-3xl h-full w-full flex flex-row">
           
            <div class="w-full flex flex-col relative  h-full">
               
                <div class="flex bg-white p-6 relative h-full rounded-3xl m-10 pt-5 flex-row justify-between">
                    <div class="w-full absolute top-0 right-0 flex justify-end flex-row">
                        <button on:click={payment=false} class="hover:text-white text-red-700 hover:bg-red-500 py-3 px-5 mr-4 mt-3 transition-all duration-200 rounded-3xl  text-4xl font-bold z-50">✕</button>
                    </div>

                    <div class="h-full flex flex-col flex-grow">
                        <div class="">
                            {@html qrImage}
                        </div>
                        <div class="text-xl pl-5">Scan this QR code to pay for the subscription</div>
                    </div>
                    <div class="flex flex-row text-xl flex-col gap-2 h-full w-3/4">
                    
                        <div class="flex h-full flex-col mt-5 gap-2">
                            <div class="text-2xl pb-3 font-semibold">Payment Details </div>
                            <div class="flex flex-row items-center gap-2">Payment ID : <div class="font-semibold">{payment_id}</div></div>
                            <div class="flex flex-row items-center gap-2">Full Name : <div class="font-semibold">{purchaseFullName}</div> </div>
                            <div class="flex flex-row items-center gap-2">Email ID : <div class="font-semibold">{purchaseEmail}</div> </div>
                            <div class="flex flex-row items-center gap-2">Mobile number : <div class="font-semibold">{purchaseMobile}</div> </div>
                            <div class="flex flex-row items-center gap-2">UPI id : <div class="font-semibold">{purchaseUPI}</div></div>
                            <div class="flex flex-row items-center gap-2">Total Amount : <div class="font-semibold">{purchaseStorageSpace*spaceRate} Rs</div> </div>  
                        </div>
                        <form on:submit={confirmPayment} class="flex flex-row gap-4">
                            <button class="border relative border-1 border-blue-500 rounded-xl px-3 py-2 text-blue-500 hover:bg-blue-500 hover:text-white duration-200 transition-all ease-in-out">Upload Receipt
                                
                                <input on:change={handleFilesChange} class="h-full absolute left-0 top-0 w-full opacity-0" required type="file">
                            </button>
                            <button type="submit" class="border border-1 border-green-500 rounded-xl px-3 py-2 text-green-500 hover:bg-green-500 hover:text-white duration-200 transition-all ease-in-out">Confirm Payment</button>
                        </form>
                    </div>
                    <img class=" absolute bottom-0 right-0 w-1/3 p-5" src="qr_ill.png" alt="qr">
                </div>
            </div>
        </div>
    </div>
    
    <div class="flex flex-col" style="width:100vw;height:100svh">
        <div class="flex flex-grow justify-around flex-row bg-gray-200">
            <div class="w-1/4 flex flex-col items-left align-left gap-2  h-full rounded-lg overflow-y-auto p-4 justify-between">
                <div class="flex flex-row gap-4 items-center overflow-x-hidden ">
                    <img class="w-10 py-1" src="/logo.png" alt="">                    
                    <div class="flex flex-col items-left  overflow-x-auto">
                        <div class="text-lg">{username}</div>
                        <div class="text-sm ">{email}</div>
                    </div>
                </div>   
                
                <div class="w-full text-lg text-white relative rounded-3xl flex flex-row justify-between items-center ">
                    <div class=" relative flex flex-grow hover:bg-blue-600 rounded-tl-3xl rounded-bl-3xl transition-all duration-300 ease-in-out bg-blue-500 text-center justify-center">
                        <div class="py-2 text-center">Upload {uploadFolder?"Folder":"Files"}</div>
                        <input on:change={handleFilesChange} class="w-full  h-full absolute opacity-0" type="file" multiple webkitdirectory={uploadFolder}>
                    </div>
                    <button on:click={uploadOpen=!uploadOpen} class="px-5 py-2 rounded-tr-3xl rounded-br-3xl  bg-blue-500 hover:bg-blue-600 duration-300 ease-in-out transition-all group"><div class="transition-all duration-300 ease-in-out transform -scale-x-100 group-hover:rotate-90" >〱</div></button>
                    <div class="top-full bg-blue-500 text-white my-1 rounded-3xl text-lg absolute {uploadOpen?"flex":"hidden"} flex-col w-full z-40">
                        <button class="py-2  duration-200 transition-all hover:bg-blue-600 rounded-tr-3xl rounded-tl-3xl" on:click={()=>{uploadOpen=false;uploadFolder=false}}>Upload Files</button>
                        <button class="py-2  duration-200 transition-all hover:bg-blue-600 rounded-br-3xl rounded-bl-3xl" on:click={()=>{uploadOpen=false;uploadFolder=true}}>Upload Folders</button>
                    </div>
                </div>             

            
                {#each panelButtons as button,index}
                    <button on:click={()=>{currentPanel=index;if(currentPanel===5)getCaptcha()}} class="{currentPanel==index?"bg-white":""} hover:bg-gray-100 focus:bg-white flex pl-5 py-2 flex-row items-center transform transition-all duration-100 focus:outline-none  hover:scale-105 outline-none focus:scale-105  rounded-3xl">
                        <img class="" style="width:24px;height:24px;" src='{button}.png' alt="">
                        <div class="pl-3 w-full text-left text-lg">{button}</div>                        
                    </button>
                {/each}
                <button on:click={logout} class="text-lg py-2 text-white px-4 transition-all bg-gray-500 hover:bg-red-600 duration-200 rounded-3xl">Logout</button>

            </div>
            
                
                
                {#if currentPanel === 0}
                <div class="w-3/4 flex p-2 flex-col overflow-x-hidden">
                    <div class="w-full h-full flex flex-col bg-white rounded-2xl">
                        <div class="flex flex-row gap-2  py-3 overflow-x-auto">
                            <button class="px-4 inline-block whitespace-nowrap text-lg rounded-2xl py-1 transition-all hover:bg-gray-100 text-black hover:shadow-sm ease-in-out duration-100">Select All</button>
    
                            <input placeholder="⌕ Search Files" class="focus:outline-none bg-gray-100 flex flex-grow placeholder-black text-lg pl-4 rounded-2xl">
    
                            {#each operationButtons as button}
                                <button class="px-4 inline-block whitespace-nowrap text-lg rounded-2xl py-1 transition-all hover:bg-gray-100 text-black hover:shadow-sm ease-in-out duration-100">{button}</button>
                            {/each}
                        </div>
                        
                        <div class="flex flex-row relative w-full text-xl justify-between py-2 px-2 gap-3 shadow-sm">
                            <div class="flex flex-row  overflow-x-hidden">
                                <button on:click={previousFolder} class=" px-4 text-xl rounded-2xl py-1 mr-2 hover:bg-gray-100 text-black transition-all ease-in-out duration-100">←</button>
                                
                                <div class="items-center bg-white align-center flex flex-col  whitespace-nowrap overflow-y-auto overflow-visible" style="z-index:40">
                                    <button on:click={()=>{showSubscriptions=!showSubscriptions}} class="transform hover:bg-opacity-50 hover:bg-gray-200  px-2 py-1 transition-all duration-100 ease-in-out rounded-xl flex flex-row items-center justify-between gap-3 group">
                                        <div>
                                            {#if subscription.length > 26}
                                                {subscription.substring(0, 24) + '...'}
                                            {:else}
                                                {subscription}
                                            {/if}
                                        </div>
                                        <div class="transition-all duration-300 ease-in-out transform -scale-x-100 {!showSubscriptions?"":"rotate-90"}">〱</div>
                                    </button>
                                    <div class="absolute flex-col bg-gray-200 rounded-br-3xl shadow-xl rounded-bl-3xl p-3  w-1/2 justify-around gap-2 top-full left-0 {showSubscriptions?"flex":"hidden"} overflow-y-auto" style="z-index:40;">
                                        
                                        <div class="flex flex-col gap-2" style="max-height:250px;">                                        
                                            {#each subscriptions as sub}
                                                <button on:click={()=>changeSubscription(sub.sub_name)} class="transform w-full bg-white {((sub.usage/(sub.storage))*100)>80?"hover:bg-red-500 ":((sub.usage/(sub.storage))*100)>60?"hover:bg-orange-500":((sub.usage/(sub.storage))*100)>40?"hover:bg-yellow-500":"hover:bg-green-500"} hover:text-white hover:shadow-xl transition-all duration-200 ease-in-out rounded-xl flex flex-row items-center justify-between gap-3 group pl-1 flex flex-row justify-between">
                                                    <div class="max-w-4 inline-block whitespace-nowrap pl-2 py-1">
                                                        {#if sub.sub_name.length > 26}
                                                            {sub.sub_name.substring(0, 24) + '...'}
                                                        {:else}
                                                            {sub.sub_name}
                                                        {/if}
                                                    </div>
                                                    <div class="px-2 py-1 rounded-tr-xl rounded-br-xl">{sub.usage}/{sub.storage} GB</div>
                                                </button>
                                            {/each}                              
                                        </div>
                                        <button on:click={()=>{currentPanel=5;showSubscriptions=false;getCaptcha()}} class="transform bg-blue-500 text-white transform transition-all duration-200 ease-in-out rounded-xl flex flex-row items-center gap-3 group px-2 py-1 w-full text-center flex flex-row justify-center"><div>Get More Storage +</div></button>
                                    </div>                                    
                                </div> 
                                
                                <div class="flex relative flex-row text-xl overflow-x-auto items-center">                                
                                    
                                                                
    
                                    {#each currentDirectory as folder,index}
                                        {#if currentDirectory.length>4 && (index>1 && index <currentDirectory.length-1)}
                                            <div class="items-center align-center flex flex-row">
                                                <button on:click={()=>{gotoFolder(index)}} class="transform hover:bg-opacity-50 hover:bg-gray-200 px-2 py-1 transition-all duration-100 ease-in-out rounded-xl">.</button>
                                            </div>                                
                                        {:else}
                                            <div class="items-center align-center flex flex-row inline-block whitespace-nowrap items-center">
                                                <button on:click={()=>{gotoFolder(index)}} class="transform hover:bg-opacity-50 hover:bg-gray-200  px-2 py-1 transition-all duration-100 ease-in-out rounded-xl">{folder}</button>
                                                <pre>/</pre>
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                            <button class="px-4 mr-4 text-lg inline-block whitespace-nowrap rounded-2xl py-1  transition-all bg-gray-500 hover:bg-blue-500 text-white hover:shadow-xl transform hover:scale-105 ease-in-out duration-100">New Folder</button>
                        </div>
    
    
    
                        <div class="bg-white flex flex-grow overflow-y-auto" style="height:0vh;">
                            
                            <table class="w-full border-collapse text-xl overflow-y-auto">
                                <thead class="text-black bg-white my-4">
                                <tr class="shadow-sm">
                                    <td class=" whitespace-nowrap py-3 text-left pl-5 w-6/12 hover:bg-gray-100 hover:shadow-sm  hover:cursor-pointer transition-all ease-in-out "><button class="w-full flex flex-row justify-between pr-5 gap-4"><div>File Name</div><img src="sort.png" alt="sort"></button></td>
                                    <td class=" whitespace-nowrap py-3 text-left pl-5 w-3/12 hover:bg-gray-100 hover:shadow-sm  hover:cursor-pointer transition-all ease-in-out"><button class="w-full flex flex-row justify-between pr-5 gap-4"><div>Last Modified</div><img src="sort.png" alt="sort"></button></td>
                                    <td class=" whitespace-nowrap py-3 text-left pl-5 w-3/12 hover:bg-gray-100 hover:shadow-sm  hover:cursor-pointer transition-all ease-in-out"><div>Actions</div></td>
                                </tr>
                                </thead>
                                <tbody class="">
                                    {#each currentFiles as files,index}
                                        <tr class=" {files.selected?"bg-blue-100":"hover:bg-gray-100"} {files.active?"hover:cursor-pointer":"opacity-0"} hover:shadow-sm rounded-xl  transition-all ease-in-out" >
                                            <td  class=" text-left flex flex-row  my-auto">
                                                <input bind:checked={files.selected} class="accent-blue-600 hover:cursor-pointer transform scale-150 mx-3 mr-5  {files.active?"block":"hidden"}" type="checkbox">
                                                <button on:click={()=>{(!files.isDirectory)?files.selected=!files.selected:openFolder(files)}} class="py-4  {files.active?"flex":"hidden"} flex-row items-center w-full">
                                                    <img class="my-auto mr-2" style="width:24px;height:24px;" src={files.isDirectory?"folder.png":"file.png"} alt={files.isDirectory?"Folder":"File"}>
                                                    <div class="inline-block whitespace-nowrap overflow-x-hidden flex" style="width: 100%">
                                                        {#if files.name.length > 35}
                                                            {#if files.name.includes('.')}
                                                                {files.name.substring(0, 30) + '...' + files.name.split('.').pop()}
                                                            {:else}
                                                                {files.name}
                                                            {/if}
                                                        {:else}
                                                            {files.name}
                                                        {/if}
                                                    </div>
                                                </button>
                                            </td>
                                            <td on:click={()=>{(!files.isDirectory)?files.selected=!files.selected:openFolder(files)}} class=" py-2 text-left pl-5"><div class=" inline-block whitespace-nowrap">{files.created_at}</div></td>
                                            <td class=" py-1 text-left pl-5">
                                                <div class="  {files.active?"flex":"hidden"} flex-row gap-4 text-2xl py-1">
                                                    <button on:click={()=>{alert("bookmark")}} class="hover:bg-yellow-300 px-2 py-2 rounded-xl duration-100 transition-all"><img src="Bookmarks.png" alt="bookmark"></button>
                                                    <button on:click={()=>{if(!files.isDirectory) {handleFileEdit(files)}}} disabled={files.isDirectory} class="hover:bg-blue-300 px-2 py-2 rounded-xl duration-100 transition-all"><img src="edit.png" alt="bookmark"></button>
                                                    <button on:click={()=>{alert("delete")}} class="hover:bg-red-400 px-2 py-2 rounded-xl duration-100 transition-all"><img src="Bin.png" alt="bookmark"></button>
                                                </div>                                    
                                            </td>
                                        </tr>    
                                    {/each}
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                </div>
                {:else if currentPanel===1}

                <!-- Excel Sheet Editor -->

                <div class="w-3/4 flex p-2 flex-col pl-2 py-2 gap-3" style="height:100svh;">
                    <div class="w-full h-full flex flex-col bg-white rounded-tl-2xl rounded-bl-2xl">
                        <div class="w-full flex flex-row p-3 gap-3">
                            <input bind:value={workbookName} placeholder="filename" class="focus:outline-none bg-gray-100 hover:bg-gray-200 placeholder-gray-400 text-lg w-1/4 pl-4 rounded-lg">
                            <button class="py-1 px-3 rounded-lg hover:bg-gray-100 flex flex-row items-center align-center gap-2"><img src="folder.png" alt=""><div>Open</div></button>
                            <button class="py-1 px-3 rounded-lg hover:bg-gray-100  flex flex-row items-center align-center gap-2"><img src="save.png" alt=""><div>Save</div></button>
                            <button on:click={downloadExcelWorkbook} class="py-1 px-3 rounded-lg hover:bg-gray-100  flex flex-row items-center align-center gap-2"><img src="download.png" alt=""><div>Download</div></button>
                            <button on:click={()=>{alert(workbook[sheetIndex].data)}} class="py-1 px-3 rounded-lg hover:bg-gray-100 flex flex-row items-center align-center gap-2"><img src="print.png" alt=""><div>Print</div></button>
                            <button on:click={() => addRows(10)} class="py-1 px-3 rounded-lg hover:bg-gray-100 flex flex-row items-center align-center gap-2">+<div>Rows</div></button>
                            <button on:click={() => addColumns(5)} class="py-1 px-3 rounded-lg hover:bg-gray-100 flex flex-row items-center align-center gap-2">+<div>Columns</div></button>

                        </div>


                        <div class="w-full flex flex-row pt-2 pl-4  justify-between pb-4">
                            <div class="flex flex-row gap-3 pb-1 overflow-x-auto" style="max-width:55%">
                                {#each excelSheets as sheet,index}
                                    <button on:click={()=>{return sheetIndex=index}} class="px-5 whitespace-nowrap {sheetIndex===index?"bg-gray-100":""} inline-block text-left py-1  rounded-xl hover:bg-gray-100 border-gray-200">{sheet}</button>
                                {/each}
                            </div>
                            <div class="flex flex-row justify-around">
                                <input placeholder="sheet name" class="focus:outline-none bg-gray-100 hover:bg-gray-200 placeholder-gray-400 text-lg w-1/2 pl-4 rounded-lg">
                                <button class="py-1 px-2 rounded-lg hover:bg-gray-100 flex flex-row items-center align-center gap-2">+<div>Create Sheet</div></button>
                            </div>
                        </div>

                        

                        <div class="w-full h-full rounded-bl-2xl overflow-y-auto">
                            <div class="overflow-y-hidden w-full overflow-y-hidden" style="min-width:1000vw;min-height:1000vh;">
                                    <table>
                                        <thead>
                                            <tr>
                                            {#each workbook[sheetIndex].data[0] as header, headerIndex}
                                                <th class="bg-white border border-gray-300 font-semibold text-gray-700 px-3 py-2" style="width: {headerIndex===0?"50":"180"}px;">
                                                {header || ''}
                                                </th>
                                            {/each}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {#each workbook[sheetIndex].data.slice(1) as row, rowIndex}
                                            <tr>
                                                {#each row as cell, cellIndex}
                                                <td contenteditable="true" 

                                                    class="bg-white  focus:outline-none border border-1 py-1 border-gray-300 {cellIndex===0?"text-center text-gray-700":""} px-3" >
                                                    {cell}
                                                </td>
                                                {/each}
                                            </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                    
                                
                                <!-- <div class="flex flex-row w-full">
                                    {#each excelData as item, index}
                                        <div class="bg-gray-100 border border-1 border-gray-300 px-3" style="width:180px;">{item}</div>
                                    {/each}
                                </div> -->


                            </div>
                        </div>
                    </div>
                </div>
                {:else if currentPanel===2}

                <!-- Docs File Editor -->

                <div class="w-3/4 flex p-2 flex-col bg-blue-500 " style="height:100svh;">
                                
                </div>
                {:else if currentPanel===5}
                <div class="w-3/4 flex p-2 flex-col  " style="height:100svh;">
                        <div class="w-full h-full flex flex-row bg-white rounded-2xl p-2 flex-grow overflow-y-auto" style="height:90vh">
                            <div class="w-1/2 p-4 gap-4 flex-col flex flex-col h-full ">
                                <div class="text-4xl mb-3">Get storage at <br>Apex Cloud</div>
                                <div class="flex flex-grow flex-col gap-4">
                                    <div class="text-base">Our payment system relies on custom made receipt confirmation technology, please fill in the correct details in the following form, if the information fails to match in the receipt or on our end we will take actions. for more help reach us out here <a class="text-blue-400" href="/help">help.</a> </div>
                                    <div class="text-base mb-5">Contact us if you encounter any issue or problem we will reach out to you immediately <br> +91 8459291118  </div>   
                                    <div class="text-base">We charge 12rs per GB per year, upon completion of each tenure you are given a window of 3 months in which if you fail to pay the amount your subscription access will be temporarily revoked.</div>

                                </div>


                            </div>
                            <div class="w-1/2 h-full text-xl px-5">
                                <form on:submit={confirmCaptcha} class="flex h-full justify-around flex-col gap-2">
                                    <div class="text-2xl mt-2 mb-1 pl-3">Please fill out the following details</div>
                                        <input  placeholder="full name ex. Tanishq Dhote" bind:value={purchaseFullName} class="border border-1 bg-gray-100 border-gray-100 px-2 py-1 rounded-lg focus:outline-none " type="text">
                                        <input  placeholder="mobile number ex. 8459291118" bind:value={purchaseMobile} class="border border-1 bg-gray-100 border-gray-100 px-2 py-1 rounded-lg focus:outline-none " type="text">
                                        <input  placeholder="email id ex. tanishqssg4@gmail.com" bind:value={purchaseEmail} class="border border-1 bg-gray-100 border-gray-100 px-2 py-1 rounded-lg focus:outline-none " type="text">
                                        <input  placeholder="upi id ex.tanishqssg4-1@oksbi" bind:value={purchaseUPI} class="border border-1 bg-gray-100 border-gray-100 px-2 py-1 rounded-lg focus:outline-none " type="text">
                                        
                                    <div class="flex flex-row justify-between gap-2 w-full items-center my-3">
                                        <div>I want</div>
                                        <input bind:value={purchaseStorageSpace}  placeholder="desired storage space ex.1GB,3GB etc" class="border border-1 bg-gray-100 flex flex-grow border-gray-100 py-1 rounded-lg focus:outline-none " max="100" min="1" type="range">
                                        <div class="">{purchaseStorageSpace} GB of space</div>
                                    </div>
                                    <div>Your subscription would cost<br> {purchaseStorageSpace*spaceRate} Rs per year</div>
                                    
                                    <div class="w-full flex flex-row justify-around items-center">
                                        <div>
                                            {@html captchaImage}
                                        </div>
                                        <input bind:value={purchaseCaptcha} class="border border-1 bg-gray-100 border-gray-100 px-2 py-1 rounded-lg focus:outline-none " placeholder="Enter Captcha" required type="text">
                                    </div>
                                    <button type="submit" class="text-lg py-2 my-auto text-white px-4 transition-all bg-gray-400 hover:bg-green-500 duration-200 rounded-xl">Continue</button>
                                </form>
                            </div>

                        </div>
                       
                    </div>
          
                {/if}
            </div>
        </div>
