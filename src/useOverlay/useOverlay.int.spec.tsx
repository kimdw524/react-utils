import { useContext } from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OverlayProvider, useOverlay } from '..';
import OverlayIdContext from './OverlayIdContext';

describe('useOverlay', () => {
  const OverlayComponent = () => {
    const { close } = useOverlay();
    const id = useContext(OverlayIdContext);

    return (
      <button data-testid="overlay" onClick={close}>
        overlay {id}
      </button>
    );
  };

  const ChildComponent = () => {
    const { pop, push } = useOverlay();

    return (
      <div>
        <button data-testid="push" onClick={() => push(<OverlayComponent />)}>
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

  it('modal을 push 한 후에 pop하면 사라진다.', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const pushButton = screen.getByTestId('push');
    const popButton = screen.getByTestId('pop');

    await user.click(pushButton);
    expect(screen.queryByTestId('overlay')).toBeInTheDocument();

    await user.click(popButton);
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  it('modal을 여러 개 띄울 수 있고 pop 호출 시 1개씩 닫힌다.', async () => {
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

  it('close 함수로 원하는 id의 모달을 닫을 수 있다.', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const pushButton = screen.getByTestId('push');

    await user.click(pushButton);
    await user.click(pushButton);
    await user.click(pushButton);

    await user.click(screen.getByText('overlay 2'));
    expect(screen.queryByText('overlay 2')).not.toBeInTheDocument();

    await user.click(screen.getByText('overlay 1'));
    expect(screen.queryByText('overlay 1')).not.toBeInTheDocument();
  });
});
