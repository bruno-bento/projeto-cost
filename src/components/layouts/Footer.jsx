import { FacebookLogo, InstagramLogo, LinkedinLogo } from "phosphor-react"
import styles from './Footer.module.css'

function Footer (){
    return (
        <footer className={styles.footer}>
            <ul className={styles.social_list}>
                <li><FacebookLogo/></li>
                <li><InstagramLogo/></li>
                <li><LinkedinLogo/></li>
            </ul>
            <p className={styles.copy_right}>
                <span>Costs</span> 
                &copy; {new Date().getFullYear() }
            </p>
        </footer>
    )
}
export default Footer