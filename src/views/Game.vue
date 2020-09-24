<template>
    <div class="container mx-auto flex justify-center">
        <div class="flex flex-col w-1/2">
            <input
                v-model="text"
                class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                type="text"
            />
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="position"
            >
                Position
            </button>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="getUserList"
            >
                User List
            </button>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="sendOnRoom"
            >
                Send
            </button>
            <div class="mt-4 pb-2">
                <p
                    v-for="(msg, index) in msgs"
                    :key="index"
                >
                    {{ msg }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';

export default {
    data() {
        return {
            text: '',
            socket: io('https://localhost:5443'),
            msgs: [],
            fakePos: {
                lat: 57.677369,
                lon: 12.006339,
            },
            myPos: {
                lat: 59.250164,
                lon: 18.185019,
            },
            rotation: 0,
            userList: [],
        };
    },
    mounted() {
        if(!this.$store.getters['utils/username']) {
            this.$router.push('/');
        }
        this.socket.on('connect', () => {
            setInterval(() => {
                if(!this.socket.connected) {
                    this.$store.dispatch('utils/setUsername', null);
                    this.$store.dispatch('utils/setGame', null);
                    window.location.reload();
                }
            }, 500);
            this.socket.emit('join', { game: this.$route.params.gameid, username: this.$store.getters['utils/username'], socketId: this.socket.id });
            this.socket.on('joined', (response) => {
                if(response.status === 'success') {
                    this.socket.emit('getusers', { game: this.$route.params.gameid });
                    this.socket.on('getusers', (response) => {
                        console.log(response);
                    });
                }
            });
            this.socket.on('disconnect', (data) => {
                if(data.username === this.$store.getters['utils/username'] && data.socketId === this.socket.id) {
                    alert('User already in game');
                    this.socket.close();
                    window.location.reload();
                }
            });
        });
    },
    methods: {
        getUserList() {
            console.log(this.$route.params.gameid);
            this.socket.emit('getusers', { game: this.$route.params.gameid }, (data) => {
                console.log(data);
            });
        },
        position() {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.myPos.lat = position.coords.latitude;
                    this.myPos.lon = position.coords.longitude;
                    console.log(position.coords);
                });
            }
            this.calcDistance();
        },
        sendOnRoom() {
            this.socket.emit('send', { game: this.$route.params.gameid, msg: this.text }, (data) => {
                console.log(data);
            });
            this.text = '';
        },
        calcDistance() {
            const lat1 = this.fakePos.lat;
            const lon1 = this.fakePos.lon;
            const lat2 = this.myPos.lat;
            const lon2 = this.myPos.lon;
            console.log(this.myPos);
            const R = 6371e3; // metres
            const rad1 = lat1 * Math.PI/180;
            const rad2 = lat2 * Math.PI/180;
            const delta1 = (lat2-lat1) * Math.PI/180;
            const delta2 = (lon2-lon1) * Math.PI/180;

            const a = Math.sin(delta1/2) * Math.sin(delta1/2) +
            Math.cos(rad1) * Math.cos(rad2) *
            Math.sin(delta2/2) * Math.sin(delta2/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            const d = R * c; // in metres

            this.msgs.push(Math.floor(d));
        },
    },
};
</script>

<style lang="scss" scoped>
.arrow {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;

  border-bottom: 20px solid black;
}
</style>