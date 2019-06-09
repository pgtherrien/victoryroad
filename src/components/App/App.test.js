import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { UserProvider } from '../../contexts/user_context';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
   <UserProvider>
     <App />
   </UserProvider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
