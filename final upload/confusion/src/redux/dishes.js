import * as ActionTypes from './ActionTypes'

export const Dishes = (state = {
    isLoading: true,
    errMess: null,
    dishes: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DISHES:
            return {...state, isLoading: false, errMess: null, dishes: action.payload}
            // break
        case ActionTypes.DISHES_LOADING:
            return {...state, isLoading: true, errMess: null, dishes: []}
            // break
        case ActionTypes.DISHES_FAILED:
            return {...state, isLoading: false, errMess: action.payload}
            // break
        default:
            return state
    }
}