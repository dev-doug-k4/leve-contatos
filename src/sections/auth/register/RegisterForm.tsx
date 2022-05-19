import * as Yup from 'yup';
import { useState } from 'react';
import { Auth } from "aws-amplify";
// routes
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  afterSubmit?: string;
};

type Props = {
  onSetVerify: (value: boolean) => void;
  onGetData: (value: FormValuesProps) => void;
};

export default function RegisterForm({ onSetVerify, onGetData }: Props) {
  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('Informe seu nome'),
    lastName: Yup.string().required('Informe seu sobrenome'),
    email: Yup.string().email('Email inválido').required('Informe seu email'),
    password: Yup.string().min(8, "A senha deve conter 8 ou mais dígitos").required('Informe sua senha'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await Auth.signUp({ username: data.email, password: data.password, attributes: { email: data.email, name: `${data.firstName} ${data.lastName}` } })
      onGetData(data)
      onSetVerify(true)

    } catch (error: any) {
      console.error(error);

      if (isMountedRef.current) {
        let message = 'Ocorreu um erro. Tente novamente mais tarde'

        if (error.code === "UsernameExistsException") {
          message = "Email já utilizado em outra conta. Efetue login."
        }
        setError('afterSubmit', { ...error, message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="Nome" />
          <RHFTextField name="lastName" label="Sobrenome" />
        </Stack>

        <RHFTextField name="email" label="Email" />

        <RHFTextField
          name="password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Registrar
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
