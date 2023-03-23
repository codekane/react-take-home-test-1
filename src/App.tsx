import React, {useState} from 'react';
import { Contacts } from './components/contacts';
//import { AddContactModalButton } from './components/buttons';

function App() {
  const [show, setShow] = useState(false);

  return (
    <div className="App container">
      <h1 className='text-center'>Brew Ninja Test App</h1>
      
      <Contacts />
    </div>
  );
}

export default App;
