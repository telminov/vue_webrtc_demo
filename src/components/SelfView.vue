<template>
    <div id="selfViewContainer">
        <video
            id="selfView"
            ref="selfView"
            autoplay
            muted
        ></video>
    </div>
</template>

<script>
export default {
    name: "SelfView",
    methods: {
        setOwnStream(stream) {
            this.$refs.selfView.srcObject = stream;
        }
    }
}
</script>

<style scoped>
#selfViewContainer {
    /*border: 1px solid grey;*/
    position: fixed;
    top: 50px;
    min-width: 10%;
    min-height: 10%;
    max-width: 20%;
    max-height: 20%;
    /*background-color: silver;*/
}

video {
    width: 100%;
    height: 100%;
}
</style>