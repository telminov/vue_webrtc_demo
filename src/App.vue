<template>
    <div>
        <h1>WebRTC demo</h1>

        <button
            @click="connect(1001, 1002)"
        >
            Connect as user 1001
        </button>

        <button
            @click="connect(1002, 1001)"
        >
            Connect as user 1002
        </button>

        <VideoPhone
            ref="videoPhone"
        />
    </div>
</template>

<script>
import VideoPhone from '@/components/VideoPhone.vue';

export default {
    methods: {
        connect(sipUser, callAvailableNumber) {
            console.log('Подключение sip-пользователя', sipUser, '...')
            this.$refs.videoPhone.connect(sipUser, callAvailableNumber)
        }
    },
    components: {VideoPhone},
}
</script>

<style scoped>

</style>
