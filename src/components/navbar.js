import styles from "../styles/navbar.module.scss";
import ThemeToggle from "./ThemeToggle";
export default function Navbar() {
    return (
        <nav className={styles.navbar}>
      <div className={styles.logoHead}>
        <img src="/logo.png" alt="Logo" />
        <h1>DSA 75</h1> 
      </div>
      <div>
        <ul className={styles.navlink}>
          <li>Home</li>
          <li>About</li>
          <li>Login</li>
        </ul>
      </div>
      <ThemeToggle />
    </nav>
    );
}