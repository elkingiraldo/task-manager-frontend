import React, { Component } from 'react'
import TaskDataService from '../service/TaskDataService.js';
import AuthenticationService from '../service/AuthenticationService.js';
import Modal from 'react-modal';

class ListTasksComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tasks: [],
            showModal: false,
            fields: {
                newTaskDescription: "",
                newTaskEdc: ""
            },
            errors: {}
        }

        this.refreshtasks = this.refreshtasks.bind(this)
        this.verifySession = this.verifySession.bind(this)
        this.handleModalShow = this.handleModalShow.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.addNewTask = this.addNewTask.bind(this)
        this.cleanModal = this.cleanModal.bind(this)
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

    cleanModal() {
        this.setState({
            ...this.state, 
            showModal: false,
            fields: {
                newTaskDescription: "",
                newTaskEdc: ""
            } 
        });
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
            description: this.state.fields.newTaskDescription,
            edc: this.state.fields.newTaskEdc
        }

        AuthenticationService.setupAxiosInterceptors();
        TaskDataService.addNewTask(AuthenticationService.getLoggedInUserName(), newTask)
            .then(() => {
                this.refreshtasks();
                this.cleanModal();
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

    handleChange(field, e){         
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});
    }

    submit(e){
        e.preventDefault();

        if(!this.formValidation()){
            alert("Form has errors.");
        }else{
          this.addNewTask();
        }

    }

    formValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if(!fields["newTaskDescription"]){
           formIsValid = false;
           errors["newTaskDescription"] = "Cannot be empty";
        }

        if(!fields["newTaskEdc"]){
            formIsValid = false;
            errors["newTaskEdc"] = "Cannot be empty";
         }

       this.setState({errors: errors});
       return formIsValid;
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
                        <input type="text" className="form-control" placeholder="Enter description" name="newTaskDescription" value={this.state.fields["newTaskDescription"]} onChange={this.handleChange.bind(this, "newTaskDescription")} />
                        <span className="error_style">{this.state.errors["newTaskDescription"]}</span>    
                    </div>

                    <div className="form-group">
                        <label>Estimated Date Of Completion</label>
                        <input type="text" className="form-control" placeholder="Enter estimated date of completion" name="newTaskEdc" value={this.state.fields["newTaskEdc"]} onChange={this.handleChange.bind(this, "newTaskEdc")} />
                        <span className="error_style">{this.state.errors["newTaskEdc"]}</span>  
                    </div>

                    <div className="inline_container">
                        <div className="move_right">
                            <button className="btn btn-danger button_margin" onClick={this.handleModalClose}>Close</button>
                            <button className="btn btn-success button_margin" onClick={this.submit.bind(this)}>Add New Task</button>
                        </div>
                    </div>

                </Modal>



            </div>
        )
    }
}

export default ListTasksComponent