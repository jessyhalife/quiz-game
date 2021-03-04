import React from "react";
import Game from "../../screens/Game";
import styles from "./styles.module.scss";

const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.container}>
      <Game></Game>
    </div>
  );
};

export default Layout;
