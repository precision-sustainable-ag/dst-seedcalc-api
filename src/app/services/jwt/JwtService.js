const jwt = require('jsonwebtoken');
const jwt_conf = require('../../../config/jwt')
const { BlobService } = require('../azure/BlobService');
const crypto = require('crypto');

const KEYS_CONTAINER = 'rsa-keys'

const HMAC_SHA256 = 'HS256';
const RSA_SHA256 = 'RS256';

const PUBLIC_KEY = 'public.key';
const PRIVATE_KEY = 'private.key';

const keyGetters = {
    'HS256': () => { return jwt_conf.key; },
    'RS256': getRSAKey,
}


async function getRSAKey(){
    const publicKey = await BlobService.Open({blob:PUBLIC_KEY,container:KEYS_CONTAINER})
        .then(strVal => {return crypto.createPublicKey(strVal)})
    const privateKey = await BlobService.Open({blob:PRIVATE_KEY,container:KEYS_CONTAINER})
        .then(strVal => {return crypto.createPrivateKey(strVal);})
    return {
        public: publicKey,
        private: privateKey,
    }
}

class JwtService {

    static ALGORITHIM;
    static KEY;

    static defaultAlgorithim(){
        return RSA_SHA256;
    }

    static getAlgorithim(){
        if(this.ALGORITHIM) return this.ALGORITHIM;

        const _algorithim = jwt.algorithim;

        return this.ALGORITHIM = keyGetters[_algorithim] ? _algorithim : this.defaultAlgorithim();

    }

    static async getKey(){
        if(this.KEY) return this.KEY;

        const getter = keyGetters[this.getAlgorithim()] ?? keyGetters[this.defaultAlgorithim()];

        return this.KEY = await getter();
    }

    static async encode(data){
        const keychain = await this.getKey();
        // get private key from keychain or assume key chain represents the key itself.
        const key = keychain.private ?? keychain;
        const algorithm = this.getAlgorithim();
        const expiresIn = jwt_conf.lifetime;
        return jwt.sign(data, key, {algorithm,expiresIn})
    }

    static async decode(token){
        const keychain = await this.getKey();
        // get private key from keychain or assume key chain represents the key itself.
        const key = keychain.public ?? keychain;
        const algorithm = this.getAlgorithim();
        return jwt.verify(token, key,  { algorithms: [algorithm] });
    }


}


module.exports = {
    JwtService, HMAC_SHA256, RSA_SHA256
}