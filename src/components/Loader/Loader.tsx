import React from 'react';
import styles from './Loader.module.scss';

export const Loader: React.FC = () => (
    <div className={styles.root}>
        <div className={styles.text}>Loading...</div>
    </div>
);
