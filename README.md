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
import { createContext, recontextualize } from '../.';

interface ExampleContextType {
  value: string;
  setValue: (newValue: string) => void;
}

const ExampleContext = createContext<ExampleContextType>();
const useExample = recontextualize(ExampleContext);

function FirstComponent() {
  const { value, setValue } = useExample(
    ({ value, setValue }) => ({ value, setValue }),
    true
  );
  return <input value={value} onChange={(evt) => setValue(evt.target.value)} />;
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
    <ExampleContext.Provider value={contextValue}>
      <FirstComponent />
      <SecondComponent />
    </ExampleContext.Provider>
  );
}

export default App;
```

## API Reference

### createContext

```ts
function createContext<ContextType>(): Recontext<ContextType>;
```

`createContext` takes no arguments, but should be given a type, `ContextType`, as generic argument. The create context will be of that type. The default value for the context will be `null`, but that will not be selectable. If you try to select without providing a non-null context value, selecting will throw a runtime error.

### recontextualize

```tsx
function recontextualize(context: Recontext<ContextType>): {
  (): ContextType;
  <ContextSelection>(selector: (ctx: ContextType) => ContextSelection, isMulti?: boolean): ContextSelection;
};
```

`recontextualize` is a *custom hook generator*. It is invoked with a context created by `createContext` and returns a context selector hook, e.g. `useSpecificContext`, as in this example:


```ts
interface SpecificContextType { ... };
const SpecificContext = createContext<SpecificContextType>();
const useSpecificContext = recontextualize(SpecificContext);
```

This context selector function has the following three call signatures:

```ts
function useSpecificContext(): SpecificContextType;
function useSpecificContext<U>(selector: (ctx: SpecificContextType) => U): U;
function useSpecificContext<U>(selector: (ctx: SpecificContextType) => U, isMulti: boolean): U;
```

If `useSpecificContext` is invoked without arguments, the hook returns the entire context value. Use this variant to select *the entire context*.

If `useSpecificContext` is invoked with a single selector argument or with a selector argument and `isMulti=false`, the hook returns the value returned by the selector argument only if the value has changed using *strict equality*. Use this variant to select *a single value from the context*.

If `useSpecificContext` is invoked with a selector argument and `isMulti=true`, the hook returns the object returned by the selector argument only if the object has changed using *shallow equality on the values of the object*. Use this variant to select *multiple values from the context*.
