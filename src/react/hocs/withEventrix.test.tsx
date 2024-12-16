import React, { forwardRef, useEffect, useRef } from 'react';
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
        const mockedCallback = vi.fn();
        const eventrixInstance = new Eventrix({});
        eventrixInstance.listen('testEvent', mockedCallback);
        render(
            <TestContainer eventrix={eventrixInstance}>
                <WrappedComponentTest foo={'test'} />
            </TestContainer>,
        );
        expect(mockedCallback).toHaveBeenCalled();
    });

    const SimpleComponent = forwardRef<HTMLDivElement, { children?: React.ReactNode }>((props, ref) => (
        <div ref={ref}>{props.children}</div>
    ));

    const WrappedComponent = withEventrix(SimpleComponent);

    it('should forward ref to wrapped component', () => {
        const eventrixInstance = new Eventrix({});

        const TestComponent = () => {
            const ref = useRef<HTMLDivElement>(null);

            useEffect(() => {
                expect(ref.current).not.toBeNull();
                expect(ref.current?.textContent).toBe('Test Content');
            }, []);

            return (
                <EventrixProvider eventrix={eventrixInstance}>
                    <WrappedComponent ref={ref}>Test Content</WrappedComponent>
                </EventrixProvider>
            );
        };

        render(<TestComponent />);
    });
});
