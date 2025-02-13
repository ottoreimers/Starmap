import Image from "next/image";
import APOD from "../components/APOD/APOD.jsx";
import StarField from "@/components/StarField/StarField.jsx";
import styles from "./page.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <StarField />
    </div>
  );
};

export default Home;
