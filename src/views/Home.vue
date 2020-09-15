<template>
    <div class="container mx-auto flex justify-center">
        <div class="flex w-1/2 mt-20">
            <div class="w-1/2">
                <router-link
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    :to="'game/' + game"
                >
                    Join a new game
                </router-link>
            </div>
            <div class="flex flex-col w-1/2">
                <input
                    class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                    type="text"
                    placeholder="xxxx-xxxx-xxxx"
                />
                <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    @click="join"
                >
                    Join Existing
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        game() {
            return this.makeGameId(4) + '-' + this.makeGameId(4) + '-' + this.makeGameId(4);
        },
    },
    methods: {
        makeGameId(length) {
            let result = '';
            const characters = 'abcdefghijklmnopqrstuvwxyz';
            const charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            console.log(result);
            return result;
        },
    },
};
</script>

<style>

</style>