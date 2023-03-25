import styles from '../project/ProjectCard.module.css'
import { Trash } from 'phosphor-react'
function ServiceCard ({id, name, cost, description, handleRemove}){
    const remove = (e) => {
        e.preventDefault()
        handleRemove(id, cost)
    }
    return(
        <div className={styles.project_card}>
            <h4>{name}</h4>
            <p><span>Total cost</span> R${cost}</p>
            <p>{description}</p>
            <div className={styles.project_card_actions}>
                <button onClick={remove}>
                    <Trash/>
                    Delete
                </button>
            </div>
        </div>
    )
}

export default ServiceCard