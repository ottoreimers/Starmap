import Image from "next/image";
import APOD from "../components/APOD/APOD.jsx";
import styles from "./page.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <APOD />
    </div>
  );
};

export default Home;
