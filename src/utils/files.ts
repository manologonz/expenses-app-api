import path from 'path';
import fs from 'fs';

class FileManager {
    private rootPath: string;

    constructor() {
        this.rootPath = path.join(path.resolve(__dirname), '../');
    }

    getRootDir() {
        return this.rootPath;
    }

    saveFileToPath(folderPath: string, filename: string, data: any) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        fs.writeFileSync(path.join(folderPath, filename), data);
    }

    join(...args: string[]) {
        return path.join(...args);
    }

    readDir(path: string) {
        return fs.readdirSync(path);
    }

    existsPath(path: string) {
        return fs.existsSync(path);
    }

    getFileContents(path: string) {
        return fs.readFileSync(path, 'utf8');
    }

    createDir(path: string) {
        fs.mkdirSync(path);
    }

    removeFile(path: string) {
        fs.unlinkSync(path);
    }
}

const fileManager = new FileManager();

export default fileManager;
