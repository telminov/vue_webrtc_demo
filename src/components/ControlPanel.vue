<template>
    <div id="ControlPanel">
        <button
            type="button"
            @click="$emit('call', callAvailableNumber)"
            v-if="callAvailableNumber"
        >
            Call {{ callAvailableNumber }}
        </button>

        <button
            type="button"
            @click="$emit('answer')"
            v-if="isAnswerAvailable"
        >
            Answer
        </button>

        <button
            type="button"
            @click="$emit('hangup')"
            v-if="isHangupAvailable"
        >
            Hangup
        </button>
    </div>
</template>

<script>
export default {
    name: "ControlPanel",
    props: {
        callAvailableNumber: {
            type: Number,
            default: undefined
        },
        isHangupAvailable: {
            type: Boolean,
            default: false
        },
        isAnswerAvailable: {
            type: Boolean,
            default: false
        },
    },
    emits: ['answer', 'hangup', 'call'],
}
</script>

<style scoped>
#ControlPanel {
    position: absolute;
    bottom: 0;
    height: 50px;
    background: linear-gradient(rgba(49, 49, 51, 0.5), rgba(49, 49, 51));
    border-bottom-color: #424245;
    width: 100%;
}

#answerBtn {
    position: fixed;
    display: block;
    right: 30%;
    margin-top: 5px;
    height: 40px;
    width: 60px;
}
#hangupBtn {
    position: fixed;
    display: block;
    left: 30%;
    margin-top: 5px;
    height: 40px;
    width: 60px;
}
</style>