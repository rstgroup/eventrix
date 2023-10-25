import React from 'react';
import { render } from '@testing-library/react';
import { EventrixProvider } from '../context';
import Eventrix from '../../Eventrix';
import withEventrix from './withEventrix';
import { EventrixI } from '../../interfaces';

describe('withEventrix', () => {
    const TestComponent = ({ foo = '', eventrix }: { foo: string; eventrix: EventrixI }) => {
        eventrix.emit('testEvent');
        return <div data-testid="testFoo">{!!foo && <div data-testid="testFooValue">{foo}</div>}</div>;
    };

    interface Props {
        foo: string;
    }
    const WrappedComponentTest = withEventrix<Props>(TestComponent);

    const TestContainer = ({ eventrix, children }: any) => <EventrixProvider eventrix={eventrix}>{children}</EventrixProvider>;

    it('should run callback when component render', async () => {
        const mockedCallback = jest.fn();
        const eventrixInstance = new Eventrix({});
        eventrixInstance.listen('testEvent', mockedCallback);
        render(
            <TestContainer eventrix={eventrixInstance}>
                <WrappedComponentTest foo={'test'} />
            </TestContainer>,
        );
        expect(mockedCallback).toHaveBeenCalled();
    });
});
