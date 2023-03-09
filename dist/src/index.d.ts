import type { Transport } from '@libp2p/interface-transport';
import type { WebRTCDirectTransportComponents, WebRTCPeerTransportInit } from './peer_transport/transport.js';
import { WebRTCTransportComponents } from './transport.js';
export declare function webRTC(): (components: WebRTCTransportComponents) => Transport;
export declare function webRTCDirect(init: WebRTCPeerTransportInit): (components: WebRTCDirectTransportComponents) => Transport;
//# sourceMappingURL=index.d.ts.map