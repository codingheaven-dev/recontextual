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
