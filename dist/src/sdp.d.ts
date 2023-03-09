import type { Multiaddr } from '@multiformats/multiaddr';
import * as multihashes from 'multihashes';
import type { HashCode, HashName } from 'multihashes';
/**
 * Get base2 | identity decoders
 */
export declare const mbdecoder: any;
export declare function certhash(ma: Multiaddr): string;
/**
 * Convert a certhash into a multihash
 */
export declare function decodeCerthash(certhash: string): {
    code: HashCode;
    name: HashName;
    length: number;
    digest: Uint8Array;
};
/**
 * Extract the fingerprint from a multiaddr
 */
export declare function ma2Fingerprint(ma: Multiaddr): string[];
/**
 * Normalize the hash name from a given multihash has name
 */
export declare function toSupportedHashFunction(name: multihashes.HashName): string;
/**
 * Create an answer SDP from a multiaddr
 */
export declare function fromMultiAddr(ma: Multiaddr, ufrag: string): RTCSessionDescriptionInit;
/**
 * Replace (munge) the ufrag and password values in a SDP
 */
export declare function munge(desc: RTCSessionDescriptionInit, ufrag: string): RTCSessionDescriptionInit;
//# sourceMappingURL=sdp.d.ts.map