import Image from "next/image";
import APOD from "../components/APOD/APOD.jsx";
import PlanetField from "@/components/PlanetField/PlanetField.jsx";
import styles from "./page.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <PlanetField />
    </div>
  );
};

export default Home;
