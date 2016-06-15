// Set up your root reducer here...
 import { combineReducers } from 'redux';
 import formBuilder from './formBuilderReducer';
 // export default combineReducers;

 const rootReducer = combineReducers({
    formBuilder
 });

 export default rootReducer;