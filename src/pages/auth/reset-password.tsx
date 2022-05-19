import { useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// guards
import GuestGuard from '../../guards/GuestGuard';
// components
import Page from '../../components/Page';
import UnauthHeader from '../../components/UnauthHeader';
// sections
import { ResetPasswordForm, ResetPasswordCodeForm } from '../../sections/auth/reset-password';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
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

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <GuestGuard>
      <Page title={'Recuperar senha'} >
        <RootStyle>
          <UnauthHeader />
          <Container>
            <ContentStyle>
              {!sent ? (
                <>
                  <Typography variant="h3" paragraph>
                    Esqueceu a senha?
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                    Informe o email associado a sua conta e nós enviaremos um código para você resetar sua senha.
                  </Typography>

                  <ResetPasswordForm
                    onSent={() => setSent(true)}
                    onGetEmail={(value) => setEmail(value)}
                  />

                  <NextLink href={PATH_AUTH.login} passHref>
                    <Button fullWidth size="large" sx={{ mt: 1 }}>
                      Voltar
                    </Button>
                  </NextLink>
                </>
              ) : (
                <>
                  <Typography variant="h3" paragraph>
                    Redefinir senha
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                    Digite o código de 6 digitos enviado para o seu email e crie uma nova senha.
                  </Typography>

                  <ResetPasswordCodeForm
                    email={email}
                  />

                  <NextLink href={PATH_AUTH.login} passHref>
                    <Button fullWidth size="large" sx={{ mt: 1 }}>
                      Voltar
                    </Button>
                  </NextLink>
                </>
              )}
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}
