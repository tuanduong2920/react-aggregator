import styles from "./styles.module.css";

export const TestComponent = ({ test = "hello" }) => {
  return <div className={styles.hello}>{test}</div>;
};
