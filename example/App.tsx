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
