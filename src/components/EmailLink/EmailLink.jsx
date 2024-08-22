// src/components/EmailLink/EmailLink.jsx

import React from "react";
import { FaEnvelope } from "react-icons/fa";
import styles from "./EmailLink.module.css";

function EmailLink({ email }) {
  return (
    <a href={`mailto:${email}`} className={styles.emailLink}>
      <FaEnvelope className={styles.emailIcon} />
      <span className={styles.emailAddress}>{email}</span>
    </a>
  );
}

export default EmailLink;
