<template>
    <div class="container mx-auto flex justify-center">
        <div
            v-if="!username"
            class="flex flex-col mt-20"
        >
            <input
                v-model="user"
                class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal mb-2"
                type="text"
            />
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="setUsername"
            >
                Set username
            </button>
        </div>
        <div
            v-else
            class="w-full flex mt-20"
        >
            <div class="w-1/2 flex justify-center">
                <div class="w-1/2 flex flex-col">
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        @click="newGame"
                    >
                        Join Existing
                    </button>
                </div>
            </div>
            <div class="flex justify-center w-1/2">
                <div class="flex flex-col w-1/2">
                    <input
                        v-model="existingGameId"
                        class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                        type="text"
                        placeholder="xxxx-xxxx-xxxx"
                    />
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        @click="joinGame"
                    >
                        Join Existing
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: null,
            existingGameId: null,
        };
    },
    computed: {
        gameId() {
            return this.makeGameId(4) + '-' + this.makeGameId(4) + '-' + this.makeGameId(4);
        },
        username() {
            return this.$store.getters['utils/username'];
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
            return result;
        },
        setUsername() {
            this.$store.dispatch('utils/setUsername', this.user);
        },
        joinGame() {
            this.$router.push('/game/' + this.existingGameId);
        },
        newGame() {
            this.$router.push('/game/' + this.gameId);
        },
    },
};
</script>

<style>

</style>