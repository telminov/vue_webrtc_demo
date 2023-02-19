import { WebSocketInterface, UA, version, debug } from 'jssip/lib/JsSIP';


export default class SipClient {

    constructor(user, password, debugOn = false) {
        const url = import.meta.env.VITE_APP_SIP_WS_URL
        const port = import.meta.env.VITE_APP_SIP_PORT

        if (debugOn)
            debug.enable('JsSIP:*')
        else
            debug.disable('JsSIP:*')

        const socket = new WebSocketInterface(`wss://${url}:${port}`);
        const configuration = {
            sockets: [socket],
            uri: `sip:${user}@${url}`,
            password,
            register_expires: 180,
            session_timers: false,
            user_agent: 'JsSip-' + version,
        };

        this.ua = new UA(configuration);
        this.ua.on('registered', () => {
            console.log('SIP клиент успешно подключен');
        });
        this.ua.on('registrationFailed', e => {
            console.error('ошибка подключения SIP клиента', e);
            if (this.registrationFailedHandler)
                this.registrationFailedHandler(e)
        });
        this.ua.on('newRTCSession', e => {
            console.log('newRTCSession', e);
            this._newRTCSessionHandler(e)
        });

        this.session = undefined
        this.addStreamHandler = undefined
        this.startSessionHandler = undefined
        this.completeSessionHandler = undefined
        this.registrationFailedHandler = undefined

    }

    start() {
        this.ua.start()
    }

    call(callNumber) {
        let options = this._getCallConfig(true, true)
        this.ua.call(`${callNumber}@${import.meta.env.VITE_APP_SIP_WS_URL}`, options)
    }

    answer() {
        let callConfig = this._getCallConfig(false, true);
        let options = {pcConfig: callConfig.pcConfig};
        this.session.answer(options);
    }

    hangup() {
        this.session.terminate();
    }

    _newRTCSessionHandler(e) {
        let session = e.session;

        // остановим прошлую сессию
        // FIXME: возможно это не лучшее решение - просто останавливать прошлый звонок при установке нового звонка
        if (this.session) this.session.terminate();

        // сохраним текущую сессию
        this.session = session;

        // this._searchIceCandidate();
        if (this.session.direction === 'outgoing') this._setupOutgoingCall();
        if (this.session.direction === 'incoming') this._setupIncomingCall();

        if (this.startSessionHandler) this.startSessionHandler(session);
    }

    _setupOutgoingCall() {
        this.session.on('progress', e => {
            console.log('call is in progress');
        });
        this.session.on('ended', e => {
            this._completeSession(e);
        });
        this.session.on('failed', e => {
            this._completeSession(e);
        });
        this.session.on('confirmed', e => {
            console.log('call confirmed');
            let selfStream = this.session.connection.getLocalStreams()[0];
            let remoteStream = this.session.connection.getRemoteStreams()[0];
            // console.log('getSenders', this.session.connection.getSenders())
            // console.log('getReceivers', this.session.connection.getReceivers())

            if (this.addStreamHandler)
                this.addStreamHandler(remoteStream, selfStream)
        });
    }

    _setupIncomingCall() {
        // this.showModal('incoming-call-modal');

        this.session.on('peerconnection', () => {
            this._addStream();
        });
        // this.session.on('started', (e) => {console.log('IncomingCall started', e)})
        this.session.on('ended', e => {
            this._completeSession(e);
        });
        this.session.on('failed', e => {
            this._completeSession(e);
        });
        // this.session.on('connecting', function() {console.log('CONNECT')})
        this.session.on('accepted', e => {
            if (this.acceptedHandler) this.acceptedHandler(e);
        });
        // this.session.on('confirmed', function(e) {console.log('CONFIRM STREAM')})

        // this.currentSessionWithVideo =
        //     this.session._request.body.indexOf('video') > -1;

    }

    _addStream() {
        this.session.connection.addEventListener('addstream', e => {
            let remoteStream = e.stream;
            let selfStream = this.session.connection.getLocalStreams()[0];

            if (this.addStreamHandler)
                this.addStreamHandler(remoteStream, selfStream)

        });
    }

    _completeSession() {
        this.session = null;
        if (this.completeSessionHandler) this.completeSessionHandler()
    }

    _getCallConfig(isOutgoing, withVideo) {
        let mediaConstraints = {
            audio: true,
            video: Boolean(withVideo),
        };

        let config = {
            mediaConstraints: mediaConstraints,
        };

        config['pcConfig'] = {
            rtcpMuxPolicy: isOutgoing ? 'negotiate' : 'require',
            hackStripTcp: true,
            iceServers: [
                {
                    // urls: ['stun:stun.l.google.com:19302'],
                    urls: ['stun:stun.freeswitch.org'],
                },
            ],
        };

        return config;
    }

}
