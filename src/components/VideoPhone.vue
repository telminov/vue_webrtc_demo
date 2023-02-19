<template>
    <RemoteView
        ref="remoteView"
        v-show="isRemoteViewAvailable"
    />
    <SelfView
        ref="selfView"
        v-show="isSelfViewAvailable"
    />

    <ControlPanel
        v-model:callAvailableNumber="callAvailableNumber"
        v-model:isAnswerAvailable="isAnswerAvailable"
        v-model:isHangupAvailable="isHangupAvailable"
        @call="callHandler"
        @answer="answerHandler"
        @hangup="hangupHandler"
    />
</template>

<script>
import SipClient from '@/services/sip';
import RemoteView from '@/components/RemoteView.vue';
import SelfView from '@/components/SelfView.vue';
import ControlPanel from '@/components/ControlPanel.vue';

export default {
    name: "VideoPhone",
    data() {
        return {
            sipUser: String,
            isNewSession: true,
            callAvailableNumber: undefined,
            isHangupAvailable: false,
            isAnswerAvailable: false,
            isRemoteViewAvailable: false,
            isSelfViewAvailable: false,
            isConnectingProcess: false,
            isCollCompleted: false,
            errorMsg: undefined,
        }
    },
    components: {RemoteView, SelfView, ControlPanel},
    methods: {
        answerHandler() {
            console.log('Answer Btn clicked')
            this.sipClient.answer()
        },
        hangupHandler() {
            console.log('Hangup Btn clicked')
            this.sipClient.hangup()
        },
        callHandler(callNumber) {
            console.log('Call Btn clicked', callNumber)
            this.sipClient.call(callNumber)
        },
        connect(sipUser, callAvailableNumber) {
            this.sipUser = sipUser
            this.callAvailableNumber = callAvailableNumber
            this.sipClient = new SipClient(this.sipUser, import.meta.env.VITE_APP_SIP_PASSWORD, false)
            // установка видео-связи
            this.sipClient.addStreamHandler = (remoteStream, selfStream) => {
                console.log('addStreamHandler')
                this.isConnectingProcess = false
                this.isCollCompleted = false
                this.isAnswerAvailable = false
                this.isRemoteViewAvailable = true
                this.isSelfViewAvailable = true
                this.$refs.remoteView.setRemoteStream(remoteStream);
                this.$refs.selfView.setOwnStream(selfStream);
            }
            // начало сессии (входящий или исходящий звонок)
            this.sipClient.startSessionHandler = (session) => {
                console.log('startSessionHandler')
                this.isNewSession = false
                this.isCollCompleted = false
                this.isConnectingProcess = true
                this.isHangupAvailable = true
                if (session.direction === 'incoming')
                    this.isAnswerAvailable = true
            }
            // конец сессии
            this.sipClient.completeSessionHandler = () => {
                console.log('completeSessionHandler')
                this.isHangupAvailable = false
                this.isAnswerAvailable = false
                this.isRemoteViewAvailable = false
                this.isSelfViewAvailable = false
                this.isCollCompleted = true
            }
            this.sipClient.registrationFailedHandler = () => {
                console.log('registrationFailedHandler')
                this.errorMsg = 'Ошибка подключения телефонии'
            }
            this.sipClient.start()
        }
    }
}
</script>

<style scoped>

</style>