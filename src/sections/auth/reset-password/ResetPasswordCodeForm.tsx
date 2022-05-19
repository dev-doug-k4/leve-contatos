import { useState } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Auth } from "aws-amplify";
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import { Stack, Alert, InputAdornment, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';

import { FormProvider, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

type FormValuesProps = {
  code: string;
  password: string;
  afterSubmit?: string;
};

type Props = {
  email: string;
}

export default function ResetPasswordCodeForm({ email }: Props) {

  const [showPassword, setShowPassword] = useState(false);

  const { getSession } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const VerifyCodeSchema = Yup.object().shape({
    code: Yup.string().required("Informe o código de validação").min(6, "O código deve conter 6 dígitos numericos").max(6),
    password: Yup.string().min(8, "A senha deve conter 8 ou mais dígitos").required("Crie uma senha com 8 ou mais dígitos"),
  });

  const defaultValues = {
    password: '',
    code: '',
  };

  const methods = useForm<FormValuesProps>({
    mode: 'onBlur',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    setError,
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await Auth.forgotPasswordSubmit(email, data.code, data.password)

      enqueueSnackbar('Nova senha criada com sucesso!');
      await Auth.signIn(email, data.password);
      getSession()

    } catch (error: any) {
      reset()
      console.error(error);
      if (error.code === "CodeMismatchException") {
        setError('afterSubmit', { ...error, message: "Código inválido. Tente novamente" });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="code" label="Código de verificação" sx={{ maxLength: 6, }} />
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
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={!isValid}
        sx={{ mt: 3 }}
      >
        Verificar
      </LoadingButton>

    </FormProvider>
  );
}
