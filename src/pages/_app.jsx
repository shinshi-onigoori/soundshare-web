import '../styles/globals.css'
import {useContext} from 'react';
import { UserContext } from '../context/sessionContext';
// import FirebaseContxtProvider from '../context/firebaseContext'

function MyApp({ Component, ...pageProps}) {
  const userContext = useContext(UserContext);
  return (
    <UserContext.Provider value={userContext}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp
