import Image, { ImageRato } from './Image'
// @mui
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  imageKey?: string | undefined;
  alt: string | undefined;
  ratio?: ImageRato;
  sx?: SxProps<Theme>;
}

export default function S3Image({ imageKey, alt, ratio, sx, ...props }: Props) {
  // @ts-ignore
  const url = process.env.STORAGE_URL + imageKey

  return (
    <Image src={url} alt={alt} ratio={ratio} sx={sx}  {...props} />
  )
}
