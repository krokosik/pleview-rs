import { ControlGroup, FormGroup, InputGroup, NumericInput } from '@blueprintjs/core';
import { FC } from 'react';

export const ColorForm: FC = () => (
    <FormGroup>
        <ControlGroup>
            <NumericInput fill />
            <NumericInput fill />
            <NumericInput fill />
        </ControlGroup>
        <InputGroup fill />
    </FormGroup>
);
