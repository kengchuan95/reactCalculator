
//this is a basic calculator making use of react.
//inspiration and logical choices made following https://github.com/WebDevSimplified/react-calculator/blob/main/src/App.js
//comments added by me, after building; the goal in this is to show understanding of what is going on, with a separate project to create a proper react.js app
import { useReducer } from 'react';
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import './App.css';
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  CHOOSE_OPERATION: 'choose-operation',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})
//the main compiler. the return is the output of the html
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}
//this receives any button press. the main switch statement bases off of the type that is passed
function reducer(state, {type, payload }) {
  switch(type) {
    case ACTIONS.DELETE_DIGIT:
      //on delete, overwrite the last operand if it is populated, or the last character in our evaluation string if it exists
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state, 
        currentOperand: state.currentOperand.slice(0, -1)
      };
    //on add, append the digit to our evaluation string. if we want to add a decimal, and a decimal already exists, don't add it. 
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes(".")) return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    // simply clear our evaluation string
    case ACTIONS.CLEAR:
      return {};
    //apply an operation to our evaluatable strings.
    case ACTIONS.CHOOSE_OPERATION:
      //if nothing exists yet, do nothing; return the state we started with
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      // if we already applied an operation, which is stored in previousOperand, replace the operation. we can't apply two operations on top of eachother
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      //if there is no previous operand, set the current operand to the previous operand and set the operation, clearing the current operand
      if (state.previousOperand == null) {
        return {
          ...state, operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      // we have a current operand, a previous operand, and an operation. evaluate it and set the overwrite so the next input takes priority
      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation,
      };
    // on evaluation, if we are missing a relevant section of info, do nothing.
    //if we have everything, set the current main display with the evaluation function. 
    //overwrite is set to true, so if you input new information after evaluating, the new information takes priority.
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    // do nothing on default, we should always have a type assigned on dispatch
    default:
      return state;
  }
}
//function which evaluates all of our inputs when we have a full math problem
function evaluate({currentOperand, previousOperand, operation}) {
  //format our information as numerals so we can do math
  var prev = parseFloat(previousOperand); 
  var current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = "";
  //switch statement moves between our available mathematical operations
  switch(operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
      break;
  }
  //format our new output as a string so we can display again
  return computation.toString();
}
//simple function to format our inputs. splitting the integer and decimal, and then re-stitching them is so that a X.0 doesn't get reformatted to X immediately
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}
export default App;
