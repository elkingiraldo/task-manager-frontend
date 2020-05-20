import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'

class TaskDataService {

    retrieveAllTasks(username) {
        return axios.get(`${COURSE_API_URL}/v1.0/tasks/${username}`);
    }

    addNewTask(username) {
        return axios.post(`${COURSE_API_URL}/v1.0/tasks/${username}`,{
            description: 'Nueva tarea 2',
	        edc: '2020-07-16T05:25:34.121Z'
        });
    }

}

export default new TaskDataService()