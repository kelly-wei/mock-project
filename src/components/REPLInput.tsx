import '../styles/main.css';
import { Dispatch, SetStateAction, useState } from 'react';
import { ControlledInput } from './ControlledInput';
import { Component } from 'react';
import { csvDict } from '../data/mocked_json';

interface REPLInputProps {
  table: string[][];
  tableHeading: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
  setBrief: Dispatch<SetStateAction<boolean>>;
  setTable: Dispatch<SetStateAction<string[][]>>;
  setTableHeading: Dispatch<SetStateAction<string[]>>;

}

export function REPLInput(props: REPLInputProps) {
  // manages the history of the user's input 
  const [history, setHistory] = useState<string[]>([])

  // manages the command taken in from the input box
  const [commandString, setCommandString] = useState<string>('');

  // manages the current amount of times the button is clicked
  const [count, setCount] = useState<number>(0);

  // determines whether or not a file was properly loaded for view and search to operate
  const [validFileBoolean, setValidFileBoolean] = useState<boolean>(false);

  // manages the data shared from the csv
  const [contentList, setContentList] = useState<string[][]>([]);

  // manages the mode it's in (default = brief)
  const [isBrief, setBrief] = useState<boolean>(true);

  // manages the mode message printed in the repl
  const [mode, setMode] = useState<string>('brief');
  
  // maintain a list of tables
  const [tables, setTables] = useState<string[][][]>([]);

  // manages the state of whether the commands are shown
  const [showCommands, setShowCommands] = useState<boolean>(false);

  // manages the button for the commands
  const [commandMessage, setCommandMessage] = useState<string>("Show Commands");

  // This function is triggered when the command button is displayed and will update the state  
  function commandRules(){
    setShowCommands(!showCommands);
    if(showCommands){
      setCommandMessage("Show Commands")
    }
    else{
      setCommandMessage("Hide Commands")
    }
  }

  // This function is triggered when the button is clicked to execute the commands.
  function handleSubmit(commandString: string) {

    // initializes the list that is used for searching
    let searchList = [];

    // creates a copy/temp of the table based on commands
    let newTable: string[][] = [[]];

    // increases button clicks
    setCount(count + 1);

    // checks to make sure that a command was entered before hitting the submit button
    if (commandString[0] == null) {
      // adds the error message to the table
      newTable = [['Invalid Input. Please enter a valid command.']];

      // updates the table state
      props.setTable(newTable);

      // set the tables properly 
      setTables([...tables, newTable]);
    }

    if (commandString.includes('mode')) {
      if (commandString.split(' ')[1] == 'verbose') {
        // indicates that we are not in brief mode
        setBrief(false);

        // sets the message
        setMode('verbose');
      }
      
      if (commandString.split(' ')[1] == 'brief') {
        // indicates that we are in brief mode
        setBrief(true);

        // sets the message
        setMode('brief');
      }
    }

    if(!validFileBoolean && (commandString.includes('search') || commandString.includes('view'))){
      // adds the error message to the table
      newTable = [['Invalid Input. Please load the file first.']];

      // updates the table state
      props.setTable(newTable);

      // set the tables properly 
      setTables([...tables, newTable]);      
    }
    else{
      if (commandString.includes('load_file')) {
        // break apart the command to have the input command (load_file as [0]) and the file path as [1]
        let path = commandString.split(' ', 2)[1];
  
        // updates state of the boolean 
        setValidFileBoolean(true);
  
        // tries to pre-load the CSV data for future use
        try {
          // checks to see if the file path is in the mocked dictionary
          if (path in csvDict) {
            // adds a success statement
            newTable = [['File successfully loaded.']];
            // updates the table
            props.setTable(newTable);
            // shows the table on the screen
            setTables([...tables, newTable]);
          } else {
            throw Error;
          }
  
          // initializes a temp copy of the data 
          let newContentList: string[][] = [];
  
          // iterates through the data to add the data into the temp copy list 
          for (let i = 0; i < csvDict[path].length; i++) {
            newContentList.push(csvDict[path][i]);
          }  
          // update the content list 
          setContentList(newContentList);
  
        } catch (error) {
          // if file not found, produce a failure message 
          newTable = [['File unsuccessfully loaded.']];
          props.setTable(newTable);
          setTables([...tables, newTable]);
        }
      }
  
      // handles the command if the user used 'view' and the file was loaded 
      if (commandString.includes('view') && validFileBoolean) {
        newTable = contentList; 
        props.setTable(newTable);
        setTables([...tables, newTable]);
  
      }
  
      // handles the command if the user used 'search' and the file was loaded 
      if (commandString.includes('search') && validFileBoolean) {

        let colIndex;     // initializes the column index
          
        let stringIndex = commandString.split(' ')[1];    // second argument - header to look in 
        let numIndex = parseInt(commandString.split(' ')[1]); // Second argument - header to look in as an integer
        let word = commandString.split(' ')[2]; // Third argument - word to search for 
        searchList = [];      // empty list of the data that we found 

        searchList.push(contentList[0]);    //adds the header to the search list to be printed

        let searchLength = searchList.length;     // length of list originally 
    
        // if the second argument is not a number, use the string index
        if (isNaN(numIndex)) {
          colIndex = contentList[0].indexOf(stringIndex);
        } else {
          colIndex = numIndex;      // search based off numerical index
          colIndex--;     // user will probably enter a header col from 1 - inf. We are using 0-based index
        }
    
        // iterate through the data (content list)
        for (let i = 1; i < contentList.length; i++) {
          // once a match is found, push the entire row into the list of data
          if (contentList[i][colIndex] == word) {
            searchList.push(contentList[i]);
          }
        }
    
        // if the search length is the same as the start, then nothing was found
        if(searchLength == searchList.length){
          // produce error message
          props.setTableHeading([]);
          newTable = [['Value not found.']];
          props.setTable(newTable);
          setTables([...tables, newTable]);
        }
        // if value was found, update the table
        else{
          newTable = searchList;
          props.setTable(newTable);
          setTables([...tables, newTable]);
        }
      }
  
      // make sure 'mode brief' isn't printed when transitioning from verbose to brief
      if(commandString.includes("mode") && !isBrief){
        setHistory([...history, ""])
      }
      // update the history with the command in verbose mode
      else if (!isBrief) {
        setHistory([...history, commandString]);
        setCommandString("");
      }
      // update the history with blank command statements in brief mode 
      else{
        setHistory([...history, ""])
      }
  
      // reset the command string in the box
      setCommandString("");
      // ensure tables are up to date prior to return statement 
      setTables([...tables, newTable]);      
    }
  }

  // display the history within the "repl-history" div
  // display the output with the table
  // display the mode that we're in
  // show the input box and button
  return (
    <div className="repl">
      <div className="row">
        <div className="repl-history">
          <h3>History</h3>
          {history.map((command, index) => (<p key={index}>{command}</p>))} 
        </div>

        <div className="display">
          <h3>Output</h3>
          {tables.map((tableContent, index) => (
            <div className="repl-view-table" key={index}>
              <Table heading={props.tableHeading} body={tableContent} />
            </div>
          ))}
        </div>
      </div>

      <div className="repl-mode">
        <p>
          You are currently in <b>{mode}</b> mode.
        </p>
        <button onClick={() => commandRules()}>{commandMessage}</button>
        {showCommands ? (<div>
          <table className='repl-command-instruction'>
            <tr>
                <th>Command</th>
                <th>Output</th>
            </tr>
            <tr>
              <td className='command'>load_file <u>file</u></td>
              <td>Load a valid file path by replacing <u style={{fontFamily:'monospace'}}>file</u></td>
            </tr>
            <tr>
              <td className='command'>view</td>
              <td>View the data</td>
            </tr>
            <tr>
              <td className='command'>search <u>columnID</u> <u>value</u></td>
              <td>Replace <u style={{fontFamily:'monospace'}}>value</u> and <u style={{fontFamily:'monospace'}}>columnID</u> to search for your desired value in a specific column.</td>
            </tr>
            <tr>
              <td className='command'>mode <u>brief/verbose</u></td>
              <td> Choose your style of mode - brief or verbose. Verbose will show your entire input.</td>
            </tr>

          </table>
        </div>): null}
      </div>

      <div className="repl-input">
        <fieldset>
          <legend>Enter a command:</legend>
          <ControlledInput
            value={commandString}
            setValue={setCommandString}
            ariaLabel={"Command input"}
          />
        </fieldset>

        <button onClick={() => handleSubmit(commandString)}>
          Submitted {count} times
        </button>
      </div>
    </div>
  );
}

interface TableProps {
  heading: string[];
  body: string[][];
}

interface TableRowProps {
  rowContent: string[];
}

export class Table extends Component<TableProps> {
  render() {
    let heading = this.props.heading;
    let body = this.props.body;

    return (
      <table>
        <thead>
          <tr>
            {heading.map((head, headID) => (
              <th key={headID}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((rowContent, rowID) => (
            <TableRow rowContent={rowContent} key={rowID} />
          ))}
        </tbody>
      </table>
    );
  }
}

class TableRow extends Component<TableRowProps> {
  render() {
    let row = this.props.rowContent;
    return (
      <tr>
        {row.map((val, rowID) => (
          <td key={rowID}>{val}</td>
        ))}
      </tr>
    );
  }
}
