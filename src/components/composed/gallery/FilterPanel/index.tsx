import React, { FC, useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';

import styles from './index.module.scss';

import Select from '@/components/based/Select';
import useFetchAPI from '@/hooks/useFetchAPI';
import { APP_API_URL, TEMPLATE_COLLECTION } from '@/global/constants';

interface FIlterPanelProps {
  onChangeFilter: (filterValue: { [key: string]: string }) => void;
}

const FilterPanel: FC<FIlterPanelProps> = ({ onChangeFilter }) => {
  const fetchAPI = useFetchAPI();

  const [selectedValues, setSelectedValues] = useState({
    Tab: '',
    Tags: '',
    Collection: '',
  } as { [key: string]: string });
  const [taglist, setTagList] = useState<{ value: string; data: string }[]>([]);

  async function onTags() {
    await fetchAPI(`${APP_API_URL}/list_tags`, 'POST')
      .then((res) => {
        const tmp: { value: string; data: string }[] = [];
        for (let i = 0; i < res.data.length; i++) {
          const tag = res.data[i].tag;
          tmp.push({ value: tag, data: tag });
        }
        if (taglist.length != tmp.length) setTagList([...tmp]);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    onTags();
  }, []);

  const onTag = () => {
    onTags();
  };

  const onOther = () => {
    console.log('');
  };

  return (
    <div className={styles.inner}>
      {Object.keys(TEMPLATE_COLLECTION).map((type: string) => {
        return (
          <div className={styles.filter} key={type}>
            <InputLabel className={styles.selectLabel} id={`select-${type}`}>
              {type}
            </InputLabel>
            <Select
              className={styles.select}
              labelId={`select-${type}`}
              value={selectedValues[type]}
              options={type == 'Tags' ? taglist : TEMPLATE_COLLECTION[type]}
              onOpen={type == 'Tags' ? onTag : onOther}
              onChange={(ev) => {
                setSelectedValues({
                  ...selectedValues,
                  [type]: ev.target.value as string,
                });
                onChangeFilter({
                  ...selectedValues,
                  [type]: ev.target.value as string,
                });
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FilterPanel;
