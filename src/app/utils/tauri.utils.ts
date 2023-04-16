import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { DialogFilter } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api';
import { DataPayload, LogLevel, LogPayload } from '../models';

export const asciiFilter: DialogFilter = { name: 'Ascii', extensions: ['txt', 'dat'] };

// @ts-ignore - This is a Tauri App
// eslint-disable-next-line no-underscore-dangle
export const isTauriApp = !!window.__TAURI__;

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

export const listenToData = (callback: (payload: DataPayload) => void): Promise<UnlistenFn> =>
    listen('engine://data', (event) => callback(event.payload as DataPayload));

export const updateCrossSection = (direction: 'x' | 'y', pixel: number): Promise<number[]> =>
    invoke('update_cross_section', { direction: direction === 'x' ? 0 : 1, pixel });
