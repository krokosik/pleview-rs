import { listen } from '@tauri-apps/api/event';
import { DialogFilter, message, open, save } from '@tauri-apps/api/dialog';
import { documentDir } from '@tauri-apps/api/path';
import { readTextFile, writeFile } from '@tauri-apps/api/fs';

export abstract class TauriUtils {
    private static asciiFilter: DialogFilter = { name: 'Ascii', extensions: ['txt', 'dat'] };

    public static get isTauriApp(): boolean {
        // @ts-ignore - This is a Tauri App
        // eslint-disable-next-line no-underscore-dangle
        return !!window.__TAURI__;
    }

    public static async openFile(): Promise<string | null> {
        const openResult = await open({ multiple: false, filters: [this.asciiFilter] });
        const filePath = Array.isArray(openResult) ? openResult[0] ?? null : openResult;

        if (filePath) {
            // eslint-disable-next-line no-console
            void readTextFile(filePath).then(console.log);
        }

        return filePath;
    }

    public static async saveFile(contents: string): Promise<void> {
        const filePath = await save({ defaultPath: await documentDir(), filters: [this.asciiFilter] });
        return writeFile({ path: filePath, contents });
    }

    public static async initMenuListeners(): Promise<void> {
        if (!this.isTauriApp) {
            return;
        }

        await listen('tauri://menu', async (event) => {
            switch (event.payload) {
                case 'open':
                    void this.openFile();
                    break;
                case 'save':
                case 'save_as':
                    void this.saveFile('Hello World!');
                    break;
                case 'about':
                    void message('This is a Work In Progress rewrite of PLEview, using Tauri (Rust + WebView)', { title: 'About' });
                    break;
                default:
            }
        });
    }
}
