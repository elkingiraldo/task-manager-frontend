import React, { Component } from 'react'
import TaskDataService from '../service/TaskDataService.js';
import AuthenticationService from '../service/AuthenticationService.js';

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
        if (AuthenticationService.tokenIsExpired()) {
            AuthenticationService.logout();
            this.props.history.push(`/login`);
        } else {
            AuthenticationService.setupAxiosInterceptors();
            TaskDataService.retrieveAllTasks(AuthenticationService.getLoggedInUserName())
                .then(
                    response => {
                        this.setState({ tasks: response.data })
                    }
                )
        }
    }

    formatedEstimatedComplentionDate(stringEcd) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const edc = new Date(stringEcd);
        return edc.toLocaleDateString("en-US", options);
    }

    render() {
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
                                this.state.tasks
                                    .sort((a, b) => new Date(b.edc) - new Date(a.edc))
                                    .map(task =>
                                        <tr key={task.id}>
                                            <td>{task.id}</td>
                                            <td>{task.description}</td>
                                            <td>{task.status}</td>
                                            <td>{this.formatedEstimatedComplentionDate(task.edc)}</td>
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