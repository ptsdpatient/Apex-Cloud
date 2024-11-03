<script>
    import { onMount } from 'svelte';
    
    let visible=false
    let full_name='Tanishq Dhote',email='tanishqbakka1@gmail.com'
    let token
    let url='http://localhost:2000/api'
    let panelButtons=["Dashboard","Shared","Notifications","Bookmarks","Bin","Subscriptions","Help"]   
    let currentDirectory=["Home","Folder 1","Folder 2","Folder 3","Folder 4","Folder 5"]     
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
        <div class="w-full bg-gray-100 flex flex-row shadow-lg pt-2 justify-between">
            <div class="flex flex-row gap-4 justify-between items-center">
                <img class="w-16 pl-3 py-1" src="/logo.png" alt="">
                
                <div class="flex flex-col items-left">
                    <div class="text-xl">{full_name}</div>
                    <div class="text-sm">{email}</div>
                </div>
            </div>
            <input placeholder="⌕ Search Files" class="w-1/2 focus:outline-none  placeholder-black text-lg my-2 pl-4 rounded-xl">
            <button on:click={logout} class="text-lg my-3 text-white px-4 mx-4 bg-blue-500 transform transition-transform hover:scale-105 hover:bg-blue-600 hover:scale-105 duration-100 rounded-lg">Logout</button>
        </div>
        <div class="flex flex-grow gap-2 justify-around p-2 flex-row bg-gray-100">
            <div class="w-1/4 px-3 py-5 flex flex-col items-left align-left gap-2  h-full rounded-lg overflow-y-auto">
                    <button class="text-lg rounded-lg py-2 my-1  transition-all bg-gray-500 hover:bg-blue-500 text-white hover:shadow-xl transform hover:scale-105 ease-in-out duration-100">Upload Files</button>
              
                    {#each panelButtons as button,index}
                        <button on:click={currentPanel=index} class="{currentPanel==index?"bg-blue-200":""} focus:bg-blue-200 flex pl-2 py-2 flex-row items-center transform transition-all duration-100 focus:outline-none  hover:scale-105 outline-none focus:scale-105 hover:bg-white rounded-xl">
                            <img class="" src='{button}.png' alt="">
                            <div class="pl-3 w-full text-left text-lg">{button}</div>
                        </button>
                    {/each}
            </div>
            <div class="w-3/4 flex flex-col bg-white rounded-lg">
                <div class="flex flex-row w-full text-xl justify-between py-3 px-2 gap-3 shadow-sm">
                        <div class="flex flex-row">
                            <button class="px-4 text-xl rounded-lg py-1 mr-2 hover:bg-gray-100 text-black transition-all ease-in-out duration-100">←</button>
                            <div class="flex flex-row text-xl">
                                {#each currentDirectory as folder}
                                    <div class="items-center align-center flex flex-row">
                                        
                                        <button class="transform hover:bg-opacity-50 hover:bg-gray-100 hover:scale-105 px-2 py-1 transition-all duration-100 ease-in-out rounded-xl">{folder}</button>
                                        <div>
                                            /
                                        </div>
                                    </div>   
                                {/each}
                            </div>
                        </div>
                        <button class="px-4 mr-4 text-xl rounded-lg py-1  transition-all bg-gray-500 hover:bg-red-500 text-white hover:shadow-xl transform hover:scale-105 ease-in-out duration-100">Delete Folder</button>
                </div>

            </div>
        </div>
    </div>