import { REQUESTS_GET_ALL_STUDENTS_SUCCESS, REQUESTS_GET_ALL_STUDENTS_FAILED,
    REQUESTS_UPDATE_STUDENT_STATUS_SUCCESS, REQUESTS_UPDATE_STUDENT_STATUS_FAILED, 
    REQUESTS_STUDENT_EDIT_CANCEL}  from '../actions/types';

const initialState = {
    students: [],
    getResponseMessage: "",
    getResponseStatus: "success",
    updateResponseMessage: "",
    updateResponseStatus: "success",
    updatedStudent: "",
};

const usersRequestsReducer = (state = initialState, action) => {
    switch(action.type){
        case REQUESTS_GET_ALL_STUDENTS_SUCCESS:
            return {
                ...state,
                students: initialState.students.concat(action.payload.students),
                getResponseMessage: "",
                getResponseStatus: "success"
            }
        case REQUESTS_GET_ALL_STUDENTS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message,
                getResponseStatus: "failed"
            }
        case REQUESTS_STUDENT_EDIT_CANCEL:
            var students = state.students.map(student => {
                if(student._id === action.payload.student._id){
                    return action.payload.student;
                }
                // Leave every other admin unchanged
                return student;
            });
            return {
                ...state,
                students
            }
        case REQUESTS_UPDATE_STUDENT_STATUS_SUCCESS:
            var students = state.students.map(student => {
                if(student.sjsuId === action.payload.user.id){
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
                updateResponseStatus: "success",
                updatedStudent: action.payload.user.id
            }
        case REQUESTS_UPDATE_STUDENT_STATUS_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "failed",
                updatedStudent: action.payload.id
            }
        default:
            return state;
    }
}

export default usersRequestsReducer;