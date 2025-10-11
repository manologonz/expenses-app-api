import fileManager from './files';
import crypto from 'crypto';
import { KEY_PAIR_ROTATION_COUNT } from './constants';
import { v4 as uuid } from 'uuid';

class Keygen {
    private rootDir: string;
    private keyPairRotationCount: number;
    private publicKeyRotation: Map<string, string> = new Map();
    private privateKeyRotation: Map<string, string> = new Map();

    constructor() {
        this.rootDir = fileManager.getRootDir() + 'certs';
        this.keyPairRotationCount = KEY_PAIR_ROTATION_COUNT;
        this.generateRootDir();
    }

    // TODO: validate that the ammount of key pairs are generated according to the keyPairRotationCount;
    init() {
        const { flushKeys } = this.pullKeys();

        if (flushKeys) {
            this.clearKeys();
            this.generateKeys();
        }
    }

    getKeys(type: 'public' | 'private') {
        if (type === 'public') {
            return Object.fromEntries(this.publicKeyRotation.entries());
        } else if (type === 'private') {
            return Object.fromEntries(this.privateKeyRotation.entries());
        }
        return null;
    }

    getKey(type: 'public' | 'private', keyId: string) {
        if (type === 'public') {
            return this.publicKeyRotation.get(keyId);
        } else if (type === 'private') {
            return this.privateKeyRotation.get(keyId);
        }

        return null;
    }

    getSigningKey() {
        const randomKeySelector = Math.floor(Math.random() * this.keyPairRotationCount);
        const optionsObject = Object.fromEntries(this.privateKeyRotation.entries());
        const optionsEntries = Object.entries(optionsObject);

        const [keyId, key] = optionsEntries[randomKeySelector];

        return {
            keyId,
            key,
        };
    }

    getPath() {
        return this.rootDir;
    }

    private generateRootDir() {
        if (!fileManager.existsPath(this.rootDir)) {
            fileManager.createDir(this.rootDir);
        }
    }

    private clearKeys() {
        const keyFiles = fileManager.readDir(this.rootDir);
        console.log('Flushing keys...');
        keyFiles.forEach((keyFile: string) => {
            fileManager.removeFile(fileManager.join(this.rootDir, keyFile));
        });
    }

    private generateKeys() {
        for (let i = 0; i < this.keyPairRotationCount; i++) {
            const keyId = uuid();
            const keys = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });

            this.saveKeysToPath(keyId, keys);
            this.setKey('public', keyId, keys.publicKey.toString());
            this.setKey('private', keyId, keys.privateKey.toString());
        }

        console.log('Auth keys generated...');
    }

    private saveKeysToPath(keyId: string, keys: crypto.KeyPairSyncResult<string, string>) {
        fileManager.saveFileToPath(this.rootDir, keyId, keys.privateKey);
        fileManager.saveFileToPath(this.rootDir, keyId + '.pub', keys.publicKey);
    }

    private pullKeys() {
        let flushKeys = false;
        const keyPairs = fileManager.readDir(this.rootDir);
        const validKeyPairs = this.validateKayPairs(keyPairs);

        if (!validKeyPairs) {
            flushKeys = true;
        } else {
            this.setKeys(keyPairs);
        }

        return {
            flushKeys,
        };
    }

    private setKeys(keys: string[]) {
        keys.forEach((key) => {
            const { keyId, isPublic } = this.getKeyIdFromName(key);
            const keyContent = fileManager.getFileContents(fileManager.join(this.rootDir, key));
            const keyType = isPublic ? 'public' : 'private';

            this.setKey(keyType, keyId, keyContent);
        });
    }

    private getKeyIdFromName(keyFilename: string) {
        let isPublic = false;
        let keyId = keyFilename;

        if (/\.pub/.test(keyFilename)) {
            isPublic = true;
            keyId = keyFilename.split('.')[0];
        }

        return {
            isPublic,
            keyId,
        };
    }

    private getPrivateKeys(keys: string[]) {
        return keys.filter((key) => /\.pub/.test(key) === false);
    }

    private getPublicKeys(keys: string[]) {
        return keys.filter((key) => /\.pub/.test(key) === true);
    }
    private validateKayPairs(keyPairs: string[]) {
        console.log('Validating keys...');
        const keysThreshold = this.keyPairRotationCount * 2;

        if (keyPairs.length !== keysThreshold) {
            return false;
        }

        for (let i = 0; i < keyPairs.length; i++) {
            const { keyId, isPublic } = this.getKeyIdFromName(keyPairs[i]);

            const pairExists = keyPairs.includes(`${keyId}${isPublic ? '.pub' : ''}`);

            if (!pairExists) {
                return false;
            }
        }

        return true;
    }

    private setKey(type: 'public' | 'private', id: string, key: string) {
        if (type === 'public') {
            this.publicKeyRotation.set(id, key);
        }

        if (type === 'private') {
            this.privateKeyRotation.set(id, key);
        }
    }

    private unsetKey(type: 'public' | 'private', id: string, key: string) {
        if (type === 'public') {
            this.publicKeyRotation.delete(key);
        }

        if (type === 'private') {
            this.privateKeyRotation.delete(key);
        }
    }
}

const appKeygen = new Keygen();

export default appKeygen;
