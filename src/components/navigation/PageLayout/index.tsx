import React, { FC, ReactNode } from 'react';

import styles from './index.module.scss';

import Sidebar from '@/components/navigation/Sidebar';

interface IPageLayout {
  children: ReactNode;
}

const PageLayout: FC<IPageLayout> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.inner}>{children}</div>
    </div>
  );
};

export default PageLayout;
