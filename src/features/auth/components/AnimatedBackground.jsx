import React from "react";
import "@styles/animations.css";
import styles from "./Login.module.css";

const AnimatedBackground = () => {
  return (
    <div className={styles.bubblesContainer}>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={styles.bubble}
          style={{ animationDelay: `${i * 0.7}s` }}
        ></div>
      ))}
    </div>
  );
};

export default AnimatedBackground;
