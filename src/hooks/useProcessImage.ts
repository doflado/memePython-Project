import { useEffect, useState } from 'react';
// import imageCompression from 'browser-image-compression';
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

export default function useProcessImage(asset: AssetInfoType | null) {
  const [processedImage, setProcessedImage] = useState<
    PinturaDefaultImageWriterResult[]
  >([]);
  const [processing, setProcessing] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  // const [previewUrl, setPreviewUrl] = useState<string>();

  // const compressImage = async (image: File) => {
  //   if (!image) return undefined;
  //   // cannot compress gif file
  //   if (image.type == 'image/gif') {
  //     return image;
  //   }
  //   const options = {
  //     maxSizeMB: 0.05,
  //     maxWidthOrHeight: 300,
  //     useWebWorker: true,
  //     maxIteration: 5,
  //   };
  //   try {
  //     const compressedFile = await imageCompression(image, options);
  //     setPreviewUrl(URL.createObjectURL(compressedFile));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    async function processAsset() {
      try {
        if (!asset) return;
        const turl: string[] = [];
        setProcessing(true);
        for (const path of asset.file_path.split('%')) {
          if (path != '') {
            const res = await processImage(`${APP_ASSET_URL}${path}`, {
              imageReader: createDefaultImageReader(),
              imageWriter: createDefaultImageWriter(),
              imageScrambler: createDefaultImageScrambler(),
              shapePreprocessor: createDefaultShapePreprocessor(),
              imageState: asset.meta_file_path
                ? await loadJSON(`${APP_ASSET_URL}${asset.meta_file_path}`)
                : undefined,
            });
            if (res != null) {
              turl.push(URL.createObjectURL(res?.dest as Blob));
            } else {
              turl.push('');
            }
          }
        }
        setUrls(turl);
        setProcessing(false);
      } catch (error) {
        console.error(error);
        setProcessing(false);
      }
    }

    processAsset();
  }, [asset]);

  return {
    url: urls,
    content: processedImage[0]?.dest as Blob,
    processing,
  };
}
