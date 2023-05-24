import { useState } from 'react';
import {
  createDefaultImageReader,
  createDefaultImageScrambler,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,
  PinturaDefaultImageWriterResult,
  processImage,
} from '@pqina/pintura';

import { AssetInfoType } from '@/global/types';
import { APP_ASSET_URL } from '@/global/constants';
import { loadJSON } from '@/global/utils';

export default async function useProcessThumbnail(asset: AssetInfoType | null) {
  const [processedThumbnail] = useState<PinturaDefaultImageWriterResult[]>([]);
  const data: string[] = [];
  async function getThumbnailFiles(str: AssetInfoType) {
    const buffer: string[] = str.thumbnail_file_path.split('%');
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] != '') {
        const res = await processImage(`${APP_ASSET_URL}${buffer[i]}`, {
          imageReader: createDefaultImageReader(),
          imageWriter: createDefaultImageWriter(),
          imageScrambler: createDefaultImageScrambler(),
          shapePreprocessor: createDefaultShapePreprocessor(),
          imageState: str.meta_file_path
            ? loadJSON(`${APP_ASSET_URL}${str.meta_file_path}`)
            : undefined,
        });
        if (res != null) {
          data.push(URL.createObjectURL(res?.dest as Blob));
        } else {
          data.push('');
        }
      }
    }
  }
  if (!asset)
    return {
      url: [],
      content: processedThumbnail[0]?.dest as Blob,
    };
  await getThumbnailFiles(asset);
  // useEffect(() => {
  //   compressImage(processedImage?.dest as File);
  // }, [processedImage]);

  // return {
  //   url: previewUrl ? previewUrl : null,
  //   content: processedImage?.dest as Blob,
  // };
  return {
    url: data,
    content: processedThumbnail[0]?.dest as Blob,
  };
}
