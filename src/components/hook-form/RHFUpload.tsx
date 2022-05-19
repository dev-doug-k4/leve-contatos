// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
// type
import UploadAvatar from './UploadAvatar'

// ----------------------------------------------------------------------

interface Props {
  name: string;
  fromS3: boolean;
}

export function RHFUploadAvatar({ name, fromS3 = false, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <div>
            <UploadAvatar error={checkError} {...other} file={field.value} fromS3={fromS3} />
            {checkError && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}