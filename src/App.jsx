import './App.css';
import JsonFormatter from './JsonFomatter';
import data from './data.json';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

function App() {
  const jsonData = data;

  return (
    <>
      <ReactNotifications />
      <JsonFormatter data={jsonData} />
    </>
  );
}

export default App;
