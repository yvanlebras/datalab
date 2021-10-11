import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import Navigation from './Navigation';

jest.mock('./MessageBanner', () => jest.fn(() => (<>MessageBanner</>)));

describe('DescribeDatalabs', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    expect(shallow(
      <Navigation identity={{ expected: 'identity' }} userPermissions={['expectedPermission']} >
        <span>Content</span>
      </Navigation>,
    )).toMatchSnapshot();
  });
});
