import { render } from '@testing-library/react';

import { OverlayProvider, useOverlay } from '..';

describe('OverlayProvider', () => {
  it('OverlayProvider 내에 useOverlay가 호출되지 않으면 오류가 발생한다.', () => {
    const TestComponent = () => {
      useOverlay();

      return null;
    };

    expect(() => render(<TestComponent />)).toThrow();
  });

  it('OverlayProvider 내에 useOverlay가 호출되어야 한다.', () => {
    const TestComponent = () => {
      useOverlay();

      return null;
    };

    expect(() =>
      render(
        <OverlayProvider>
          <TestComponent />
        </OverlayProvider>,
      ),
    ).not.toThrow();
  });
});
