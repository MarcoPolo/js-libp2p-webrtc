import { WebRTCDirectTransport } from './peer_transport/transport.js';
import { WebRTCTransport } from './transport.js';
export function webRTC() {
    return (components) => new WebRTCTransport(components);
}
export function webRTCDirect(init) {
    return (components) => new WebRTCDirectTransport(components, init ?? {});
}
//# sourceMappingURL=index.js.map