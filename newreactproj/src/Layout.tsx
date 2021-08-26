import * as React from 'react';
import * as PropTypes from 'prop-types';

export enum Direction {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

interface ILayoutProps {
  dir?: Direction;
};

const Layout: React.FunctionComponent<ILayoutProps> = (props) => {
  return (
    <div>
      {props.children}
    </div>
  );
};

Layout.defaultProps = {
  dir: Direction.Horizontal,
};

Layout.propTypes = {
  dir: PropTypes.oneOf<Direction>([
    Direction.Horizontal,
    Direction.Vertical,
  ]),
};

export default Layout;