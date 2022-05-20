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

export default function CustomAvatar({ src = '', alt, sx, ...other }: Props) {
  return (
    <Avatar
      src={src}
      alt={alt}
      color={!!src ? 'default' : createAvatar(!!alt ? alt : 'AA').color}
      sx={{ ...sx }}
      {...other}
    >
      {!!src
        ? <S3Image imageKey={src} alt={alt} />
        : createAvatar(!!alt ? alt : '??').name
      }
    </Avatar>
  );
}
