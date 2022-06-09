import { Visualizations } from '../../enums';

const FIELD_STEP = 1;
const WAVELENGTH_STEP = 10;

const schemas: Record<Visualizations, Record<string, unknown>> = {
    [Visualizations.CrossSections]: {
        background: 'transparent',
        config: {
            axis: {
                labelColor: '#f6f7f9 ',
                tickColor: '#f6f7f9 ',
                titleColor: '#f6f7f9 ',
                grid: false,
            },
        },
        vconcat: [
            {
                width: 800,
                height: 170,
                transform: [
                    {
                        filter: {
                            param: 'field-marker',
                        },
                    },
                ],
                layer: [
                    {
                        mark: {
                            type: 'point',
                            filled: true,
                        },
                        params: [
                            {
                                name: 'wavelength-marker',
                                select: {
                                    type: 'point',
                                    encodings: ['x'],
                                    nearest: true,
                                    on: '[mousedown[event.button == 1], mouseup] > mousemove',
                                    clear: false,
                                },
                                value: 700,
                            },
                        ],
                        encoding: {
                            x: {
                                field: 'wavelength',
                                type: 'quantitative',
                                scale: {
                                    zero: false,
                                },
                            },
                            y: {
                                field: 'pl',
                                type: 'quantitative',
                                scale: {
                                    zero: false,
                                },
                            },
                            color: {
                                condition: {
                                    param: 'wavelength-marker',
                                    value: 'firebrick',
                                    empty: false,
                                },
                                value: '#8abbff',
                            },
                            size: {
                                condition: {
                                    param: 'wavelength-marker',
                                    value: 75,
                                    empty: false,
                                },
                                value: 25,
                            },
                        },
                    },
                    {
                        mark: {
                            type: 'line',
                        },
                        encoding: {
                            x: {
                                field: 'wavelength',
                                type: 'quantitative',
                                scale: {
                                    zero: false,
                                },
                            },
                            y: {
                                field: 'pl',
                                type: 'quantitative',
                                scale: {
                                    zero: false,
                                },
                            },
                        },
                        color: { value: '#8abbff' },
                    },
                    {
                        transform: [
                            {
                                filter: {
                                    param: 'wavelength-marker',
                                    empty: false,
                                },
                            },
                        ],
                        encoding: {
                            x: {
                                field: 'wavelength',
                                type: 'quantitative',
                                scale: {
                                    zero: false,
                                },
                            },
                            size: {
                                value: 2,
                            },
                            color: {
                                value: 'firebrick',
                            },
                        },
                        mark: 'rule',
                    },
                ],
            },
            {
                width: 800,
                height: 170,
                transform: [
                    {
                        filter: {
                            param: 'wavelength-marker',
                        },
                    },
                ],
                layer: [
                    {
                        mark: {
                            type: 'point',
                            filled: true,
                        },
                        params: [
                            {
                                name: 'field-marker',
                                select: {
                                    type: 'point',
                                    encodings: ['x'],
                                    nearest: true,
                                    on: '[mousedown[event.button == 1], mouseup] > mousemove',
                                    clear: false,
                                },
                                value: 0,
                            },
                        ],
                        encoding: {
                            x: {
                                field: 'magnetic-field',
                                type: 'quantitative',
                                scale: {
                                    zero: false,
                                },
                            },
                            y: {
                                field: 'pl',
                                type: 'quantitative',
                                scale: {
                                    zero: false,
                                },
                            },
                            color: {
                                condition: {
                                    param: 'field-marker',
                                    value: 'firebrick',
                                    empty: false,
                                },
                                value: '#8abbff',
                            },
                            size: {
                                condition: {
                                    param: 'field-marker',
                                    value: 75,
                                    empty: false,
                                },
                                value: 25,
                            },
                        },
                    },
                    {
                        mark: {
                            type: 'line',
                        },
                        encoding: {
                            x: {
                                field: 'magnetic-field',
                                type: 'quantitative',
                                scale: {
                                    zero: false,
                                },
                            },
                            y: {
                                field: 'pl',
                                type: 'quantitative',
                                scale: {
                                    zero: false,
                                },
                            },
                        },
                        color: { value: '#8abbff' },
                    },
                    {
                        transform: [
                            {
                                filter: {
                                    param: 'field-marker',
                                    empty: false,
                                },
                            },
                        ],
                        encoding: {
                            x: {
                                field: 'magnetic-field',
                                type: 'quantitative',
                                scale: {
                                    zero: false,
                                },
                            },
                            size: {
                                value: 2,
                            },
                            color: {
                                value: 'firebrick',
                            },
                        },
                        mark: 'rule',
                    },
                ],
            },
        ],
    },
    [Visualizations.Map]: {
        width: 750,
        height: 400,
        background: '#2f343c',
        config: {
            axis: {
                labelColor: '#f6f7f9 ',
                tickColor: '#f6f7f9 ',
                titleColor: '#f6f7f9 ',
                grid: false,
            },
        },
        layer: [
            {
                mark: 'rect',
                encoding: {
                    x: {
                        bin: { step: WAVELENGTH_STEP },
                        field: 'wavelength',
                        type: 'quantitative',
                        scale: { zero: false },
                    },
                    y: {
                        bin: { step: FIELD_STEP },
                        field: 'magnetic-field',
                        type: 'quantitative',
                    },
                    color: { field: 'pl', type: 'quantitative' },
                },
            },
        ],
    },
};

interface Datum {
    wavelength: number;
    'magnetic-field': number;
    pl: number;
}

const values: Datum[] = [];

for (let m = 0; m <= 10; m += FIELD_STEP) {
    for (let w = 700; w <= 1100; w += WAVELENGTH_STEP) {
        values.push({
            wavelength: w,
            'magnetic-field': m,
            pl: Math.random() * 10,
        });
    }
}

schemas[Visualizations.CrossSections].data = { values };
schemas[Visualizations.Map].data = { values };

export { schemas };
