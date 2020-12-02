import { REQUESTS_GET_ALL_STUDENTS_SUCCESS, REQUESTS_GET_ALL_STUDENTS_FAILED,
    REQUESTS_UPDATE_STUDENT_STATUS_SUCCESS, REQUESTS_UPDATE_STUDENT_STATUS_FAILED, 
    REQUESTS_STUDENT_EDIT_CANCEL, REQUESTS_UPDATE_STUDENT_POINTS_SUCCESS,
    REQUESTS_UPDATE_STUDENT_POINTS_FAILED, RESET_REQUESTS_STUDENT_POINTS_UPDATE_RESPONSE}  from '../actions/types';

const initialState = {
    students: [],
    getResponseMessage: "",
    getResponseStatus: "success",
    statusUpdateResponseMessage: "",
    statusUpdateResponseStatus: "success",
    pointsUpdateResponseMessage: "",
    pointsUpdateResponseStatus: "success",
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
                statusUpdateResponseMessage: action.payload.message,
                statusUpdateResponseStatus: "success",
                updatedStudent: action.payload.user.id
            }
        case REQUESTS_UPDATE_STUDENT_STATUS_FAILED:
            return {
                ...state,
                statusUpdateResponseMessage: action.payload.message,
                statusUpdateResponseStatus: "failed",
                updatedStudent: action.payload.id
            }
        case REQUESTS_UPDATE_STUDENT_POINTS_SUCCESS:
            var students = state.students.map(student => {
                if(student.sjsuId === action.payload.student.sjsuId){
                    return action.payload.student
                }
                // Leave every other item unchanged
                return student;
            });
            return {
                ...state,
                students,
                pointsUpdateResponseMessage: action.payload.message,
                pointsUpdateResponseStatus: "success"
            }
        case REQUESTS_UPDATE_STUDENT_POINTS_FAILED:
            return {
                ...state,
                pointsUpdateResponseMessage: action.payload.message,
                pointsUpdateResponseStatus: "failed",
            }
        case RESET_REQUESTS_STUDENT_POINTS_UPDATE_RESPONSE:
            return {
                ...state,
                pointsUpdateResponseMessage: "",
                pointsUpdateResponseStatus: "success"
            }
        default:
            return state;
    }
}

export default usersRequestsReducer;