import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Auth } from "aws-amplify";
// import { createUser } from '../../../graphql/mutations'
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import { OutlinedInput, Stack, Alert, Typography, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';


// ----------------------------------------------------------------------

type FormValuesProps = {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
  afterSubmit?: string;
};

type ValueNames = 'code1' | 'code2' | 'code3' | 'code4' | 'code5' | 'code6';

type Props = {
  data: {
    email: string;
    password: string;
  };
}

export default function VerifyCodeForm({ data }: Props) {
  const { getSession } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const email = data?.email

  const password = data?.password

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required(),
    code2: Yup.string().required(),
    code3: Yup.string().required(),
    code4: Yup.string().required(),
    code5: Yup.string().required(),
    code6: Yup.string().required(),
  });

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
  };

  const methods = useForm<FormValuesProps>({
    mode: 'onBlur',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    watch,
    setError,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    document.addEventListener('paste', handlePasteClipboard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onSubmit = async (data: FormValuesProps) => {
    try {
      const { code1, code2, code3, code4, code5, code6 } = data

      await Auth.confirmSignUp(email, `${code1}${code2}${code3}${code4}${code5}${code6}`)

      await Auth.signIn(email, password);
      getSession()

      enqueueSnackbar('Email verificado com sucesso!');

    } catch (error: any) {
      reset()
      console.error(error);
      if (error.code === "CodeMismatchException") {
        setError('afterSubmit', { ...error, message: "Código inválido. Tente novamente" });
      } else {
        setError('afterSubmit', { ...error, message: "Ocorreu um erro. Tente novamente mais tarde." });
      }
    }
  };

  const onResendCode = async () => {
    try {
      await Auth.resendSignUp(email);
      enqueueSnackbar('Novo código enviado!');
    } catch (error) {
      console.log(error)
    }
  }

  const handlePasteClipboard = (event: ClipboardEvent) => {
    let data: string | string[] = event?.clipboardData?.getData('Text') || '';

    data = data.split('');

    [].forEach.call(document.querySelectorAll('#field-code'), (node: any, index) => {
      node.value = data[index];
      const fieldIndex = `code${index + 1}`;
      setValue(fieldIndex as ValueNames, data[index]);
    });
  };

  const handleChangeWithNextField = (
    event: React.ChangeEvent<HTMLInputElement>,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    const { maxLength, value, name } = event.target;
    const fieldIndex = name.replace('code', '');

    const fieldIntIndex = Number(fieldIndex);

    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

        if (nextfield !== null) {
          (nextfield as HTMLElement).focus();
        }
      }
    }

    handleChange(event);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <Stack direction="row" spacing={2} justifyContent="center">
          {Object.keys(values).map((name, index) => (
            <Controller
              key={name}
              name={`code${index + 1}` as ValueNames}
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  {...field}
                  id="field-code"
                  autoFocus={index === 0}
                  placeholder="-"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeWithNextField(event, field.onChange)
                  }
                  inputProps={{
                    maxLength: 1,
                    sx: {
                      p: 0,
                      textAlign: 'center',
                      width: { xs: 36, sm: 56 },
                      height: { xs: 36, sm: 56 },
                    },
                  }}
                />
              )}
            />
          ))}
        </Stack>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || isSubmitSuccessful}
        // disabled={!isValid}
        sx={{ mt: 3 }}
      >
        Verificar
      </LoadingButton>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Não recebeu o código? &nbsp;
        <Link variant="subtitle2" underline="none" onClick={() => onResendCode()} sx={{ cursor: 'pointer' }}>
          Reenviar código
        </Link>
      </Typography>
    </form>
  );
}
