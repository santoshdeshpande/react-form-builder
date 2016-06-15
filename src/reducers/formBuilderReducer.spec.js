import {expect} from 'chai';
import reducer, * as formBuilderActions from './formBuilderReducer';
import {List} from 'immutable';
// import * as formBuilderActions from './formBuilderReducer';


describe("form builder reducer", () => {
    describe("when created", () => {
        it("returns the initial state when undefined is passed", () => {
            const newState = reducer(undefined, {TYPE: 'HELLO_ACTION'});
            expect(newState).to.deep.equal(List([]));
        });

        it("returns same state when unknown action is passed", () => {
            const input = [{name:"test"}];
            const newState = reducer(input, {TYPE: 'HELLO_ACTION'});
            expect(newState).to.deep.equal(input);
        });

        it("adds a textfield when add textfield is called", () => {
            const input = {label:"Meeting With", widget: "textfield", placeholder: "textfield", required: true, helpText:"Whom are you meeting", canDelete: false};
            const action = formBuilderActions.addField(input);
            const newState = reducer(List([]), action);
            const output = newState.get(0);
            expect(newState.size).to.equal(1);
            expect(output['fieldName']).to.not.be.null;
        });

        it("does not generate the fieldName when provided", ()=> {
            const input = {label:"Meeting With", widget: "textfield", placeholder: "textfield", required: true, helpText:"Whom are you meeting", canDelete: false, fieldName:'meeting_with'};
            const action = formBuilderActions.addField(input);
            const newState = reducer(List([]), action);
            const output = newState.get(0);
            expect(newState.size).to.equal(1);
            expect(output['fieldName']).to.equal('meeting_with');
        });

        it("adds more than one items to the widget list", () => {
            const input = {label:"Meeting With", widget: "textfield", placeholder: "textfield", required: true, helpText:"Whom are you meeting", canDelete: false};
            const action = formBuilderActions.addField(input);
            let newState = reducer(List([]), action);
            newState =  reducer(newState, action);
            const output = newState.get(0);
            expect(newState.size).to.equal(2);
            expect(output['fieldName']).to.not.be.null;

        });
    });

    describe("updates properties ", () => {
        let newState;

        beforeEach( () => {
            const input = {label:"Meeting With", widget: "textfield", placeholder: "textfield", required: true, helpText:"Whom are you meeting", canDelete: false};
            const action = formBuilderActions.addField(input);
            newState = reducer(List([]), action);
        });

        it("modifies the label", () => {
            let action = formBuilderActions.updateProperty(newState.get(0).fieldName, "label", "Country");
            let updatedState = reducer(newState, action);
            expect(updatedState.get(0).label).to.equal('Country');
            expect(updatedState.get(0).fieldName).to.equal(newState.get(0).fieldName);
        });

        it("ignores updating the fieldName property", () => {
            let action = formBuilderActions.updateProperty(newState.get(0).fieldName, "fieldName", "should-not-be-updated");
            let updatedState = reducer(newState, action);
            expect(updatedState.get(0).fieldName).to.equal(newState.get(0).fieldName);
        });

        it("does not cause error while updating non existing entry", ()=> {
            let action = formBuilderActions.updateProperty("abcdef", "label", "should-not-be-updated");
            let updatedState = reducer(newState, action);
            expect(updatedState.size).to.equal(1);
        });
    });


    describe("duplicate and delete element", () => {
        let newState;
        let input;

        beforeEach( () => {
            input = {label:"Meeting With", widget: "textfield", placeholder: "textfield", required: true, helpText:"Whom are you meeting", canDelete: false};
            const action = formBuilderActions.addField(input);
            newState = reducer(List([]), action);
        });

        it("duplicates an element ", () => {
            const fieldName = newState.get(0).fieldName;
            let action = formBuilderActions.duplicateField(fieldName);
            const clonedState = reducer(newState, action);
            expect(clonedState.size).to.equal(2);
            expect(clonedState.get(1).fieldName).to.not.equal(fieldName);
        });

        it("should not duplicates a non-existing element ", () => {
            let action = formBuilderActions.duplicateField("efghij");
            const clonedState = reducer(newState, action);
            expect(clonedState.size).to.equal(1);
        });

        it("should delete an element", () => {
            newState = reducer(newState, formBuilderActions.addField(input));
            expect(newState.size).to.equal(2);
            const deleteAction = formBuilderActions.deleteField(newState.get(1).fieldName);
            newState = reducer(newState, deleteAction);
            expect(newState.size).to.equal(1);
        });

        it("should not delete a non-existing element", () => {
            newState = reducer(newState, formBuilderActions.addField(input));
            expect(newState.size).to.equal(2);
            const deleteAction = formBuilderActions.deleteField("abcdef");
            newState = reducer(newState, deleteAction);
            expect(newState.size).to.equal(2);
        });

    });


});
