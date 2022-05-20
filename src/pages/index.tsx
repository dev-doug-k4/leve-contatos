// @ts-nocheck
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// amplify
import { API, graphqlOperation } from 'aws-amplify'
// import { listContacts } from '../graphql/queries';
import { deleteContact } from '../graphql/mutations';
// next
import { useRouter } from 'next/router';

import useAuth from '../hooks/useAuth';
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
import { ListContactsQuery } from '../@types/API';

// ----------------------------------------------------------------------

const Home = () => {
  const { push } = useRouter();

  const { isAuthenticated, isInitialized } = useAuth()

  const [contacts, setContacts] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteContact = async (id: string) => {
    try {
      setIsLoading(true)
      await API.graphql(graphqlOperation(deleteContact, { input: { id: id } }))
      const newContacts = contacts.filter(c => c.id !== id)
      setContacts(newContacts)
      enqueueSnackbar('Contacto excluido com sucesso')
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Ocorreu um erro. Tente novamente mais tarde.', { variant: 'error' })
    }
    setIsLoading(false)
  };

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      return async () => {
        try {
          const result = await (API.graphql(graphqlOperation(listContacts))) as { data: ListContactsQuery }
          setContacts(result.data.listContacts.items)
          // console.log("Contacts retrieved successfully!", JSON.stringify(result, null, 2));
        } catch (error) {
          console.log("Error retrieving contacts", error);
        }
      }
    }
  }, [isAuthenticated, isInitialized])

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

// GRAPHQL ---------------------------------------------------
const listContacts = /* GraphQL */ `
  query ListContacts(
    $filter: ModelContactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        cover
      }
      nextToken
    }
  }
`;
