import { useState } from 'react';
import '../styles/main.css';
import { REPLInput } from './REPLInput';

/**
 * 
 * @returns a state in which the data is displayed
 */

export default function REPL() {
  // tracks the history
  const [history, setHistory] = useState<string[]>([])

  // tracks the state of the brief mode 
  const [isBrief, setBrief] = useState<boolean>(true)

  // manages the table that will be shown
  const [table, setTable] = useState<string[][]>([])

  // manages the table heading
  const [tableHeading, setTableHeading] = useState<string[]>([])

  return (
    <div className="repl">
        <REPLInput
          table={table}
          tableHeading={tableHeading}
          setHistory={setHistory}
          setBrief={setBrief}
          setTable={setTable}
          setTableHeading={setTableHeading}
          ></REPLInput>
        </div>
  );
  
}



