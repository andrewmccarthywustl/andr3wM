// src/components/EmailLink/EmailLink.jsx

import React from "react";
import { FaEnvelope } from "react-icons/fa";
import styles from "./EmailLink.module.css";

function EmailLink({ email }) {
  return (
    <a href={`mailto:${email}`} className={styles.emailLink}>
      <div className={styles.emailContent}>
        <FaEnvelope className={styles.emailIcon} />
        <span className={styles.emailAddress}>{email}</span>
      </div>
    </a>
  );
}

export default EmailLink;
