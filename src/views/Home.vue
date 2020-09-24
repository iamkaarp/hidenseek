<template>
    <div class="container mx-auto flex justify-center">
        <div
            v-if="!gameId"
            class="w-full mt-2 p-4"
        >
            <div class="bg-white rounded shadow-md">
                <div class="w-full mx-auto">
                    <div class="w-full p-4 flex flex-col items-center border-b-2 border-gray-400">
                        <p class="text-left text-sm mb-2">
                            Do you have a game room ID?
                        </p>
                        <input
                            v-model="existingGameId"
                            class="bg-white w-full mb-3 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal mb-2 shadow-md"
                            type="text"
                            placeholder="xxxx-xxxx-xxxx"
                        />
                        <button
                            class="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
                            @click="joinGame"
                        >
                            Join Existing Game
                        </button>
                    </div>
                    <div class="w-full p-4">
                        <p class="text-sm mb-2">
                            If not, you can create a new game to invite your friends for a fun game of Hide'n'Seek
                        </p>
                        <button
                            class="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
                            @click="newGame"
                        >
                            New Game
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-else
            class="w-full mx-auto mt-2 p-4"
        >
            <div class="bg-white rounded shadow-md">
                <div class="w-full mx-auto">
                    <div class="w-full flex flex-col mx-auto p-4">
                        <p
                            v-if="userError"
                            class="text-sm text-red-500"
                        >
                            {{ errorMsg }}
                        </p>
                        <input
                            v-model="user"
                            :class="userError ? 'border-red-300' : ''"
                            class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal mb-2"
                            type="text"
                            placeholder="SuperHider25"
                        />
                        <button
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            @click="setUsername"
                        >
                            Set username
                        </button>
                    </div>
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
            userError: false,
            socketId: null,
            errorMsg: null,
            devGame: 'test',
        };
    },
    computed: {
        username() {
            return this.$store.getters['utils/username'];
        },
        gameId() {
            return this.$store.getters['utils/game'];
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
            this.userError = false;
            this.errorMsg = null;
            if(!this.user) {
                this.userError = true;
                this.errorMsg = 'Username can not be empty!';
                return;
            }

            this.$http.get('game/' + this.gameId).then((response) => {
                let username = response.data.users.find(e => e.username.toLowerCase() === this.user.toLowerCase());
                if(username) {
                    this.userError = true;
                    this.errorMsg = 'This username already exists in this game!';
                    return;
                }
                return;
            }).finally(() => {
                if(!this.userError) {
                    let gameId = this.existingGameId ? this.existingGameId : this.gameId;
                    this.$store.dispatch('utils/setUsername', this.user);
                    this.$router.push('/game/' + gameId);
                }
            });
        },
        joinGame() {
            //this.setGameId(this.existingGameId);
            this.setGameId(this.devGame);
        },
        newGame() {
            this.setGameId(this.devGame);
            //this.setGameId(this.makeGameId(4) + '-' + this.makeGameId(4) + '-' + this.makeGameId(4));
        },
        setGameId(gameId) {
            this.$store.dispatch('utils/setGame', gameId);
        },
    },
};
</script>

<style>

</style>