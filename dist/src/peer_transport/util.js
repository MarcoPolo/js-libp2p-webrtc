import { logger } from '@libp2p/logger';
import * as pb from './pb/index.js';
const log = logger('libp2p:webrtc:peer:util');
export const readCandidatesUntilConnected = async (connectedPromise, pc, stream) => {
    while (true) {
        const readResult = await Promise.race([connectedPromise.promise, stream.read()]);
        // check if readResult is a message
        if (readResult instanceof Object) {
            const message = readResult;
            if (message.type !== pb.Message.Type.ICE_CANDIDATE) {
                throw new Error('expected only ice candidates');
            }
            // end of candidates has been signalled
            if (message.data == null || message.data === '') {
                log.trace('end-of-candidates received');
                break;
            }
            log.trace('received new ICE candidate: %s', message.data);
            try {
                await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(message.data)));
            }
            catch (err) {
                log.error('bad candidate received: ', err);
                throw new Error('bad candidate received');
            }
        }
        else {
            // connected promise resolved
            break;
        }
    }
    await connectedPromise.promise;
};
//# sourceMappingURL=util.js.map