<template>
    <div id="remoteViewContainer">
        <video
            id="remoteView"
            ref="remoteVideo"
            autoplay
        ></video>
        <!--    <audio-->
        <!--        id="remoteAudio"-->
        <!--        ref="remoteAudio"-->
        <!--        autoplay-->
        <!--    ></audio>-->
    </div>
</template>

<script>
export default {
    name: "RemoteView",
    methods: {
        setRemoteStream(stream) {
            this.$refs.remoteVideo.srcObject = stream;
        }
    }

}
</script>

<style scoped>
#remoteViewContainer {
    display: flex;
    /*border: 1px solid darkblue;*/
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: -10;
}

video {
    width: 100%;
    height: 100%;
}
</style>