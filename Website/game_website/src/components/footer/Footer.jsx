import React from 'react'
import styles from './footer.module.css'
import { FaReact, FaFacebook, FaLinkedin, FaDiscord, FaTwitterSquare, FaInstagram} from "react-icons/fa";
import Link from 'next/link';

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href={"https://react.dev/"} className={styles.react}>  
          <div className={styles.text}>Website created using React</div>
          <FaReact className={styles.icon}/>
        </Link>
        <div className={styles.icons}>
          <p className={styles.text}>Contact us</p>
          <Link href={"https://www.facebook.com"} className={styles.link}>
            <FaFacebook className={styles.icon}/>
          </Link>
          <Link href={"https://www.linkedin.com"} className={styles.link}>
            <FaLinkedin className={styles.icon}/>
          </Link>
          <Link href={"https://discord.com"} className={styles.link}>
            <FaDiscord className={styles.icon}/>
          </Link>
          <Link href={"https://twitter.com"} className={styles.link}>
            <FaTwitterSquare className={styles.icon}/>
          </Link>
          <Link href={"https://instagram.com"} className={styles.link}>
            <FaInstagram className={styles.icon}/>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer