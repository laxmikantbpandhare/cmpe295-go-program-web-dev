import { REQUESTS_GET_ALL_STUDENTS_SUCCESS, REQUESTS_GET_ALL_STUDENTS_FAILED,
    REQUESTS_STUDENT_SELECT_CHANGE, REQUESTS_UPDATE_STUDENT_STATUS_SUCCESS, 
    REQUESTS_UPDATE_STUDENT_STATUS_FAILED}  from '../actions/types';

const initialState = {
    students: [],
    getResponseMessage: "",
    updateResponseMessage: "",
    updatedStudent: "",
};

const usersRequestsReducer = (state = initialState, action) => {
    switch(action.type){
        case REQUESTS_GET_ALL_STUDENTS_SUCCESS:
            return {
                ...state,
                students: initialState.students.concat(action.payload.students),
                getResponseMessage: ""
            }
        case REQUESTS_GET_ALL_STUDENTS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message
            }
        case REQUESTS_STUDENT_SELECT_CHANGE:
            var students = state.students.map(student => {
                // Find a student with the matching id
                if(student._id == action.payload.id){
                    //Return a new object
                    return{
                        ...student, //copy the existing student
                        user: {
                            ...student.user,
                            status: action.payload.value
                        }
                    }
                }
                // Leave every other item unchanged
                return student;
            });
            return {
                ...state,
                students
            }
        case REQUESTS_UPDATE_STUDENT_STATUS_SUCCESS:
            var students = state.students.map(student => {
                if(student.sjsuId == action.payload.user.id){
                    return {
                        ...student,
                        user: action.payload.user
                    }
                }
                // Leave every other item unchanged
                return student;
            });
            return {
                ...state,
                students,
                updateResponseMessage: action.payload.message,
                updatedStudent: action.payload.user.id
            }
        case REQUESTS_UPDATE_STUDENT_STATUS_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message,
                updatedStudent: action.payload.id
            }
        default:
            return state;
    }
}

export default usersRequestsReducer;