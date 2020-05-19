import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'

class TaskDataService {

    retrieveAllTasks(username) {
        return axios.get(`${COURSE_API_URL}/v1.0/tasks/${username}`);
    }
}

export default new TaskDataService()