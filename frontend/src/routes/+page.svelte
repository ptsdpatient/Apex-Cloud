<script>

let register=false
let visible=false

</script>

<title>Apex Cloud | {register?"Register":"Login"}</title>

<div class="flex flex-row justify-center bg-blue-900" style="width:100vw;height:100svh;background-image:url(/bg.jpg);background-size: cover;background-position: center center;background-repeat:no-repeat;">
    <div class="h-full w-2/3 flex flex-col justify-center" style="user-select:none">
        <img class="w-2/3 mx-auto" alt="icon" src="/icon.png">
    </div>
    <div class="flex flex-col justify-center h-full w-1/3">

        {#if register}
            <div class="bg-gray-200 w-10/12 text-xl flex flex-col justify-around gap-4 px-5 py-5 shadow-xl rounded-xl ">
                <div class="text-center text-4xl my-2">Register </div>
            
                <input class="w-11/12 shadow-sm mx-auto px-3 py-2 rounded-lg focus:outline-none bg-white" placeholder="username">        
                <input class="w-11/12 shadow-sm mx-auto px-3 py-2 rounded-lg focus:outline-none bg-white" placeholder="email" type="email">        
                <div class="relative flex flex-row items-center">
                    <input class=" w-11/12 shadow-sm mx-auto px-3 py-2 rounded-lg focus:outline-none bg-white" placeholder="password" type={visible?"text":"password"}>
                    <button class="absolute right-0 mr-4 pr-2 mx-auto" on:click={visible=!visible}><img alt="" src={visible?"/open.png":"/close.png"} ></button>
                </div>
                <button class="bg-blue-500 rounded-lg hover:shadow-lg w-2/5 py-2 text-xl px-5 text-white  mx-auto mt-2 transition-transform transform hover:scale-105 active:scale-95 focus:outline-none  ">Register</button>
                
                
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
        <div class="bg-gray-200 w-10/12 text-xl flex flex-col justify-around gap-4 px-5 py-5 shadow-xl rounded-xl ">
            <div class="text-center text-4xl my-3">Login </div>
        
            <input class="w-11/12 shadow-sm mx-auto px-3 py-2 rounded-lg focus:outline-none bg-white" placeholder="username">
       
            <div class="relative flex flex-row items-center">
                <input class=" w-11/12 shadow-sm mx-auto px-3 py-2 rounded-lg focus:outline-none bg-white" placeholder="password" type={visible?"text":"password"}>
                <button class="absolute right-0 mr-4 pr-2 mx-auto" on:click={visible=!visible}><img alt="" src={visible?"/open.png":"/close.png"} ></button>
            </div>

            <button  class="bg-blue-500 rounded-lg hover:shadow-lg w-1/3 py-2 text-xl px-5 text-white  mx-auto mt-2 transition-transform transform hover:scale-105 active:scale-95 focus:outline-none  ">Login</button>
            
            
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