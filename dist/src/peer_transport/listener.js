import { EventEmitter } from '@libp2p/interfaces/events';
import { multiaddr } from '@multiformats/multiaddr';
export class WebRTCPeerListener extends EventEmitter {
    constructor(opts) {
        super();
        this.opts = opts;
        this.listeningAddrs = [];
    }
    async listen(ma) {
        const baseAddr = multiaddr(ma.toString().split('/webrtc-peer').find(a => a !== ''));
        const tpt = this.opts.transportManager.transportForMultiaddr(baseAddr);
        const listener = tpt?.createListener({ ...this.opts });
        await listener?.listen(baseAddr);
        const listeningAddr = ma.encapsulate(`/p2p/${this.opts.peerId.toString()}`);
        this.listeningAddrs.push(listeningAddr);
        listener?.addEventListener('close', () => {
            this.listeningAddrs = this.listeningAddrs.filter(a => a !== listeningAddr);
        });
    }
    getAddrs() { return this.listeningAddrs; }
    async close() { }
}
//# sourceMappingURL=listener.js.map