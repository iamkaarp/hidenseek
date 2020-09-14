<template>
    <div class="home">
        <input
            v-model="text"
            type="text"
        />
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
    </div>
</template>

<script>
import io from 'socket.io-client';

export default {
    data() {
        return {
            text: '',
            socket: io('http://localhost:5000'),
            msgs: [],
        };
    },
    computed: {
        messages() {
            let messages = this.msgs;
            console.log(this.msgs);

            this.socket.on('response', (data) => {
                if(this.msgs.length > 9) {
                    this.msgs.shift();
                }
                messages.push(data);
            });

            return messages;
        },
    },
    mounted() {
        console.log(this.socket);
        this.socket.on('response', (data) => {
            if(this.msgs.length > 9) {
                this.msgs.shift();
            }
            this.msgs.push(data);
        });
    },
    methods: {
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
    },
};
</script>
