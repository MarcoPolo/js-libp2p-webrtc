import { symbol } from '@libp2p/interface-transport';
import { multiaddr } from '@multiformats/multiaddr';
import { WebRTCMultiaddrConnection } from '../maconn.js';
import { WebRTCPeerListener } from './listener.js';
import { logger } from '@libp2p/logger';
import { connect, handleIncomingStream } from './handler.js';
const log = logger('libp2p:webrtc:peer');
// TODO(ckousik): This is the wrong protocol name and code. They
// will be changed to /webrtc-direct, /webrtc-direct/0.0.1, and 281
// respectively once https://github.com/multiformats/js-multiaddr/pull/309
// is merged.
export const TRANSPORT = '/webrtc-w3c';
export const PROTOCOL = '/webrtc-signaling/0.0.1';
export const CODE = 281;
export class WebRTCDirectTransport {
    constructor(components, init) {
        this.components = components;
        this.init = init;
        this._started = false;
        this._onProtocol = this._onProtocol.bind(this);
    }
    isStarted() {
        return this._started;
    }
    async start() {
        await this.components.registrar.handle(PROTOCOL, (data) => {
            this._onProtocol(data).catch(err => { log.error('failed to handle incoming connect from %p', data.connection.remotePeer, err); });
        });
    }
    async stop() {
        await this.components.registrar.unhandle(PROTOCOL);
    }
    createListener(options) {
        return new WebRTCPeerListener(this.components);
    }
    get [Symbol.toStringTag]() {
        return '@libp2p/webrtc-w3c';
    }
    get [symbol]() {
        return true;
    }
    filter(multiaddrs) {
        return multiaddrs.filter((ma) => {
            const codes = ma.protoCodes();
            return codes.includes(CODE);
        });
    }
    /*
     * dial connects to a remote via the circuit relay or any other protocol
     * and proceeds to upgrade to a webrtc connection.
     * multiaddr of the form: <multiaddr>/webrtc-direct/p2p/<destination-peer>
     * For a circuit relay, this will be of the form
     * <relay address>/p2p/<relay-peer>/p2p-circuit/webrtc-direct/p2p/<destination-peer>
    */
    async dial(ma, options) {
        log.trace('dialing address: ', ma);
        const addrs = ma.toString().split(TRANSPORT);
        if (addrs.length !== 2) {
            // TODO(ckousik): Change to errCode
            throw new Error('invalid multiaddr');
        }
        // look for remote peerId
        const remoteAddr = multiaddr(addrs[0]);
        const destination = multiaddr(addrs[1]);
        const destinationIdString = destination.getPeerId();
        if (destinationIdString == null) {
            // TODO(ckousik): Change to errCode
            throw new Error('bad destination');
        }
        const controller = new AbortController();
        if (options.signal == null) {
            options.signal = controller.signal;
        }
        const connection = await this.components.transportManager.dial(remoteAddr);
        const rawStream = await connection.newStream([PROTOCOL], options);
        try {
            const [pc, muxerFactory] = await connect({
                stream: rawStream,
                rtcConfiguration: this.init.rtcConfiguration,
                signal: options.signal
            });
            const result = await options.upgrader.upgradeOutbound(new WebRTCMultiaddrConnection({
                peerConnection: pc,
                timeline: { open: (new Date()).getTime() },
                remoteAddr: connection.remoteAddr
            }), {
                skipProtection: true,
                skipEncryption: true,
                muxerFactory
            });
            // close the stream if SDP has been exchanged successfully
            rawStream.close();
            return result;
        }
        catch (err) {
            // reset the stream in case of any error
            rawStream.reset();
            throw err;
        }
    }
    async _onProtocol({ connection, stream }) {
        let conn;
        try {
            const [pc, muxerFactory] = await handleIncomingStream({
                rtcConfiguration: this.init.rtcConfiguration,
                connection,
                stream
            });
            conn = await this.components.upgrader.upgradeInbound(new WebRTCMultiaddrConnection({
                peerConnection: pc,
                timeline: { open: (new Date()).getTime() },
                remoteAddr: connection.remoteAddr
            }), {
                skipEncryption: true,
                skipProtection: true,
                muxerFactory
            });
        }
        catch (err) {
            stream.reset();
            throw err;
        }
        if (this.handler != null) {
            this.handler(conn);
        }
    }
}
//# sourceMappingURL=transport.js.map