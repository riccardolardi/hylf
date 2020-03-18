import * as React from 'react';

export const navRef = React.createRef();

export function navigate(name, params) {
  navRef.current?.navigate(name, params);
}