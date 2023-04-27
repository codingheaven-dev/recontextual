# Recontextual: simple, easy-to-type, selectable contexts

This is a library built upon [`use-context-selector`](https://github.com/dai-shi/use-context-selector).

It has a simpler API and is easier to type and select from.

## Install

Simply install the package:

```bash
npm install --save recontextual
```

## Example

```tsx
import * as React from 'react';
import recontextualize from '../.';

interface IExample {
  value: string;
  setValue: (newValue: string) => void;
}

const [ExampleProvider, useExample] = recontextualize<IExample>();

function FirstComponent() {
  const { value, setValue } = useExample(
    ({ value, setValue }) => ({ value, setValue }),
    true
  );
  return <input value={value} onChange={evt => setValue(evt.target.value)} />;
}
function SecondComponent() {
  const value = useExample(({ value }) => value);
  return <h1>Second, value is: {value}</h1>;
}

function App() {
  const [value, set] = React.useState('initial');
  const contextValue = {
    value,
    setValue: (newValue: string) => set(newValue),
  };
  return (
    <ExampleProvider value={contextValue}>
      <FirstComponent />
      <SecondComponent />
    </ExampleProvider>
  );
}

export default App;
```

## API Reference

### recontextualize

```tsx
function recontextualize<IType>(): [Provider<IType>, Selector<IType>];
```

`recontextualize` is the default export and takes no arguments, but should be given a type argument.

The function returns an array of two items: A _context provider_, and a _context selector hook_.

The returned context provider can be used as any other context provider, by supplying a `value` property that conforms to the type argument. Components consuming the context must be wrapped in a provider, or they will throw a runtime error. No default value can be set.

The returned context selector hook can be invoked with 0, 1, or 2 arguments and returns the whole context or a selection from the context. However, if the context has changed, but the selection from the context has not, the hook will not cause a component render but rather abort the render loop.

As an example, imagine we have this:

```ts
interface ISomething { ... };
const [SomethingProvider, useSomething] = recontextualize<ISomething>();
```

This context selector hook, `useSomething` has the following three call signatures:

```ts
function useSomething(): ISomething;
function useSomething<U>(selector: (ctx: ISomething) => U): U;
function useSomething<U>(selector: (ctx: ISomething) => U, isMulti: boolean): U;
```

If `useSomething` is invoked without arguments, the hook returns the nearest provided context value as-is. Use this variant to select _the entire context_.

If `useSomething` is invoked with a single selector argument or with a selector argument and `isMulti=false`, the hook returns the value returned by the selector argument, but only if the value has changed using _strict equality_. If the selector return value is unchanged, this hook aborts the component render (as long as this is the only changed hook of course). Use this variant to select _a single value from the context_.

If `useSomething` is invoked with a selector argument and `isMulti=true`, the hook returns the object returned by the selector argument only if the object has changed using _shallow equality on the values of the object_. If the selector return value is shallowly unchanged, this hook aborts the component render (as long as this is the only changed hook of course). Use this variant to select _multiple values from the context_.
