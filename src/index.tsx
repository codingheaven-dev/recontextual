import { useRef } from 'react';
import type { MutableRefObject } from 'react';
import {
  useContext,
  useContextSelector,
  createContext as originalCreateContext,
} from 'use-context-selector';
import type { Context } from 'use-context-selector';
import { shallowEqualObjects } from 'shallow-equal';

export type Recontext<T> = Context<T | null>;

export function createContext<T>(): Recontext<T> {
  return originalCreateContext<T | null>(null);
}

export function recontextualize<T>(context: Recontext<T>) {
  function useThatContext(): T;
  function useThatContext<U>(selector: (ctx: T) => U, isMulti?: boolean): U;
  function useThatContext<U>(
    selector?: (ctx: T) => U | T,
    isMulti: boolean = false
  ): U | T {
    const ref: MutableRefObject<U | T | undefined> = useRef();

    const equalityFnCallback = (ctx: T | null) => {
      if (!ctx) {
        throw new Error('No context');
      }
      if (!selector) {
        return useContext(context);
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
    return useContextSelector(context, equalityFnCallback) as T | U;
  }

  return useThatContext;
}
