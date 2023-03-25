import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import Container from '../layouts/Container'
import Message from "../layouts/Message"
import styles from './Projects.module.css'
import LinkButton from '../layouts/LinkButton'
import ProjectCard from "../project/ProjectCard"
import Loading from "../layouts/Loading"

function Projects() {
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')

    const location = useLocation()
    let message = ''
    if (location.state) {
        message = location.state.message
    }

    useEffect(() => {
        setTimeout(
            () => {
                fetch('http://localhost:5000/projects', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(resp => resp.json())
                    .then(data => {
                        console.log(data)
                        setProjects(data)
                        setRemoveLoading(true)
                    })
                    .catch(err => console.log(err))
            }, 300
        )
    }, [])

    function removeProject(id){
        fetch(`http://localhost:5000/projects/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(resp => resp.json())
        .then(() => {
            setProjects(projects.filter((project) => project.id !== id))
            setProjectMessage('Project removed successfully')
        })
        .catch(err => console.log(err))
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>My Projects</h1>
                <LinkButton to="/newproject" text="Create Project" />
            </div>
            {message && (<Message msg={message} type="success" />)}
            {projectMessage  && (<Message msg={projectMessage} type="success" />)}
            <Container customClass="start">
                {
                    projects.length > 0 && (
                        projects.map((project) => (
                            <ProjectCard key={project.id} id={project.id} budget={project.budget} name={project.name} category={project.category.name} handleRemove={removeProject}/>
                        ))
                    )
                }

                {
                    !removeLoading && <Loading />
                }
                {
                    removeLoading && projects.length === 0 && (
                        <p>There are no registered projects</p>
                    )
                }
            </Container>
        </div>
    )
}

export default Projects