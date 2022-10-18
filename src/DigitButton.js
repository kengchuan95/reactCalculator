import { ACTIONS } from "./App"

export default function DigitButton({ dispatch, digit}) {
        //this button is for digits and periods, formatting our button with the relevant information and onClick call
    return (
    <button 
        onClick={() =>dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit}})}
    >
        {digit}
    </button>
    )
}