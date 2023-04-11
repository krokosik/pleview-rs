import { listen } from '@tauri-apps/api/event';
import { DialogFilter, message, open, save } from '@tauri-apps/api/dialog';
import { documentDir } from '@tauri-apps/api/path';
import { readTextFile, writeFile } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api';

export const asciiFilter: DialogFilter = { name: 'Ascii', extensions: ['txt', 'dat'] };

// @ts-ignore - This is a Tauri App
// eslint-disable-next-line no-underscore-dangle
export const isTauriApp = !!window.__TAURI__;

export const openFile = async (): Promise<string | null> => {
    const openResult = await open({ multiple: false, filters: [asciiFilter] });
    const filePath = Array.isArray(openResult) ? openResult[0] ?? null : openResult;

    if (filePath) {
        // eslint-disable-next-line no-console
        void readTextFile(filePath).then(console.log);
    }

    return filePath;
};

export const saveFile = async (contents: string): Promise<void> => {
    const filePath = await save({ defaultPath: await documentDir(), filters: [asciiFilter] });
    return writeFile({ path: filePath, contents });
};

export const initMenuListeners = async (): Promise<void> => {
    if (!isTauriApp) {
        return;
    }

    await listen('tauri://menu', async (event) => {
        switch (event.payload) {
            case 'open':
                void openFile();
                break;
            case 'save':
            case 'save_as':
                void saveFile('Hello World!');
                break;
            case 'about':
                void message('This is a Work In Progress rewrite of PLEview, using Tauri (Rust + WebView)', { title: 'About' });
                break;
            default:
        }
    });
};

export const getInitialData = async (): Promise<
    [{ central_pixels: [number, number]; curve: [[number[], number[]], [number[], number[]]] }, number[][]]
> => invoke('get_initial_data');
