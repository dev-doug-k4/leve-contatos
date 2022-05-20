import { ReactElement, ReactNode } from 'react';
import cookie from 'cookie';
// next
import { NextPage } from 'next';
import App, { AppProps, AppContext } from 'next/app';
// theme
import ThemeProvider from '../theme';
// contexts
import { SettingsProvider } from '../contexts/SettingsContext';
import { AuthProvider } from '../contexts/AuthContext';
// amplify
import Amplify from 'aws-amplify'
import config from '../aws-exports'
// utils
import { getSettings } from '../utils/settings';
// components
import NotistackProvider from '../components/NotistackProvider';
import MotionLazyContainer from '../components/animate/MotionLazyContainer';
// @types
import { SettingsValueProps } from '../@types/theme';


// ----------------------------------------------------------------------

Amplify.configure({
  ...config, ssr: false
})

// ----------------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
}

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, settings } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <AuthProvider>
        <SettingsProvider defaultSettings={settings}>
          <ThemeProvider>
            <NotistackProvider>
              <MotionLazyContainer>
                {getLayout(<Component {...pageProps} />)}
              </MotionLazyContainer>
            </NotistackProvider>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </>
  );
}

// ----------------------------------------------------------------------

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);

  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || '' : document.cookie
  );

  const settings = getSettings(cookies);

  return {
    ...appProps,
    settings,
  };
};