import React, { useState, useEffect } from "react";
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// routes
import { PATH_APP } from '../routes/paths';
// @mui
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
// components
import Iconify from '../components/Iconify';
import MenuPopover from './MenuPopover';
import CustomAvatar from "./CustomAvatar";
//types
import { Contact as ContactTypes } from '../@types/API';

// ----------------------------------------------------------------------

type Props = {
  contact: ContactTypes | null;
  onDelete: VoidFunction;
  isLoading: boolean;
}

function ContactItem({ contact, onDelete, isLoading }: Props) {
  const theme = useTheme();

  return (
    <Paper
      key={contact?.id}
      sx={{
        borderRadius: 2,
        p: { xs: theme.spacing(2), md: theme.spacing(3) },
        bgcolor: 'background.neutral',
        cursor: 'pointer',
      }}
    >
      <Stack direction='row' alignItems='center' >
        <NextLink href={PATH_APP.root + 'edit-contact/' + contact?.id} passHref>
          <Stack direction='row' alignItems='center' >
            {/* @ts-ignore */}
            <CustomAvatar src={contact?.cover || ''} alt={contact?.name} sx={{ height: { xs: 40, md: 50 }, width: { xs: 40, md: 50 } }} />

            <Divider orientation="vertical" flexItem sx={{ mx: { xs: 2, md: 3 } }} />

            <Typography variant="subtitle2"
              sx={{
                wordWrap: 'break-word',
                display: "inline-block",
              }}
            >
              {contact?.name}
            </Typography>

          </Stack>
        </NextLink>
        <Box flexGrow={1} />
        {!!contact &&
          <MoreMenuButton contact={contact} onDelete={onDelete} isLoading={isLoading} />
        }

      </Stack>

    </Paper>
  );
};
export default ContactItem

// MENU ----------------------------------------------------------------------

function MoreMenuButton({ contact, onDelete, isLoading }: Props) {
  const { push } = useRouter();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const [dialog, setDialog] = useState(false);

  const handleOpen = (contact: any) => {
    setOpen(contact.currentTarget);
  };

  useEffect(() => {
    setOpen(null)
  }, [dialog])

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen} sx={{ mr: -2, ml: 2, zIndex: 10 }}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => setOpen(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disabledArrow
        sx={{
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem onClick={() => push(PATH_APP.root + 'edit-contact/' + contact?.id)} >
          <Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />
          Editar
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={() => setDialog(true)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          Excluir
        </MenuItem>
      </MenuPopover>

      {!!dialog &&
        <Dialog open={!!dialog} onClose={() => setDialog(false)}>
          <DialogTitle>Excluir contato</DialogTitle>
          <DialogContent sx={{ mt: 1, pb: 0 }}>
            <DialogContentText>
              Deseja realmente excluir esse contato?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)}>Voltar</Button>
            <LoadingButton loading={isLoading} onClick={onDelete}>Excluir</LoadingButton>
          </DialogActions>
        </Dialog>
      }

    </>
  );
};
