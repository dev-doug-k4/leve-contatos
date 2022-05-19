import { useEffect, useState } from 'react';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';
import S3Image from './S3Image';

// ----------------------------------------------------------------------

type Props = {
  src?: string | undefined;
  alt?: string | undefined;
  sx?: any;
}

export default function CustomAvatar({ src, alt, sx, ...other }: Props) {
  const [error, setError] = useState(false)
  return (
    <Avatar
      src={src}
      alt={alt}
      color={!!src ? 'default' : createAvatar(!!alt ? alt : 'AA').color}
      sx={{ ...sx }}
      {...other}
      onError={() => setError(true)}
    >
      {!!src && !error
        ? <S3Image imageKey={src} alt={alt} />
        : createAvatar(!!alt ? alt : 'AA').name
      }
    </Avatar>
  );
}
