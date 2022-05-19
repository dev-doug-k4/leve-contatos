// ----------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark';
export type ThemeColorPresets = 'default';

type ColorVariants = {
  name: string;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
};

export type SettingsValueProps = {
  themeMode: ThemeMode;
  themeColorPresets: ThemeColorPresets;
};

export type SettingsContextProps = {
  themeMode: ThemeMode;
  themeColorPresets: ThemeColorPresets;
  setColor: ColorVariants;
  onToggleMode: VoidFunction;
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
