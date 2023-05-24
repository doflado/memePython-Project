import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { Card, CircularProgress } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import UploadIcon from '@mui/icons-material/Upload';

import styles from './index.module.scss';

import { useAuth } from '@/context/AuthContext';
import PageContainer from '@/components/navigation/PageContainer';
import Button from '@/components/based/Button';
import { APP_API_URL, TEMPLATE_COLLECTION } from '@/global/constants';
import useFetchAPI from '@/hooks/useFetchAPI';
import GalleryHeading from '@/components/composed/gallery/GalleryHeading';

interface Categories {
  tab: string[];
  collection: string[];
  tags: string[];
}

export default function UploadPage() {
  //const [image, setImage] = useState<any>();
  //const [imageURL, setImageURL] = useState<string>();
  const { isVerified } = useAuth();
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState(['']);
  const [tab, setTab] = useState<string>('');
  const [collection, setCollection] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [categories, setCategories] = useState<any>({
    tab: [],
    collection: [],
    tags: [],
  });
  const fetchAPI = useFetchAPI();

  const onImageChange = (e: any) => {
    setImages(e.target.files);
  };

  const handleUpload = async () => {
    if (!images) {
      toast.error('Please select image to upload');
      return;
    }
    const data = new FormData();
    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i] as File;
      console.log(imageFile);
      if (imageFile.size >= 10 * 1024 * 1024) {
        toast.error('The maximum upload image size is 10 MB!');
        return;
      }
      data.append('image', images[i] as Blob, imageFile.name);
    }
    data.append('tab', tab);
    data.append('collection', collection);
    data.append('tags', tags);
    const toastLoadingID = toast.loading('Saving...');

    fetchAPI(`${APP_API_URL}/upload_template_asset`, 'POST', data, false).then(
      (res) => {
        toast.dismiss(toastLoadingID);

        if (res.success) {
          toast.success('Saved successfully!');
        }
      }
    );
  };

  // const handleTest = async () => {
  //   const data = new FormData();
  //   data.append('tab', '');
  //   data.append('collection', 'b');
  //   data.append('tags', '');

  //   fetchAPI(
  //     `${APP_API_URL}/list_template_assets_by_category`,
  //     'POST',
  //     data,
  //     false
  //   ).then((res) => {
  //     console.log(res.data);
  //     if (res.success) {
  //       toast.success('Saved successfully!');
  //     }
  //   });
  // };

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      newImageUrls.push(URL.createObjectURL(images[i]));
    }
    setImageURLs(newImageUrls);
  }, [images]);

  // useEffect(() => {
  //   if (!image) return;
  //   setImageURL(URL.createObjectURL(image));
  // }, [image]);

  useEffect(() => {
    (async () => {
      const t_categories: Categories = {
        tab: [],
        collection: [],
        tags: [],
      };
      await fetchAPI(`${APP_API_URL}/list_tags`, 'POST')
        .then((res) => {
          let i;
          for (i = 0; i < TEMPLATE_COLLECTION.Tab.length; i++) {
            t_categories.tab.push(TEMPLATE_COLLECTION['Tab'][i].data);
          }

          for (i = 0; i < TEMPLATE_COLLECTION.Collection.length; i++) {
            t_categories.collection.push(
              TEMPLATE_COLLECTION['Collection'][i].data
            );
          }

          for (i = 0; i < res.data.length; i++) {
            const tag = res.data[i].tag;
            t_categories.tags.push(tag);
          }

          setCategories(t_categories);
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);

  if (isVerified == false) {
    return <Navigate to="/" replace />;
  }
  return (
    <PageContainer
      heading={<GalleryHeading title={'Upload'} />}
      variant={styles.editor}
    >
      <div className={styles.gallery}>
        <div className={styles.images}>
          <div className={styles.placeholder}>
            <div className={styles.description}>
              Upload a new image to get started!
            </div>
            <input
              id="upload"
              style={{ display: 'none' }}
              type="file"
              multiple
              accept="image/*"
              onChange={onImageChange}
            />
            <Button className={styles.create}>
              <label className={styles.btnLabel} htmlFor="upload">
                <AddSharpIcon /> Open image file
              </label>
            </Button>
            {images &&
              Array.from(images).map((image, index) => (
                <div key={index} className={styles.images}>
                  <Card className={styles.widget}>
                    <div className={styles.imageWrapper}>
                      {imageURLs[index] ? (
                        <LazyLoadImage src={imageURLs[index]} effect="blur" />
                      ) : (
                        <CircularProgress />
                      )}
                    </div>
                    <div className={styles.infoContainer}>
                      <div className={styles.title}>{''}</div>
                    </div>
                  </Card>
                </div>
              ))}

            <div className={styles.features}>
              <div className={styles.list}>
                <div>Tab</div>
                <input value={tab} onChange={(e) => setTab(e.target.value)} />
                <select onChange={(e) => setTab(e.target.value)}>
                  <option>-- NONE --</option>
                  {categories.tab?.map((item: string) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.list}>
                <div>Collection</div>
                <input
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                />
                <select onChange={(e) => setCollection(e.target.value)}>
                  <option>-- NONE --</option>
                  {categories.collection?.map((item: string) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.list}>
                <div>Tags</div>
                <input value={tags} onChange={(e) => setTags(e.target.value)} />
                <select onChange={(e) => setTags(e.target.value)}>
                  <option>-- NONE --</option>
                  {categories.tags?.map((item: string) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button className={styles.create} onClick={handleUpload}>
              <UploadIcon /> Upload
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
