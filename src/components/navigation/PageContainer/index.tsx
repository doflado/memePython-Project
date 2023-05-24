import clsx from 'clsx';
import React, { FC, ReactNode } from 'react';

import styles from './index.module.scss';

interface IPageContainer {
  children: ReactNode;
  title?: string | ReactNode;
  variant?: string;
  heading?: ReactNode;
  noHeading?: boolean;
}

const PageContainer: FC<IPageContainer> = ({
  title,
  heading,
  children,
  variant = '',
  noHeading = false,
}) => {
  const containerClasses = clsx(styles.container, { [variant]: noHeading });
  const bodyClasses = clsx(styles.body, { [variant]: !noHeading });

  return (
    <div className={containerClasses}>
      {noHeading ? (
        children
      ) : (
        <>
          <section className={styles.heading}>
            {heading ?? <div className={styles.title}>{title}</div>}
          </section>
          <section className={bodyClasses}>{children}</section>
        </>
      )}
    </div>
  );
};

export default PageContainer;
