<script>
import { onMount } from 'svelte';

let register=false
let visible=false
let username='',password='',email=''
let token
let url='http://localhost:2000/api'

async function login() {
    if(!username || !password){
        alert("invalid username or password")
        return
    }
        try {
            const response = await fetch(`${url}/login`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({ name: username,password: password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Authenticated user:', data);
                if(!data.error){
                    localStorage.setItem('apex_cloud', data.token);
                    window.location='/user'
                }
                
            } else {
                alert(data.error || 'Token is invalid');
            }
        } catch (error) {
            console.error('Error during token authentication:', error);
            alert("An error occurred while authenticating the token.");
        }
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
                if(!data.error)window.location='/user'
               
            } else {
                console.log(data.error || 'Your session has expired');
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

<title>Apex Cloud | {register?"Register":"Login"}</title>

<div class="flex flex-row justify-center bg-gradient-to-tr py-16 from-purple-500 to-blue-400" style="width:100vw;height:100svh;background-image:url(bg.jpg);background-size:cover;background-repeat:no-repeat;background-position:center;">
    <div class="w-3/4 mx-auto flex flex-row text-lg bg-opacity-40 bg-gray-700 backdrop-blur-sm rounded-3xl">
        <div class="w-1/2 flex flex-col justify-center ">
            <img class="m-auto" style="width:500px;" alt="icon" src="/icon.png">
        </div>
        <div class="flex flex-col justify-center h-full bg-gray-100 rounded-tr-3xl rounded-br-3xl w-1/2">
            {#if register}
                <div class=" w-10/12  flex flex-col justify-around gap-4 px-5 py-5 mx-auto overflow-y-auto" style="max-height:85%">
                    <div class="text-center text-3xl my-2">Register </div>            
                    <input bind:value={username} class="w-11/12 shadow-sm mx-auto  border border-1 border-gray-200 shadow-gray-300 px-3 py-2 rounded-lg focus:outline-none bg-white" placeholder="username">        
                    <input bind:value={email} class="w-11/12  border border-1 border-gray-200 shadow-gray-300 shadow-sm mx-auto px-3 py-2 rounded-lg focus:outline-none bg-white" placeholder="email" type="email">        
                    <div  class="relative flex flex-row items-center">
                        <input bind:value={password} class=" w-11/12  border border-1 border-gray-200 shadow-gray-300 shadow-sm mx-auto px-3 py-2 rounded-lg focus:outline-none bg-white" placeholder="password" type={visible?"text":"password"}>
                        <button class="absolute right-0 mr-4 pr-4 mx-auto" on:click={visible=!visible}><img alt="" src={visible?"/open.png":"/close.png"} ></button>
                    </div>
                    <button on:click={login} class="bg-blue-500 rounded-lg hover:shadow-lg w-2/5 py-2 text-xl px-5 text-white  mx-auto mt-2 transition-transform transform hover:scale-105 active:scale-95 focus:outline-none  ">Register</button>
                    
                    
                <div class="mx-auto text-center w-full gap-1">
                        <div class="text-wrap text-sm mx-auto">or Register with</div>
                        <button
                        class="w-2/3 mt-2 mb-3 mx-auto flex items-center justify-center border px-2 py-2.5 text-sm font-medium text-gray-700  rounded-lg shadow transition-transform transform hover:scale-105 active:scale-95 focus:outline-none bg-white">
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google logo"
                                class="h-4 mr-2"
                            />Register with Google</button>
                        <div class="text-wrap text-sm mx-auto mt-2">Already have an account? <button  on:click={register=!register}  class="text-blue-600 font-bold transform hover:scale-105 transition-transform duration-10">Login</button></div>
    
                    </div>
    
                </div>
            {:else}
            <div class="mx-auto w-10/12 flex flex-col justify-around gap-4 px-5 py-5 ">
                <div class="text-center text-3xl my-3">Login </div>
            
                <input bind:value={username} class="w-11/12 border border-1 border-gray-200 shadow-gray-300 shadow-sm mx-auto px-3 py-2 rounded-lg focus:outline-none bg-white" placeholder="username">
           
                <div class="relative flex flex-row items-center">
                    <input bind:value={password} class=" w-11/12 shadow-sm border border-1 border-gray-200 shadow-gray-300 mx-auto px-3 py-2 rounded-lg focus:outline-none bg-white" placeholder="password" type={visible?"text":"password"}>
                    <button class="absolute right-0 mr-4 pr-4 mx-auto" on:click={visible=!visible}><img alt="" src={visible?"/open.png":"/close.png"} ></button>
                </div>
    
                <button on:click={login} class="bg-blue-500 rounded-lg hover:shadow-lg w-1/3 py-2 px-5 text-white  mx-auto mt-2 transition-transform transform hover:scale-105 active:scale-95 focus:outline-none  ">Login</button>
                
                
            <div class="mx-auto text-center w-full gap-1">
                    <div class="text-wrap text-sm mx-auto">or Sign in with</div>
                    <button
                    class="w-2/3 mt-2 mb-3 mx-auto flex items-center justify-center border px-2 py-2.5 text-sm font-medium text-gray-700  rounded-lg shadow transition-transform transform hover:scale-105 active:scale-95 focus:outline-none bg-white">
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                            class="h-4 mr-2"
                        />Sign in with Google</button>
                    <div class="text-wrap text-sm mx-auto mt-2">Dont have an account? <button on:click={register=!register} class="text-blue-600 font-bold transform hover:scale-105 transition-transform duration-10">Register</button></div>
                    </div>
                </div>
            {/if}
        
    </div>
        
    </div>
</div>