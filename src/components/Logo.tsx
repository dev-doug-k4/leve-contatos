import { forwardRef } from 'react';
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
  isOffset?: boolean;
  isHome?: boolean;
}

const Logo = forwardRef<any, Props>(({ disabledLink = false, sx, isOffset, isHome }, ref) => {
  // const theme = useTheme();

  // const isLight = theme.palette.mode === 'light';
  // const PRIMARY_MAIN = theme.palette.primary.main;
  // const LOGO_LETTERS = !!isOffset || !isHome ? theme.palette.text.primary : '#fff';

  const logo = (
    <Box ref={ref} sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}>
      <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.5714 18.9841C32.0779 18.9841 34.9206 16.1415 34.9206 12.6349C34.9206 9.12834 32.0779 6.28571 28.5714 6.28571C25.0648 6.28571 22.2222 9.12834 22.2222 12.6349C22.2222 16.1415 25.0648 18.9841 28.5714 18.9841Z" fill="#FF00EF" />
        <path d="M17.1428 29.6509C17.1428 24.4611 21.3499 20.2539 26.5396 20.2539H30.6032C35.7929 20.2539 40 24.4611 40 29.6509H17.1428Z" fill="#00FFAC" />
        <path d="M17.143 21.5238C22.4028 21.5238 26.6668 17.2599 26.6668 12C26.6668 6.74015 22.4028 2.4762 17.143 2.4762C11.8831 2.4762 7.61914 6.74015 7.61914 12C7.61914 17.2599 11.8831 21.5238 17.143 21.5238Z" fill="#00FFAC" />
        <path d="M0 36.7619C0 29.3981 5.96954 23.4286 13.3333 23.4286H20.9524C28.3162 23.4286 34.2857 29.3981 34.2857 36.7619V37.5238H0V36.7619Z" fill="#FF00EF" />
        <path fillRule="evenodd" clipRule="evenodd" d="M19.4979 23.4286C18.0323 25.0859 17.1428 27.2644 17.1428 29.6509H32.2331C29.8712 25.9118 25.7019 23.4286 20.9523 23.4286H19.4979Z" fill="#2E00A1" />
        <path fillRule="evenodd" clipRule="evenodd" d="M24.7588 17.7136C25.9548 16.1218 26.6634 14.143 26.6634 11.9987C26.6634 10.233 26.1828 8.57955 25.3455 7.16193C23.4742 8.26642 22.219 10.3034 22.219 12.6336C22.219 14.711 23.2165 16.5553 24.7588 17.7136Z" fill="#2E00A1" />
      </svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <NextLink href="/">{logo}</NextLink>;
});
Logo.displayName = 'Logo';
export default Logo;
