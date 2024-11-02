<script>

</script>

<div class="flex flex-row justify-center bg-blue-900" style="width:100vw;height:100svh;background-image:url(/bg.jpg);background-size: cover;background-position: center center;background-repeat:no-repeat;">
    <div class="h-full w-2/3 flex flex-col justify-center">
        <img class="w-2/3 mx-auto" alt="icon" src="/icon.png">
    </div>
    <div class="flex flex-col justify-center h-full w-1/3">
        <div class="bg-white w-10/12 text-xl flex flex-col justify-around gap-4 px-5 py-10 shadow-xl rounded-xl ">
                <div class="text-center text-4xl my-3">Login </div>
            
                <input class="w-11/12 mx-auto px-3 py-2 rounded-lg focus:outline-none bg-gray-100" placeholder="username">
           
                <input class=" w-11/12 mx-auto px-3 py-2 rounded-lg focus:outline-none bg-gray-100" placeholder="password" type="password">
   
                <button class="bg-blue-500 rounded-lg w-1/3 py-2 text-xl px-5 text-white  mx-auto mt-2 transition-transform transform hover:scale-105 active:scale-95 focus:outline-none  ">Login</button>
                <div class="mx-auto text-center my-2">
                    <div class="text-wrap text-sm mx-auto">Dont have an account? <button class="text-blue-500">Register</button></div>
                    <div class="text-wrap text-sm mx-auto">or Sign in with</div>
                </div>
                <button
  class="w-2/3 mx-auto flex items-center justify-center border px-2 py-2.5 text-lg font-medium text-gray-700  rounded-lg shadow transition-transform transform hover:scale-105 active:scale-95 focus:outline-none">
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="Google logo"
    class="h-4 mr-2"
  />
  Sign in with Google
</button>

            </div>
    </div>
</div>