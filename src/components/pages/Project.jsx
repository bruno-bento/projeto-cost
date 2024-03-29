import styles from './Project.module.css'
import { json, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { parse, v4 as uuidv4} from 'uuid'

import Loading from '../layouts/Loading'
import Container from '../layouts/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layouts/Message'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'


function Project() {
    const { id } = useParams()

    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        setTimeout(() => {
            fetch(`https://json-server-cost.vercel.app/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(resp => resp.json())
                .then((data) => {
                    setProject(data)
                    setServices(data.services)
                })
                .catch(err => console.log(err))
        }, 300)
    }, [id])

    function editPost(project) {
        setMessage('')

        if (project.budget < project.cost) {
            setType('error')
            setMessage('The budget cannot be less than the cost of the project')
            return false
        }
        fetch(`https://json-server-cost.vercel.app/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        })
            .then(resp => resp.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(false)
                setType('success')
                setMessage('Updated project')
            })
            .catch(err => console.log(err))

    }

    function createService(project){
        setMessage('')
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()
        
        const lastServiceCost = lastService.cost 
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
        
        if(newCost > parseFloat(project.budget)){
            setMessage('Budget exceeded, check the value of the service')
            setType('error')
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`https://json-server-cost.vercel.app/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setShowServiceForm(false)
        })
        .catch(err => console.log(err))
    }

    function removeService(id, cost) {
        setMessage('')
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdated      
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)
        
        fetch(`https://json-server-cost.vercel.app/projects/${projectUpdated.id}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectUpdated)
        })
        .then(resp => resp.json())
        .then((data)=> {
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Service removed successfully')
            setType('success')
        })
        .catch(err => console.log(err))

    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    return (
        <>
            {
                project.name ?
                    (
                        <div className={styles.project_details}>
                            <Container customClass="column">
                                {
                                    message && (<Message type={type} msg={message} />)
                                }
                                <div className={styles.details_container}>
                                    <h1>Project: {project.name}</h1>
                                    <button onClick={toggleProjectForm} className={styles.btn}>
                                        {!showProjectForm ? 'Edit project' : 'Close'}
                                    </button>
                                    {
                                        !showProjectForm ? (
                                            <div className={styles.project_info}>
                                                <p><span>Categoria:</span> {project.category.name}</p>
                                                <p><span>Total Budget</span> R${project.budget}</p>
                                                <p><span>Total Used</span> R${project.cost}</p>
                                                <p><span>Remaining Total</span> R${project.budget - project.cost}</p> 
                                            </div>
                                        ) : (
                                            <div className={styles.project_info}>
                                                <ProjectForm handleSubmit={editPost} btnText='Finish editing' projectData={project} />
                                            </div>
                                        )
                                    }
                                </div>
                                <div className={styles.service_form_container}>
                                    <h2>Add a service</h2>
                                    <button onClick={toggleServiceForm} className={styles.btn}>
                                        {!showServiceForm ? 'Add a service' : 'Close'} 
                                    </button>
                                    <div className={styles.project_info}>
                                        { showServiceForm && (<ServiceForm handleSubmit={createService} btnText="Add Service" projectData={project} />) }
                                    </div> 
                                </div>
                                <h2>Services</h2>
                                <Container customClass="start">
                                    {
                                        services.length > 0 && 
                                        services.map((service) => (
                                            <ServiceCard id={service.id}
                                            name={service.name}
                                            cost={service.cost}
                                            description={service.description}
                                            key={service.id}
                                            handleRemove={removeService}
                                            />
                                        ))
                                    }
                                    {
                                        services.length === 0 && <p>No registered services</p>
                                    }
                                </Container>
                            </Container>
                        </div>
                    )
                    :
                    (
                        <Loading />
                    )
            }
        </>
    )
}
export default Project