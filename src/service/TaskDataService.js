import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'

class TaskDataService {

    retrieveAllTasks(username) {
        return axios.get(`${COURSE_API_URL}/v1.0/tasks/${username}`);
    }

    addNewTask(username, newTask) {
        return axios.post(`${COURSE_API_URL}/v1.0/tasks/${username}`, newTask);
    }

}

export default new TaskDataService()