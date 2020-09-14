<template>
    <div class="home">
        <input
            v-model="text"
            type="text"
        />
        <button @click="position">
            Position
        </button>
        <button @click="send">
            Send
        </button>

        <button @click="sendOnRoom">
            Send On Room
        </button>
        <div>
            <p
                v-for="(msg, index) in msgs"
                :key="index"
            >
                {{ msg }}
            </p>
        </div>
        <div
            class="arrow"
            :style="'transform: rotate(' + rot + 'deg)'"
        />
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
        };
    },
    computed: {
        rot() {
            return this.rotation;
        },
    },
    mounted() {
        this.socket.on('response', (data) => {
            if(this.msgs.length > 9) {
                this.msgs.shift();
            }
            this.msgs.push(data);
        });
    },
    methods: {
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
        send() {
            this.socket.emit('join', { room: 'myroom' }, (data) => {
                console.log(data);
            });
        },
        sendOnRoom() {
            this.socket.emit('send', { room: 'myroom', msg: this.text }, (data) => {
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
            const φ1 = lat1 * Math.PI/180; // φ, λ in radians
            const φ2 = lat2 * Math.PI/180;
            const Δφ = (lat2-lat1) * Math.PI/180;
            const Δλ = (lon2-lon1) * Math.PI/180;

            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
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