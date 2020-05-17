import axios from 'axios'

const INSTRUCTOR = 'in28minutes'
const PASSWORD = 'dummy'
const COURSE_API_URL = 'http://localhost:8080'
const INSTRUCTOR_API_URL = `${COURSE_API_URL}/instructors/${INSTRUCTOR}`

class TaskDataService {

    retrieveAllTasks(name) {
        console.log('executed service elkin')
        return axios.get(`${COURSE_API_URL}/v1.0/tasks`,
            //{ headers: { authorization: 'Basic ' + window.btoa(INSTRUCTOR + ":" + PASSWORD) } }
        );
    }
}

export default new TaskDataService()