import * as React from 'react';

export const navRef = React.createRef();

export function navigate(name, params) {
  navRef.current?.navigate(name, params);
}

export function addListener(state, params) {
  navRef.current?.addListener(state, params);
}

export function removeListener(state, params) {
  navRef.current?.removeListener(state, params);
}