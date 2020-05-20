import React, { Component } from 'react'
import TaskDataService from '../service/TaskDataService.js';
import AuthenticationService from '../service/AuthenticationService.js';
import Modal from 'react-bootstrap/Modal';

class ListTasksComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tasks: [],
            message: null,
            showModal: false
        }
        this.refreshtasks = this.refreshtasks.bind(this)
        this.verifySession = this.verifySession.bind(this)
        this.handleModalShow = this.handleModalShow.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.addNewTask = this.addNewTask.bind(this)
    }

    componentDidMount() {
        this.refreshtasks();
    }

    handleModalShow() {
        this.setState({ showModal: true });
    }

    handleModalClose() {
        this.setState({ showModal: false });
    }

    verifySession() {
        if (AuthenticationService.tokenIsExpired()) {
            AuthenticationService.logout();
            this.props.history.push(`/login`);
        }
    }

    addNewTask() {
        this.verifySession();

        AuthenticationService.setupAxiosInterceptors();
        TaskDataService.addNewTask(AuthenticationService.getLoggedInUserName())
            .then(() => {
                this.refreshtasks();
                this.handleModalClose();
            });

    }

    refreshtasks() {
        this.verifySession();

        AuthenticationService.setupAxiosInterceptors();
        TaskDataService.retrieveAllTasks(AuthenticationService.getLoggedInUserName())
            .then(
                response => {
                    this.setState({ tasks: response.data })
                }
            )
    }

    formatedEstimatedComplentionDate(stringEcd) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const edc = new Date(stringEcd);
        return edc.toLocaleDateString("en-US", options);
    }

    render() {
        return (
            <div className="container">

                <div class="title_container">
                    <div class="title_column">
                        <h3> All Tasks</h3>
                    </div>
                    <div>
                        <button class="column" className="btn btn-success" onClick={this.handleModalShow}>Add New Task</button>
                    </div>
                </div>

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

                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <button className="btn" onClick={this.handleModalClose}>Close</button>
                        <button className="btn btn-success" onClick={this.addNewTask}>Add New Task</button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}

export default ListTasksComponent