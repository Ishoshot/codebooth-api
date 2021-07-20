<x-guest-layout>
    <div class="flex flex-col justify-center min-h-screen px-4 sm:items-center sm:px-2">

        <div class="container flex flex-row items-center justify-center">
            <div class="">
                <img class="w-60 h-60"
                    src="https://res.cloudinary.com/oluwatobi/image/upload/v1626728708/codebooth/CodeBooth_Logo_-_Trans_bg_eqq4za.png"
                    alt="CodeBooth">
            </div>
            <i class="mr-2 fa fa-exchange-alt fa-2x" aria-hidden="true"></i>
            <div class="">
                <img class="w-40 h-40 ml-5"
                    src="https://res.cloudinary.com/oluwatobi/image/upload/v1626730767/codebooth/github_zdwovg.png"
                    alt="CodeBooth">
            </div>
        </div>

        <h1 class="mt-5 text-3xl font-bold">Authorize CodeBooth to access GitHub</h1>

        <h6 class="mt-5 text-lg">If you initiated this authorization from CodeBooth via [Visual Studio Code], click 'Continue' to authorize access to GitHub</h6>

        <div class="flex items-center mt-10">
            <form action="{{ route('redirect') }}">
                <x-button class="py-3 mr-5 bg-green-600 hover:bg-gray-600">
                    <i class="mr-2 fa fa-check" aria-hidden="true"></i> {{ __('Continue') }}
                </x-button>
            </form>


            <form action="{{ route('login') }}">
                @csrf
                <x-button class="ml-5 bg-red-600 hover:bg-red-800">
                    <i class="mr-2 fa fa-times" aria-hidden="true"></i> {{ __('Decline') }}
                </x-button>
        </div>
        </form>
    </div>

</x-guest-layout>
