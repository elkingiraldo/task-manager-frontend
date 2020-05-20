import React, { Component } from 'react'
import TaskDataService from '../service/TaskDataService.js';
import AuthenticationService from '../service/AuthenticationService.js';
import Modal from 'react-modal';

class ListTasksComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tasks: [],
            message: null,
            showModal: false,
            newTaskDescription: "",
            newTaskEdc: "2021-05-16T05:25:34.000Z"
        }

        this.refreshtasks = this.refreshtasks.bind(this)
        this.verifySession = this.verifySession.bind(this)
        this.handleModalShow = this.handleModalShow.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.addNewTask = this.addNewTask.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        this.refreshtasks();
    }

    handleModalShow() {
        this.setState({ ...this.state, showModal: true });
    }

    handleModalClose() {
        this.setState({ ...this.state, showModal: false });
    }

    verifySession() {
        if (AuthenticationService.tokenIsExpired()) {
            AuthenticationService.logout();
            this.props.history.push(`/login`);
        }
    }

    addNewTask() {
        this.verifySession();

        const newTask = {
            description: this.state.newTaskDescription,
            edc: this.state.newTaskEdc
        }

        AuthenticationService.setupAxiosInterceptors();
        TaskDataService.addNewTask(AuthenticationService.getLoggedInUserName(), newTask)
            .then(() => {
                this.refreshtasks();
                this.handleModalClose();
            })
            .catch(error => {
                console.log("Elkiiiinnnn: " + error);
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

    handleChange(event) {
        this.setState(
            {
                [event.target.name]
                    : event.target.value
            }
        )
    }

    render() {
        return (
            <div className="container">

                <div className="inline_container">
                    <div className="title_column">
                        <h3> All Tasks</h3>
                    </div>
                    <div>
                        <button className="btn btn-success column" onClick={this.handleModalShow}>Add New Task</button>
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

                <Modal className="modal_style" isOpen={this.state.showModal}
                    onRequestClose={this.handleModalClose}
                    ariaHideApp={false}>

                    <div className="inline_container">
                        <div className="title_column">
                            <h2>New Task</h2>
                        </div>
                        <div>
                            <button className="close button_margin" onClick={this.handleModalClose}>X</button>
                        </div>
                    </div>

                    <div className="body_modal">Please add description and date of completion of the new task</div>

                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" className="form-control" placeholder="Enter description" name="newTaskDescription" value={this.state.newTaskDescription} onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Estimated Date Of Completion</label>
                        <input type="text" className="form-control" placeholder="Enter estimated date of completion" name="newTaskEdc" value={this.state.newTaskEdc} onChange={this.handleChange} />
                    </div>

                    <div className="inline_container">
                        <div className="move_right">
                            <button className="btn button_padding" onClick={this.handleModalClose}>Close</button>
                            <button className="btn btn-success button_margin" onClick={this.addNewTask}>Add New Task</button>
                        </div>
                    </div>

                </Modal>



            </div>
        )
    }
}

export default ListTasksComponent