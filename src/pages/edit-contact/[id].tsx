/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck 
import { useEffect, useState, useCallback } from 'react'
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// amplify
import { Storage } from "aws-amplify";
import { DataStore } from '@aws-amplify/datastore';
import { Contact } from '../../models'
import { useRouter } from 'next/router';
// routes
import { PATH_APP } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';
// utils
import { readFileAsync, loadImgAsync, createCanvas, imgToBlobAsync } from '../../utils/resizeImage'
import { phoneMask } from '../../utils/masks'
// guards
import AuthGuard from '../../guards/AuthGuard';
// components
import {
  FormProvider,
  RHFTextField,
  RHFUploadAvatar,
} from '../../components/hook-form';
import Page from '../../components/Page';
import Header from '../../components/Header';
import SocialsButton from '../../components/SocialsButton';
// @types
import { Contact as ContactTypes } from '../../@types/API';

// ----------------------------------------------------------------------

export default function EstablismentGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { push, query } = useRouter();

  const [contact, setContact] = useState<null | ContactTypes>(null)

  const { user } = useAuth()

  const [file, setFile] = useState<null | { fileResized: File | string; fileName: string; canvas: HTMLCanvasElement | string }>(null);

  const [fromS3, setIsfromS3] = useState(false)

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Informe o nome do contato'),
    cover: Yup.string(),
    facebookLink: Yup.string(),
    twitterLink: Yup.string(),
    instagramLink: Yup.string(),
    phone: Yup.string()
      .required('Informe o telefone')
      .transform(value => value.replace(/\D/g, ''))
      .min(10, 'Numero inválido'),
  });

  const defaultValues = {
    name: contact?.name || '',
    cover: contact?.cover || '',
    phone: contact?.phone || '',
    facebookLink: contact?.facebookLink || '',
    instagramLink: contact?.instagramLink || '',
    linkedinLink: contact?.linkedinLink || '',
    twitterLink: contact?.twitterLink || '',
  };

  const methods = useForm<ContactTypes>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, isDirty },
  } = methods;

  const values = watch();

  const getContact = async () => {
    try {
      const result = await DataStore.query(Contact, query.id);
      setContact(result)

      if (!!result) {
        setContact(result)
        result?.phone && setValue('phone', phoneMask(result?.phone))
        setValue('name', result?.name)
        setValue('facebookLink', result?.facebookLink)
        setValue('instagramLink', result?.instagramLink)
        setValue('linkedinLink', result?.linkedinLink)
        setValue('twitterLink', result?.twitterLink)

        if (!!result?.cover) {
          setIsfromS3(true)
          setValue('cover', result?.cover)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!!query?.id) {
      getContact()
    }
  }, [query])

  // SUBMIT ----------------------------------------------------------------
  const onSubmit = async (data: ContactTypes) => {
    try {

      if (!!file && file?.fileResized && file?.fileName) {
        await uploadFile(file?.fileResized, file?.fileName)
      }

      if (file) {
        data = {
          ...data,
          // @ts-ignore
          cover: file?.fileName,
        }
      }

      await DataStore.save(
        Contact.copyOf(contact, updated => {
          updated.name = data.name
          updated.cover = data.cover
          updated.phone = data.phone
          updated.facebookLink = data.facebookLink
          updated.instagramLink = data.instagramLink
          updated.linkedinLink = data.linkedinLink
          updated.twitterLink = data.twitterLink
        })
      )

      push(PATH_APP.root)

      enqueueSnackbar('Contato adicionado com sucesso!');
      setFile(null)

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful])


  const handleDrop = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      if (file) {
        processFile(file)
        setIsfromS3(false)
        setValue(
          'cover',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  // RESIZE FILE IN TWO SIZES -----------------------------------------------------------
  const processFile = async (file: File | any) => {
    const originalFileName = file.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const fileName = `contacts/${user?.sub}/${Date.now()}.webp`;

    const imgSrc = await readFileAsync(file);
    const img = await loadImgAsync(imgSrc)

    const canvas = createCanvas(img, 300)
    const imgBlob = await imgToBlobAsync(img, canvas)

    const fileResized = new File([imgBlob], originalFileName, {
      type: 'image/*',
      lastModified: Date.now()
    });

    setFile({ fileResized, fileName, canvas })
  };

  useEffect(() => {
    if (values?.phone) setValue('phone', phoneMask(values.phone)) // ADD PHONE MASK    
  }, [values.phone])

  return (
    <AuthGuard >
      <Page title={'Home'}>
        <Header />
        <Container maxWidth="md" sx={{ mt: { xs: 10, md: 15 } }} >
          <Box>
            <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Editar Contato
              </Typography>
            </Stack>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3} maxWidth='md'>
                <Grid item xs={12} md={4} >
                  <Card sx={{ py: { xs: 5, md: 10 }, px: 3, textAlign: 'center' }}>
                    <RHFUploadAvatar
                      name="cover"
                      fromS3={fromS3}
                      accept="image/*"
                      maxSize={3145728}
                      onDrop={handleDrop}
                    />
                    {!!contact &&
                      <>
                        <Typography variant='h5' sx={{ mt: 2 }}>{contact?.name}</Typography>
                        <Stack alignItems="center">
                          <SocialsButton
                            initialColor
                            sx={{ mt: 2.5 }}
                            links={{
                              facebook: contact?.facebookLink,
                              instagram: contact?.instagramLink,
                              linkedin: contact?.linkedinLink,
                              twitter: contact?.twitterLink,
                            }}
                          />
                        </Stack>
                      </>
                    }
                  </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'grid',
                        rowGap: 3,
                        columnGap: 2,
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                      }}
                    >
                      <RHFTextField name="name" label="Nome" />

                      <RHFTextField name="phone" label="Telefone" />

                      <RHFTextField name="facebookLink" label="Facebook" />

                      <RHFTextField name="instagramLink" label="Instagram" />

                      <RHFTextField name="linkedinLink" label="Linkedin" />

                      <RHFTextField name="twitterLink" label="Twiter" />

                    </Box>
                    <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!isDirty && !file}>
                        Salvar
                      </LoadingButton>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </FormProvider>
          </Box>
        </Container>
      </Page>
    </AuthGuard>
  );
}

// UPLOAD FILE TO S3 ------------------------------------------------------------------------

async function uploadFile(uri: any, filename: string) {
  await Storage.put(filename, uri, {
    contentType: "image/png",
    progressCallback: (progress: { loaded: any; total: any; }) => {
      console.log(`Uploaded: ${progress.loaded / progress.total}%`)
    }
  })
    .then(result => console.log(result?.key))
    .catch(err => console.log(err));
};


