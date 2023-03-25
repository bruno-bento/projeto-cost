import styles from './Home.module.css'
import saving from '../../assets/saving.svg'
import LinkButton from '../layouts/LinkButton'
function Home() {
    return (
        <section className={styles.home_container}>
            <h1>Welcome to<span>Costs</span></h1>
            <p>Start managing your projects right now!</p>
            <LinkButton to="/newproject" text="Create Project" />
            <img src={saving} alt="Costs" />
        </section>
    )
}

export default Home