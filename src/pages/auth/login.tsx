import { useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Container, Typography, Button } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// guards
import GuestGuard from '../../guards/GuestGuard';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import UnauthHeader from '../../components/UnauthHeader';
// sections
import { LoginForm } from '../../sections/auth/login';
import { VerifyCodeForm } from '../../sections/auth/verify-code';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const [page, setPage] = useState('login')
  const [data, setData] = useState(null)

  return (
    <GuestGuard>
      <Page title={'Login'}>
        <RootStyle>
          <UnauthHeader />
          <Container maxWidth="sm">
            {page === 'login'
              ? <ContentStyle>
                <Typography variant="h3" paragraph>
                  Entrar
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                  Leve seus contatos, de forma rápida e segura.
                </Typography>

                <LoginForm
                  onSetVerify={(value) => setPage(value)}
                  // @ts-ignore
                  onGetData={(value) => setData(value)}
                />

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  Não tem uma conta?{' '}
                  <NextLink href={PATH_AUTH.register} passHref>
                    <Link variant="subtitle2">Registre-se</Link>
                  </NextLink>
                </Typography>
              </ContentStyle>

              : <ContentStyle>
                <Box sx={{ maxWidth: 480, mx: 'auto' }}>
                  <Button
                    size="small"
                    startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />}
                    sx={{ mb: 3 }}
                    onClick={() => setPage('login')}
                  >
                    Voltar
                  </Button>

                  <Typography variant="h3" paragraph>
                    Verifique seu email
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Enviamos um código de verificação de 6 dígitos para o seu email, por favor, informe-o abaixo para verificar seu email.
                  </Typography>

                  <Box sx={{ mt: 5, mb: 3 }}>
                    <VerifyCodeForm
                      // @ts-ignore
                      data={data}
                    />
                  </Box>

                </Box>
              </ContentStyle>
            }
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}
