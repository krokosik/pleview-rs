import { Button, Classes, Colors, HTMLTable, Icon, NumericInput } from '@blueprintjs/core';
import { FC } from 'react';
import { HexColorInput } from 'react-colorful';
import { useDispatch, useSelector } from 'react-redux';
import { colorScaleSelector, movePoint, removePoint, selectedPointIdSelector, selectPoint, updateColor } from '../color-scale.slice';

export const PointList: FC = () => {
    const dispatch = useDispatch();
    const colorScale = useSelector(colorScaleSelector);
    const selectedPoint = useSelector(selectedPointIdSelector);

    return (
        <div className="responsive-table">
            <HTMLTable condensed interactive>
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Position</th>
                        <th>Hex</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {colorScale.map((point) => (
                        <tr
                            key={point.id}
                            onClick={() => dispatch(selectPoint(point.id))}
                            style={{ backgroundColor: selectedPoint === point.id ? Colors.DARK_GRAY5 : undefined }}
                        >
                            <td>
                                <Icon icon="full-circle" color={point.color} />
                            </td>
                            <td>
                                <NumericInput
                                    style={{ boxSizing: 'border-box', textAlign: 'center' }}
                                    allowNumericCharactersOnly
                                    clampValueOnBlur
                                    value={(Math.round(point.offset * 100) + 1) / 100}
                                    max={1}
                                    min={0.01}
                                    majorStepSize={0.1}
                                    stepSize={0.01}
                                    minorStepSize={null}
                                    buttonPosition="none"
                                    className={Classes.FILL}
                                    onValueChange={(value) => dispatch(movePoint(value))}
                                />
                            </td>
                            <td>
                                <HexColorInput
                                    style={{ textAlign: 'center' }}
                                    color={point.color.toUpperCase()}
                                    onChange={(value) => dispatch(updateColor(value))}
                                    className={[Classes.INPUT, Classes.FILL].join(' ')}
                                />
                            </td>
                            <td>
                                <Button icon="cross" minimal small onClick={() => dispatch(removePoint(point.id))} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </HTMLTable>
        </div>
    );
};
