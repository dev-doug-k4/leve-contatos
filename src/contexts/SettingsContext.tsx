import Cookies from 'js-cookie';
import { ReactNode, createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
// theme
import palette from '../theme/palette';
// @type
import {
  ThemeMode,
  SettingsContextProps,
  SettingsValueProps,
} from '../@types/theme';
// config
import { defaultSettings, cookiesKey, cookiesExpires } from '../config';

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  onChangeMode: () => {},
  onToggleMode: () => {},
  setColor: {
    name: 'default',
    ...palette.light.primary,
  },
};

const SettingsContext = createContext(initialState);

type SettingsProviderProps = {
  children: ReactNode;
  defaultSettings: SettingsValueProps;
};

function SettingsProvider({
  children,
  defaultSettings = {} as SettingsValueProps,
}: SettingsProviderProps) {
  const [settings, setSettings] = useSettingCookies(defaultSettings);

  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: (event.target as HTMLInputElement).value as ThemeMode,
    });
  };

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        // Mode
        onChangeMode,
        onToggleMode,
        // Color
        setColor: initialState.setColor,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };

// ----------------------------------------------------------------------

function useSettingCookies(
  defaultSettings: SettingsValueProps
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);

  const onChangeSetting = () => {
    Cookies.set(cookiesKey.themeMode, settings.themeMode, { expires: cookiesExpires });


    Cookies.set(cookiesKey.themeColorPresets, settings.themeColorPresets, {
      expires: cookiesExpires,
    });

  };

  useEffect(() => {
    onChangeSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return [settings, setSettings];
}
