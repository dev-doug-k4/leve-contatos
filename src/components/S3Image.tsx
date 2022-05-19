import { useEffect, useState } from 'react';
import { Storage } from "aws-amplify";
import Image, { ImageRato } from './Image'
// import Image from 'next/image'
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

  const [cover, setCover] = useState<string | undefined>('');

  useEffect(() => {
    async function getImageFromStorage() {
      try {
        // @ts-ignore
        const signedURL = await Storage.get(imageKey);
        // @ts-ignore
        setCover(signedURL);
      } catch (error) {
        console.log("No image found.");
      }
    }
    getImageFromStorage();
  }, [imageKey]);

  return (
    <Image src={cover} alt={alt} ratio={ratio} sx={sx}  {...props} />
  )
}
