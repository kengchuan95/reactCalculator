import { ACTIONS } from "./App"

export default function DigitButton({ dispatch, operation}) {
    //this button is for different operations, formatting our button with the relevant information and onClick call
    return (
    <button 
        onClick={() =>dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation}})}>
        {operation}
    </button>
    )
}