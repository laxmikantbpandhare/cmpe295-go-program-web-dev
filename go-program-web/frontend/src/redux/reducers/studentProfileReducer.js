import { STUDENT_PROFILE_GET_SUCCESS, STUDENT_PROFILE_GET_FAILED, STUDENT_PROFILE_SELECT_CHANGE,
    STUDENT_PROFILE_EDIT_CANCEL, STUDENT_PROFILE_UPDATE_SUCCESS,
    STUDENT_PROFILE_UPDATE_FAILED}  from '../actions/types';

const initialState = {
    student: {
        user: {

        }
    },
    getResponseMessage: "",
    getResponseStatus: "success",
    updateResponseMessage: "",
    updateResponseStatus: "success",
};

const studentProfileReducer = (state = initialState, action) => {
    switch(action.type){
        case STUDENT_PROFILE_GET_SUCCESS:
            return {
                ...state,
                student: action.payload.student,
                getResponseMessage: "",
                getResponseStatus: "success"
            }
        case STUDENT_PROFILE_GET_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message,
                getResponseStatus: "failed"
            }
        case STUDENT_PROFILE_SELECT_CHANGE:
            return {
                ...state,
                student: {
                    ...state.student,
                    [action.payload.name]: action.payload.value
                }
            }
        case STUDENT_PROFILE_EDIT_CANCEL:
            return {
                ...state,
                student: action.payload.student
            }
        case STUDENT_PROFILE_UPDATE_SUCCESS:
            return {
                ...state,
                student: action.payload.student,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "success"
            }
        case STUDENT_PROFILE_UPDATE_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "failed",
            }
        default:
            return state;
    }
}

export default studentProfileReducer;