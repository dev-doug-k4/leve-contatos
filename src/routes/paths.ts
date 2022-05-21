// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_APP = '/';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_APP = {
  // root: ROOTS_APP,
  root: path(ROOTS_APP, '#contacts'),
  newContact: path(ROOTS_APP, 'new-contact'),
  editContact: path(ROOTS_APP, 'edit-contact/:id'),
}
