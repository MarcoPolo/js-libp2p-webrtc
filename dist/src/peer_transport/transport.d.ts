import type { Connection } from '@libp2p/interface-connection';
import { CreateListenerOptions, DialOptions, Listener, symbol, Transport } from '@libp2p/interface-transport';
import type { TransportManager, Upgrader } from '@libp2p/interface-transport';
import { Multiaddr } from '@multiformats/multiaddr';
import type { IncomingStreamData, Registrar } from '@libp2p/interface-registrar';
import type { PeerId } from '@libp2p/interface-peer-id';
import type { Startable } from '@libp2p/interfaces/startable';
import type { PeerStore } from '@libp2p/interface-peer-store';
export declare const TRANSPORT = "/webrtc-w3c";
export declare const PROTOCOL = "/webrtc-signaling/0.0.1";
export declare const CODE = 281;
export interface WebRTCPeerTransportInit {
    rtcConfiguration?: RTCConfiguration;
}
export interface WebRTCDirectTransportComponents {
    peerId: PeerId;
    registrar: Registrar;
    upgrader: Upgrader;
    transportManager: TransportManager;
    peerStore: PeerStore;
}
export declare class WebRTCDirectTransport implements Transport, Startable {
    private readonly components;
    private readonly init;
    private readonly _started;
    private readonly handler?;
    constructor(components: WebRTCDirectTransportComponents, init: WebRTCPeerTransportInit);
    isStarted(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    createListener(options: CreateListenerOptions): Listener;
    get [Symbol.toStringTag](): string;
    get [symbol](): true;
    filter(multiaddrs: Multiaddr[]): Multiaddr[];
    dial(ma: Multiaddr, options: DialOptions): Promise<Connection>;
    _onProtocol({ connection, stream }: IncomingStreamData): Promise<void>;
}
//# sourceMappingURL=transport.d.ts.map