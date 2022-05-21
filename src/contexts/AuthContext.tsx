import { createContext, ReactNode, useCallback, useEffect, useReducer } from 'react';
// next
import { useRouter } from 'next/router';
// amplify
import { Auth } from 'aws-amplify';
// @types
import { ActionMap, AuthState, AuthUser, AWSCognitoContextType } from '../@types/auth';

// ----------------------------------------------------------------------

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

enum Types {
  auth = 'AUTHENTICATE',
  logout = 'LOGOUT',
  update = 'UPDATE',
}

type AwsAuthPayload = {
  [Types.auth]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.logout]: undefined;
  [Types.update]: {
    user: AuthUser;
  };
};

type AwsActions = ActionMap<AwsAuthPayload>[keyof ActionMap<AwsAuthPayload>];

const reducer = (state: AuthState, action: AwsActions) => {
  if (action.type === 'AUTHENTICATE') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  if (action.type === 'UPDATE') {
    const { user } = action.payload;
    return {
      ...state,
      user,
    };
  }

  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

const AuthContext = createContext<AWSCognitoContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { push } = useRouter();

  const getSession = useCallback(async () => {
    try {
      const session = await Auth.currentSession()
      const cognitoUser = await Auth.currentAuthenticatedUser()
      const token = cognitoUser.signInUserSession.accessToken.jwtToken

      const user = cognitoUser.attributes

      dispatch({
        type: Types.auth,
        payload: { isAuthenticated: true, user },
      });

      return {
        user,
        session,
        headers: { Authorization: token },
      }

    } catch (error) {
      console.log(error)
      dispatch({
        type: Types.auth,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  const initial = useCallback(async () => {
    try {
      await getSession();
    } catch (error) {
      console.log(error)
    }
  }, [getSession]);

  useEffect(() => {
    initial();
  }, [initial]);


  const logout = async () => {
    try {
      await Auth.signOut()
      push('/auth/login')
      dispatch({ type: Types.logout });
    } catch (error) {
      console.log(error)
    }
  };

  const update = (user: AuthUser) => {
    dispatch({
      type: Types.update,
      payload: {
        user
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'cognito',
        user: {
          displayName: state?.user?.name || 'USER',
          // role: 'admin',
          ...state.user,
        },
        logout,
        update,
        getSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };