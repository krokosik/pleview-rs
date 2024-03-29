import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { DialogFilter, message, open, save } from '@tauri-apps/api/dialog';
import { documentDir } from '@tauri-apps/api/path';
import { readTextFile, writeFile } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api';
import { LogLevel, LogPayload } from '../models';

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
    return filePath ? writeFile({ path: filePath, contents }) : Promise.resolve();
};

export const initMenuListeners = async (): Promise<void> => {
    if (!isTauriApp) {
        return;
    }

    await listen('tauri://menu', (event) => {
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

export const onLog = (callback: (payload: LogPayload) => void, filterLevel: LogLevel = LogLevel.Trace): Promise<UnlistenFn> =>
    listen('log://log', (event) => {
        const payload = event.payload as LogPayload;

        if (payload.level >= filterLevel) {
            callback({
                ...payload,
                message: payload.message.replace(
                    // eslint-disable-next-line no-control-regex
                    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
                    '',
                ),
            });
        }
    });

export const getInitialData = (): Promise<[{ central_pixels: [number, number]; curve: [[number[], number[]], [number[], number[]]] }, number[][]]> =>
    invoke('get_initial_data');

export const updateCrossSection = (direction: 'x' | 'y', pixel: number): Promise<number[]> =>
    invoke('update_cross_section', { direction: direction === 'x' ? 0 : 1, pixel });
