import React, { Component } from 'react'
import TaskDataService from '../service/TaskDataService.js';

const INSTRUCTOR = 'in28minutes'

class ListTasksComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tasks: [],
            message: null
        }
        this.refreshtasks = this.refreshtasks.bind(this)
    }

    componentDidMount() {
        this.refreshtasks();
    }

    refreshtasks() {
        TaskDataService.retrieveAllTasks(INSTRUCTOR)//HARDCODED
            .then(
                response => {
                    this.setState({ tasks: response.data })
                }
            )
    }


    render() {
        console.log('render')
        return (
            <div className="container">
                <h3>All Tasks</h3>
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Estimated day of completion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.tasks.map(
                                    task =>
                                        <tr key={task.id}>
                                            <td>{task.id}</td>
                                            <td>{task.description}</td>
                                            <td>{task.status}</td>
                                            <td>{task.edc}</td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ListTasksComponent