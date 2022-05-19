import * as Yup from 'yup';
import { useState } from 'react';
// amplify
import { Auth } from 'aws-amplify';
// next
import NextLink from 'next/link';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

type Props = {
  onSetVerify: (value: string) => void;
  onGetData: (value: FormValuesProps) => void;
};

export default function LoginForm({ onSetVerify, onGetData }: Props) {
  const { getSession } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Informe seu email'),
    password: Yup.string().min(8, "A senha tem 8 ou mais dígitos").required('Informe sua senha'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;


  const onSubmit = async (data: FormValuesProps) => {
    onGetData(data)
    try {
      await Auth.signIn(data.email, data.password);
      getSession()
    } catch (error: any) {
      console.error(error);
      reset();

      let message = 'Ocorreu um erro. Tente novamente mais tarde'

      if (error.code === "NotAuthorizedException") {
        message = "Email ou senha incorreto"

      } else if (error.code === "UserNotConfirmedException") {
        onSetVerify('verify-code')
        return

      } else if (error.code === "UserNotFoundException") {
        message = "Email ou senha incorreto"
      }
      setError('afterSubmit', { ...error, message });

    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email" />

        <RHFTextField
          name="password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <RHFCheckbox name="remember" label="Lembre-se de mim" /> */}
        <NextLink href={PATH_AUTH.resetPassword} passHref>
          <Link variant="subtitle2">Esqueceu a senha?</Link>
        </NextLink>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || isSubmitSuccessful}
      >
        Entrar
      </LoadingButton>
    </FormProvider>
  );
}
