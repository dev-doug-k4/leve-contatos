// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, Container } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
import useAuth from '../hooks/useAuth';
// utils
import cssStyles from '../utils/cssStyles';
// config
import { HEADER } from '../config';
// components
import Logo from './Logo';
import Iconify from './Iconify';
import { IconButtonAnimate } from './animate';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  // backgroundColor: theme.palette.background.default,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

export default function Header() {

  const { themeMode, onToggleMode } = useSettings();

  const { logout } = useAuth();

  return (
    <>
      <RootStyle>
        <Container maxWidth="md">
          <Toolbar disableGutters={true}>
            <Logo />

            <Box sx={{ flexGrow: 1 }} />
            <Stack
              direction="row"
              alignItems="center"
            >
              <IconButtonAnimate onClick={onToggleMode} sx={{ color: themeMode === 'light' ? 'dark' : 'text.secondary' }}>
                {themeMode === 'light'
                  ? < Iconify icon="ic:twotone-light-mode" width={20} height={20} />
                  : <Iconify icon="ic:twotone-dark-mode" width={20} height={20} />
                }
              </IconButtonAnimate>

              <IconButtonAnimate onClick={logout} sx={{ color: themeMode === 'light' ? 'dark' : 'text.secondary' }}>
                < Iconify icon="ic:twotone-logout" width={20} height={20} />
              </IconButtonAnimate>

            </Stack>
          </Toolbar>
        </Container>
      </RootStyle>
    </>
  );
}
