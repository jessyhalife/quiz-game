import React from "react";
import styles from "./styles.module.scss";

interface Props {
  onClick(): void;
  text: string;
  verified: boolean | undefined;
  valid: boolean;
}

const Answer: React.FC<Props> = ({ onClick, text, verified, valid }) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.answer} ${
        verified !== undefined ? (valid ? styles.right : styles.wrong) : ""
      }`}
      dangerouslySetInnerHTML={{ __html: text }}
    ></div>
  );
};

export default Answer;
