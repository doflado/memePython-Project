/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from 'react-redux';

import { useUpdateOpenedAssets } from '../application/hooks';

import {
  updateDisplayedAssets,
  updateTemplateAssets,
  // updateDisplayedAssetsPreview,
  // updateTemplateAssetsPreview,
  updateIsLoading,
  updatePreviewSelectedId,
} from './index';

import { useAppSelector } from '@/state/store';
import { AssetInfoType } from '@/global/types';
import { APP_API_URL } from '@/global/constants';
import useFetchAPI from '@/hooks/useFetchAPI';

// === displayedAssets ===

export const useDisplayedAssets = () =>
  useAppSelector((state) => state.gallery.displayedAssets) as AssetInfoType[];

export const useTemplateAssets = () =>
  useAppSelector((state) => state.gallery.templateAssets) as AssetInfoType[];

export const useUpdateDisplayedAssets = () => {
  const dispatch = useDispatch();
  const fetchAPI = useFetchAPI();
  const updateOpenedAssets = useUpdateOpenedAssets();
  const updateIsLoading = useUpdateIsLoading();

  const handleUpdateTemplateAssets = () => {
    updateIsLoading(true);
    fetchAPI(`${APP_API_URL}/list_assets`, 'POST')
      .then((listedAssets) => {
        const assets = [...listedAssets.data];
        const uniqueAssets = removeDuplicates(assets, 'file_name');
        uniqueAssets.sort((a, b) => (a.file_name > b.file_name ? 1 : -1));
        dispatch(updateDisplayedAssets(uniqueAssets));
        updateOpenedAssets(assets);
        updateIsLoading(false);
      })
      .catch(() => {
        updateIsLoading(false);
      });
  };

  return handleUpdateTemplateAssets;
};

function removeDuplicates(array: any[], key: string) {
  return array.filter(
    (obj: { [x: string]: any }, index: any, self: any[]) =>
      index ===
      self.findIndex((el: { [x: string]: any }) => el[key] === obj[key])
  );
}

export const useUpdateTemplateAssets = () => {
  const dispatch = useDispatch();
  const fetchAPI = useFetchAPI();
  // const updateOpenedAssets = useUpdateOpenedAssets();
  const updateIsLoading = useUpdateIsLoading();

  const handleUpdateDisplayedAssets = async () => {
    updateIsLoading(true);
    fetchAPI(`${APP_API_URL}/list_template_assets`, 'POST')
      .then((templateAssets) => {
        const assets = [...templateAssets.data];
        const uniqueAssets = removeDuplicates(assets, 'file_name');
        uniqueAssets.sort((a, b) => (a.file_name > b.file_name ? 1 : -1));
        dispatch(updateTemplateAssets(uniqueAssets));
        updateIsLoading(false);
      })
      .catch(() => {
        updateIsLoading(false);
      });
  };

  return handleUpdateDisplayedAssets;
};

// === previewSelectedId ===

export const usePreviewSelectedId = () =>
  useAppSelector((state) => state.gallery.previewSelectedId) as number | null;

export const useUpdatePreviewSelectedId = () => {
  const previewSelectedId = usePreviewSelectedId();
  const dispatch = useDispatch();

  return (id: number) => {
    dispatch(
      updatePreviewSelectedId(
        previewSelectedId === null ? id : previewSelectedId === id ? null : id
      )
    );
  };
};

export const usePreviewSelectedAsset = () => {
  const previewSelectedId = usePreviewSelectedId();
  const displayedAssets = useDisplayedAssets();
  const templateAssets = useTemplateAssets();
  const allAssets = [...displayedAssets, ...templateAssets];

  if (!previewSelectedId) return null;
  return allAssets.filter((asset) => asset.uid === previewSelectedId)[0];
};

// === isLoading ===

export const useIsLoading = () =>
  useAppSelector((state) => state.gallery.isLoading) as boolean;

export const useUpdateIsLoading = () => {
  const dispatch = useDispatch();

  return (state: boolean) => {
    dispatch(updateIsLoading(state));
  };
};
