<script>
    import { onMount } from 'svelte';
    
    let register=false
    let visible=false
    let full_name='Tanishq Dhote',email='tanishqbakka1@gmail.com'
    let token
    let url='http://localhost:2000/api'
        
    
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
        <div class="w-full flex flex-row shadow-xl justify-between">
            <div class="flex flex-row gap-4 justify-between items-center">
                <img class="w-16 pl-3 py-1" src="/logo.png" alt="">
                
                <div class="flex flex-col items-left">
                    <div class="text-xl">{full_name}</div>
                    <div class="text-sm">{email}</div>
                </div>
            </div>
            <input placeholder="⌕ Search Files" class="w-1/2 bg-gray-200 placeholder-black text-lg my-2 pl-4 rounded-xl">
            <button class="text-lg my-3 text-white px-4 mx-4 bg-blue-500 transform transition-transform hover:scale-105 hover:bg-blue-600 hover:scale-105 duration-100 rounded-lg">Logout</button>
        </div>
        <div class="flex flex-grow bg-yellow-500">

        </div>
    </div>