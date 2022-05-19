import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// amplify
import { API, graphqlOperation } from 'aws-amplify'
// graphql
import { createContact, updateContact } from '../../graphql/mutations'
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
// redux
// import { useDispatch } from '../../../redux/store';
// components
import { FormProvider, RHFTextField } from '../../components/hook-form';
// @types
import { Contact } from '../../@types/API'

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string;
  date: Date | null;
};

type Props = {
  onCancel: VoidFunction;
  onCreate: (item: Contact) => void;
  contact?: Contact | null;
};

export default function ContactForm({ onCancel, onCreate, contact }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  // const dispatch = useDispatch();

  const defaultValues = {
    name: contact?.name || '',
  }


  const ContactSchema = Yup.object().shape({
    name: Yup.string().max(60).required('Informe o nome do contacto'),
  });

  const methods = useForm({
    resolver: yupResolver(ContactSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const newContact = {
        name: data.name,
        // @ts-ignore
        date: data.date.toISOString(),
      };

      if (!!contact) {
        const updateResult = await API.graphql(graphqlOperation(updateContact, { input: { ...newContact, id: contact.id } }))
        // @ts-ignore
        onCreate(updateResult.data.updateContact)
        enqueueSnackbar('Contacto editado com sucesso!');
      } else {
        const createResult = await API.graphql(graphqlOperation(createContact, { input: newContact }))
        // @ts-ignore
        onCreate(createResult.data.createContact)
        enqueueSnackbar('Contacto adicionado com sucesso!');
      }

      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // @ts-ignore
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="name" label="Nome" />
      </Stack>

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
        // loadingIndicator="Loading..."
        >
          {!!contact ? 'Salvar' : 'Adicionar'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
