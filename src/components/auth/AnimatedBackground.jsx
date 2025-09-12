import React from 'react';
import styles from './Login.module.css';

const AnimatedBackground = () => {
  return (
    <div className={styles.animatedBackground}>
      <div className={styles.camera}>
        <img 
          src="/camara.png" 
          alt="Cámara profesional" 
          className={styles.cameraImg}
        />
      </div>
      
      <div className={styles.support}>
        <img 
          src="/soporte.png" 
          alt="Soporte de cámara" 
          className={styles.supportImg}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;