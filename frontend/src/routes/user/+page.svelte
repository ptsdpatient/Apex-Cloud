<script>
    import { onMount } from 'svelte';
    
    let visible=false
    let username='Tanishq Dhote',email='tanishqbakka1@gmail.com'
    let token
    let uploadOpen=false
    let uploadFolder=false
    let purchaseStorageSpace=1
    let files=[]
    let url='http://localhost:2000/api'
    let panelButtons=["Dashboard","Shared","Notifications","Bookmarks","Bin","Subscriptions","Help"] 
    let operationButtons=["Download","Move Files"]
    let currentFiles=[]
    let subscriptions=[]
    let subscription=''
    let currentDirectory=[]
    let filePath='/'+currentDirectory.join("/")
    let showSubscriptions=false
    let folderName=''
    let captchaImage='';
    let currentPanel=5



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
        files = event.target.files; 
        if(uploadFolder){
            for (const file of files) {
                const formData = new FormData();
                const fullPath = file.webkitRelativePath;
                const directoryPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
                formData.append('files', file);
                formData.append('filePath',`${filePath}/${directoryPath}/`);
                uploadFiles(formData)                
            }            
        }else {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });
            formData.append('filePath', filePath);
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

    async function confirmCaptcha(){
        try{

        }catch(err){

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
    
    
    onMount(()=>{
        token=localStorage.getItem("apex_cloud")
        authenticateToken()
        getSubscriptions()
        getCaptcha()

    })
    </script>
    
    <title>Apex Cloud | {username}</title>
    
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
                        <img class="" src='{button}.png' alt="">
                        <div class="pl-3 w-full text-left text-lg">{button}</div>                        
                    </button>
                {/each}
                <button on:click={logout} class="text-lg py-2 text-white px-4 transition-all bg-gray-500 hover:bg-red-600 duration-200 rounded-3xl">Logout</button>

            </div>
            
                {#if currentPanel === 0}
                <div class="w-3/4 flex p-2 m-2 flex-col bg-white rounded-2xl overflow-x-hidden">

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
                                        <td class=" text-left flex flex-row  my-auto">
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
                                                <button on:click={()=>{alert("share")}} class="hover:bg-blue-300 px-2 py-2 rounded-xl duration-100 transition-all"><img src="Share.png" alt="bookmark"></button>
                                                <button on:click={()=>{alert("delete")}} class="hover:bg-red-400 px-2 py-2 rounded-xl duration-100 transition-all"><img src="Bin.png" alt="bookmark"></button>
                                            </div>                                    
                                        </td>
                                    </tr>    
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
                {:else if currentPanel===5}
                <div class="w-3/4 flex p-2 flex-col  " style="height:100svh;">
                        <div class="w-full h-full flex flex-row bg-white rounded-2xl p-2 flex-grow overflow-y-auto" style="height:90vh">
                            <div class="w-1/2 p-4 gap-4 flex-col flex flex-col h-full ">
                                <div class="text-4xl my-3">Get storage at <br>Apex Cloud</div>
                                <div class="flex flex-grow flex-col gap-4">
                                    <div class="text-base">Our payment system relies on custom made receipt confirmation technology, please fill in the correct details in the following form, if the information fails to match in the receipt or on our end we will take actions. for more help reach us out here <a class="text-blue-400" href="/help">help.</a> </div>
                                    <div class="text-base mb-5">Contact us if you encounter any issue or problem we will reach out to you immediately <br> +91 8459291118  </div>   
                                    <div class="text-base">We charge 12rs per GB per year, upon completion of each tenure you are given a window of 3 months in which if you fail to pay the amount your subscription access will be temporarily revoked.</div>

                                </div>


                            </div>
                            <div class="w-1/2 h-full text-xl px-5">
                                <div class="flex h-full flex-col gap-2">
                                    <div class="text-3xl mt-2 mb-3">Kindly fill out the following details</div>
                                        <input required placeholder="full name ex. Tanishq Dhote" class="border border-1 bg-gray-100 border-gray-100 px-2 py-1 rounded-lg focus:outline-none " type="text">
                                        <input required placeholder="mobile number ex. 8459291118" class="border border-1 bg-gray-100 border-gray-100 px-2 py-1 rounded-lg focus:outline-none " type="text">
                                        <input required placeholder="email id ex. tanishqssg4@gmail.com" class="border border-1 bg-gray-100 border-gray-100 px-2 py-1 rounded-lg focus:outline-none " type="email">
                                        <input required placeholder="upi id ex.tanishqssg4-1@oksbi" class="border border-1 bg-gray-100 border-gray-100 px-2 py-1 rounded-lg focus:outline-none " type="text">
                                        
                                    <div class="flex flex-row justify-between gap-2 w-full items-center my-3">
                                        <div>I want</div>
                                        <input bind:value={purchaseStorageSpace}  placeholder="desired storage space ex.1GB,3GB etc" class="border border-1 bg-gray-100 flex flex-grow border-gray-100 py-1 rounded-lg focus:outline-none " max="100" min="1" type="range">
                                        <div class="">{purchaseStorageSpace} GB of space</div>
                                    </div>
                                    <div>Your subscription would cost you <br> {purchaseStorageSpace*12} Rs per year</div>
                                    
                                    <div class="w-full flex flex-row justify-around items-center">
                                        <div>
                                            {@html captchaImage}
                                        </div>
                                        <input class="border border-1 bg-gray-100 border-gray-100 px-2 py-1 rounded-lg focus:outline-none " placeholder="Enter Captcha" type="text">
                                    </div>
                                    <button on:click={confirmCaptcha} class="text-lg py-2 my-auto text-white px-4 transition-all bg-gray-400 hover:bg-green-500 duration-200 rounded-xl">Continue</button>
                                </div>
                            </div>

                        </div>
                       
                    </div>
          
                {/if}
            </div>
        </div>
