import { PaintAppProvider } from 'paint-app/react';

import { PaintToolSelector } from 'components/PaintToolSelector';
import { PaintAppContainer } from 'components/PaintAppContainer';

import styles from './Home.module.css';

export const Home = () => {
  return (
    <PaintAppProvider>
      <div className={styles.container}>
        <PaintToolSelector />
        <PaintAppContainer />
      </div>
    </PaintAppProvider>
  );
};
