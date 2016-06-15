const ADD_FIELD = 'bsky/formBuilder/ADD_FIELD';
const DUPLICATE_FIELD = 'bsky/formBuilder/DUPLICATE_FIELD';
const DELETE_FIELD = 'bsky/formBuilder/DELETE_FIELD';
const UPDATE_PROPERTY = 'bsky/formBuilder/UPDATE_PROPERTY';

import {List, Record} from 'immutable';

const generateRandom = () => {
    return `meeting_${Math.random().toString(36).substring(2,10)}`;
};

const findIndex = (list, fieldName) => {
    const index = list.findIndex( (field)=> {
        return field.fieldName === fieldName;
    });
    return index;
};

const FieldDefinition = new Record({
    widget: '',
    label: '',
    placeHolder: '',
    required: true,
    helpText: '',
    canDelete: true,
    canCopy: true,
    rules: List([]),
    hidden: false,
    disabled: false,
    fieldName: generateRandom()
});

const initialState = List([]);

const fieldDefinition = (state = {}, action) => {
    switch(action.TYPE) {
        case ADD_FIELD:
            return new FieldDefinition(action.options);
        case UPDATE_PROPERTY:
            return state.set(action.property, action.newValue);
        default:
            return state;
    }
};

const fieldDefinitions = (state = initialState, action) => {
    switch(action.TYPE) {
        case ADD_FIELD:
            return state.push(fieldDefinition(undefined, action));
        case UPDATE_PROPERTY: {
            if(action.property === 'fieldName')
                return state;

            const index = findIndex(state, action.fieldName);
            if(index === -1)
                return state;
            return state.update(index, (item) => {
                return fieldDefinition(item, action);
            });
        }
        case DUPLICATE_FIELD: {
            const index = findIndex(state, action.fieldName);
            if(index === -1)
                return state;
            let newObject = new FieldDefinition(state.get(index));
            newObject = newObject.delete("widget");
            newObject = newObject.merge({fieldName: generateRandom()});
            return state.push(newObject);
        }
        case DELETE_FIELD: {
            const index = findIndex(state, action.fieldName);
            if(index == -1)
                return state;
            return state.remove(index);
        }
        default:
            return state;
    }
};

export const addField = (options) => ({
    TYPE: ADD_FIELD,
    options
});

export const duplicateField = (fieldName) => ({
    TYPE: DUPLICATE_FIELD,
    fieldName
});

export const deleteField = (fieldName) => ({
    TYPE: DELETE_FIELD,
    fieldName
});

export const updateProperty = (fieldName, property, newValue) => ({
    TYPE: UPDATE_PROPERTY,
    fieldName,
    property,
    newValue
});

export default fieldDefinitions;