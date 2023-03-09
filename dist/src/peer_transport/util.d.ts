import type { DeferredPromise } from 'p-defer';
import * as pb from './pb/index.js';
interface MessageStream {
    read: () => Promise<pb.Message>;
    write: (d: pb.Message) => void | Promise<void>;
}
export declare const readCandidatesUntilConnected: (connectedPromise: DeferredPromise<any>, pc: RTCPeerConnection, stream: MessageStream) => Promise<void>;
export {};
//# sourceMappingURL=util.d.ts.map