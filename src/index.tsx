import * as React from 'react';
import {
  useContext,
  useContextSelector,
  createContext,
} from 'use-context-selector';
import { shallowEqualObjects } from 'shallow-equal';

export type Provider<T> = React.ComponentType<{
  value: T;
  children: React.ReactNode;
}>;
export type Selector<T> = (() => T) &
  (<U>(selector: (ctx: T) => U, isMulti?: boolean) => U);

export default function recontextualize<T>(): [Provider<T>, Selector<T>] {
  const Context = createContext<T | null>(null);

  // Create Provider wrapper (sole purpose is to flesh out the `| null`)
  const Provider = ({
    value,
    children,
  }: React.PropsWithChildren<{ value: T }>) => (
    <Context.Provider value={value}>{children}</Context.Provider>
  );

  // Create selector hook
  function useThatContext(): T;
  function useThatContext<U>(selector: (ctx: T) => U, isMulti?: boolean): U;
  function useThatContext<U>(
    selector?: (ctx: T) => U | T,
    isMulti: boolean = false
  ): U | T {
    const ref: React.MutableRefObject<U | T | undefined> = React.useRef();

    const equalityFnCallback = (ctx: T | null) => {
      if (!ctx) {
        throw new Error('No context');
      }

      if (!selector) {
        return useContext(Context);
      }

      const selected = selector(ctx);
      if (
        ref.current &&
        ((isMulti && ref.current === selected) ||
          (!isMulti && shallowEqualObjects(ref.current, selected as {})))
      ) {
        return ref.current;
      }
      ref.current = selected;
      return selected;
    };

    // Update the selector fn to memoize the selected value by [equalityFn].
    return useContextSelector(Context, equalityFnCallback) as T | U;
  }

  return [Provider, useThatContext];
}
