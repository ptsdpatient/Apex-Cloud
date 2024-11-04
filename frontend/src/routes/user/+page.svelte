<script>
    import { onMount } from 'svelte';
    
    let visible=false
    let full_name='Tanishq Dhote',email='tanishqbakka1@gmail.com'
    let token
    let url='http://localhost:2000/api'
    let panelButtons=["Dashboard","Shared","Notifications","Bookmarks","Bin","Subscriptions","Help"] 
    let operationButtons=["New Folder","Download","Move Files"]
    let currentDirectory=["Home","Folder 1","Folder 2","Folder 3","Folder 4","Folder 5"]  
    let currentFiles=[
        {
            id:0,
            name:'File1.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:1,
            name:'File2.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:2,
            name:'File2.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        },{
            id:3,
            name:'File3.xlsx',
            created_at:'6:53 PM, 3 Nov',
            bookmark:false,
            selected:false,
            moved:false
        }
    ]   
    let currentPanel=0
    function logout(){
        localStorage.removeItem("apex_cloud")
        window.location="/"
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
    })
    </script>
    
    <title>Apex Cloud | {full_name}</title>
    
    <div class="flex flex-col" style="width:100vw;height:100svh">
        <div class="flex flex-grow gap-2 justify-around p-2 flex-row bg-gray-200">
            <div class="w-1/4 px-3 pb-2 flex flex-col items-left align-left gap-2  h-full rounded-lg overflow-y-auto justify-between">
                <div class="flex flex-row gap-4 items-center">
                    <img class="w-16 py-1" src="/logo.png" alt="">                    
                    <div class="flex flex-col items-left">
                        <div class="text-xl">{full_name}</div>
                        <div class="text-sm">{email}</div>
                    </div>
                </div>   
                <button class="text-lg rounded-lg py-2 my-1  transition-all bg-blue-500 text-white hover:shadow-xl transform hover:scale-105 ease-in-out duration-100">Upload Files</button>

                {#each panelButtons as button,index}
                    <button on:click={currentPanel=index} class="{currentPanel==index?"bg-white":""} hover:bg-gray-100 focus:bg-white flex pl-2 py-2 flex-row items-center transform transition-all duration-100 focus:outline-none  hover:scale-105 outline-none focus:scale-105  rounded-xl">
                        <img class="" src='{button}.png' alt="">
                        <div class="pl-3 w-full text-left text-lg">{button}</div>
                    </button>
                {/each}
                <button on:click={logout} class="text-lg py-2 text-white px-4  bg-gray-500 transform transition-transform hover:scale-105 hover:bg-red-600 hover:scale-105 duration-100 rounded-lg">Logout</button>

            </div>
            <div class="w-3/4 flex p-2 m-2 flex-col bg-white rounded-3xl">
             
                    <div class="flex flex-row gap-2  py-3">
                        <button class="px-4  text-xl rounded-3xl py-1 transition-all hover:bg-gray-100 text-black hover:shadow-sm ease-in-out duration-100">Select All</button>

                        <input placeholder="⌕ Search Files" class="focus:outline-none bg-gray-100 flex flex-grow placeholder-black text-lg pl-4 rounded-xl">

                        {#each operationButtons as button}
                            <button class="px-4  text-xl rounded-3xl py-1 transition-all hover:bg-gray-100 text-black hover:shadow-sm ease-in-out duration-100">{button}</button>
                        {/each}
                    </div>
                    <div class="flex flex-row w-full text-xl justify-between py-3 px-2 gap-3 shadow-sm">
                        <div class="flex flex-row">
                            <button class="px-4 text-xl rounded-lg py-1 mr-2 hover:bg-gray-100 text-black transition-all ease-in-out duration-100">←</button>
                            <div class="flex flex-row text-xl">
                                {#each currentDirectory as folder}
                                    <div class="items-center align-center flex flex-row">
                                        
                                        <button class="transform hover:bg-opacity-50 hover:bg-gray-100 hover:scale-105 px-2 py-1 transition-all duration-100 ease-in-out rounded-xl">{folder}</button>
                                        <pre>/ </pre>
                                    </div>   
                                {/each}
                            </div>
                        </div>
                        <button class="px-4 mr-4 text-xl rounded-lg py-1  transition-all bg-gray-500 hover:bg-red-500 text-white hover:shadow-xl transform hover:scale-105 ease-in-out duration-100">Delete Folder</button>
                    </div>

                    <div class="bg-white flex flex-grow overflow-y-auto" style="height:50vh;">
                        <table class="w-full border-collapse text-xl overflow-y-auto">
                            <thead class="text-black bg-white my-4">
                              <tr class="shadow-sm ">
                                <!-- <td class=" py-3  text-center">#</td> -->
                                <td class=" py-3 text-left pl-5 w-3/5">File Name</td>
                                <td class=" py-3 text-left pl-5 w-1/5">Created At</td>
                                <td class=" py-3 text-left pl-5 w-1/5">Actions</td>
                                <!-- <td class=" py-3 text-left pl-5">Actions</td> -->
                              </tr>
                            </thead>
                            <tbody class="">
                                {#each currentFiles as files,index}
                                    <tr  class="hover:bg-gray-100 hover:shadow-sm rounded-xl hover:cursor-pointer transition-all ease-in-out">
                                        <!-- <td class=" py-2  text-center">{index+1}</td> -->
                                        <td on:click={()=>{return files.selected=!files.selected}} class=" py-2 text-left"><input bind:checked={files.selected} class="accent-blue-800 hover:cursor-pointer transform scale-125 mx-3 mr-5" type="checkbox">{files.name}</td>
                                        <td on:click={()=>{return files.selected=!files.selected}} class=" py-2 text-left pl-5">{files.created_at}</td>
                                        <td class=" py-2 text-left pl-5">
                                            <div class="flex flex-row gap-4 text-2xl">
                                                <button><img src="Bookmarks.png" alt="bookmark"></button>
                                                <button><img src="Share.png" alt="bookmark"></button>
                                                <button><img src="Bin.png" alt="bookmark"></button>

                                            </div>                                    
                                        </td>
                                    </tr>    
                                {/each}
                            </tbody>
                        </table>
                    </div>


            </div>
        </div>
    </div>