import { Auth } from "aws-amplify";
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  afterSubmit?: string;
};

type Props = {
  onSent: VoidFunction;
  onGetEmail: (value: string) => void;
};

export default function ResetPasswordForm({ onSent, onGetEmail }: Props) {

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Informe seu email'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await Auth.forgotPassword(data.email)
      onSent();
      onGetEmail(data.email);

    } catch (error: any) {
      console.error(error);
      if (error.code === "UserNotFoundException") {
        setError('afterSubmit', { ...error, message: "Nenhuma conta associada a esse email foi encontrada" });
      } else {
        // dispatch(openMsg("Ocorreu um erro. Tente novamente mais tarde"))
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
