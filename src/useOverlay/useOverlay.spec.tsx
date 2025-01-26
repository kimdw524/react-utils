import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { OverlayProvider, useOverlay } from '..';

describe('useOverlay', () => {
  const ChildComponent = () => {
    const { pop, push } = useOverlay();

    return (
      <div>
        <button data-testid="push" onClick={() => push(<div data-testid="overlay">overlay</div>)}>
          push
        </button>
        <button data-testid="pop" onClick={pop}>
          pop
        </button>
      </div>
    );
  };

  const TestComponent = () => {
    return (
      <OverlayProvider unmountOn={'exit'}>
        <ChildComponent />
      </OverlayProvider>
    );
  };

  it('단일 모달 push, pop', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const pushButton = screen.getByTestId('push');
    const popButton = screen.getByTestId('pop');

    await user.click(pushButton);
    expect(screen.queryByTestId('overlay')).toBeInTheDocument();

    await user.click(popButton);
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  it('다중 모달 push, pop', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const pushButton = screen.getByTestId('push');
    const popButton = screen.getByTestId('pop');

    await user.click(pushButton);
    await user.click(pushButton);
    await user.click(pushButton);
    expect(screen.queryAllByTestId('overlay').length).toBe(3);

    await user.click(popButton);
    expect(screen.queryAllByTestId('overlay').length).toBe(2);
  });
});
