import { ReactElement, ReactNode } from 'react';
import cookie from 'cookie';
// next
import { NextPage } from 'next';
import Head from 'next/head'
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
      <Head>
        <link rel="manifest" href="/favicon/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      </Head>

      <AuthProvider>
        <SettingsProvider defaultSettings={settings}>
          <ThemeProvider>
            <NotistackProvider>
              {getLayout(<Component {...pageProps} />)}
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