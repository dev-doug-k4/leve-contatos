// @ts-nocheck
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// amplify
import { DataStore } from '@aws-amplify/datastore';
import { Hub } from 'aws-amplify';
import { Contact } from '../models'
// next
import { useRouter } from 'next/router';
// @mui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// routes
import { PATH_APP } from '../routes/paths';
// guards
import AuthGuard from '../guards/AuthGuard';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Header from '../components/Header';
import ContactCard from '../components/ContactCard'
// @types
import { Contact as ContactTypes } from '../@types/API';

// ----------------------------------------------------------------------

const Home = () => {
  const { push } = useRouter();

  const [contacts, setContacts] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteContact = async (id: string) => {
    try {
      setIsLoading(true)

      const result = await DataStore.query(Contact, id);
      DataStore.delete(result);

      const newContacts = contacts.filter(c => c.id !== id)
      setContacts(newContacts)

      enqueueSnackbar('Contacto excluido com sucesso')
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Ocorreu um erro. Tente novamente mais tarde.', { variant: 'error' })
    }
    setIsLoading(false)
  };

  const listContacts = async () => {
    try {
      const result = await DataStore.query(Contact);
      setContacts(result)
      // console.log("Contacts retrieved successfully!", JSON.stringify(result, null, 2));
    } catch (error) {
      console.log("Error retrieving contacts", error);
    }
  }

  useEffect(() => {
    listContacts()
    // Create listener
    const listener = Hub.listen('datastore', async hubData => {
      const { event, data } = hubData.payload;
      if (event === 'networkStatus') {
        console.log(`User has a network connection: ${data.active}`)
      }
    })

    // Remove listener
    listener();
  }, [])

  return (
    <AuthGuard >
      <Page title={'Home'}>
        <Header />
        <Container maxWidth="md" sx={{ mt: { xs: 10, md: 15 } }} >
          <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4">
              Contatos
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={() => push(PATH_APP.newContact)}
            >
              Adicionar
            </Button>
          </Stack>

          <Grid container spacing={{ xs: 2, md: 3 }} my={{ xs: 1, md: 2 }}>
            {contacts.map((contact, index) =>
              // @ts-ignore
              <Grid key={contact.id} item xs={12} sm={12} md={12} >
                <ContactCard contact={contact} onDelete={() => handleDeleteContact(contact.id)} isLoading={isLoading} />
              </Grid>
            )}
          </Grid>
        </Container>
      </Page>
    </AuthGuard >
  )
}

export default Home
