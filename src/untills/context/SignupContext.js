import { createContext, useState } from 'react';

export const Auth = createContext()

const SignupContext = ({children}) => {
  const [auth, setAuth] = useState();

  const data = {
    auth
  }

  const handler = {

    setAuth
  }

  return (
    <Auth.Provider value={{data, handler}}>
      {children}
    </Auth.Provider>
  )
}

export default SignupContext