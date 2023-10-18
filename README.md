# Mock

## Project Details
Project Name: Mock
Project Description: This sprint is designed to support a stakeholder interested in exploring data from an existing CSV file. 
Team member(s):
1. Lisa Liong (lliong) - 12 hours contributed
2. Kelly Wei (kwei8) - 12 hours contributed

https://github.com/cs0320-f23/mock-kwei8-lliong.git


## Design Choices
We've organized this project in the following way: 
1. data - hosts the mocked json data we've created
2. components
    1. App - the high-level class that contains information about our react site. 
    2. ControlledInput - this class takes in input coming from the command box
    3. REPL - another high level class that contains the body of the site
    4. REPLInput - the class that handles commands provided and processed by the ControlledInput class. This class also produces the majority of the div elements. 

Within the site, the user is able to view the valid commands by clicking the Show/Hide Command Button. REPLInput will take in the following commands: load_file <csvfile>, view, search <columnID> <value>, and mode <brief or verbose>. After entering a valid command, the user will see a printout of their input in the history column (if in verbose mode). We decided to store this in a list of strings. Regardless of the mode, the output will print out on the right side of the screen and is stored in a list of list of strings. Each list of list of strings is then rendered into a table that is displayed. 

## Running the program and Tests
To run the program, type "npm start" in the terminal. To load a mock CSV file, the command is
"load_file [file name]". To view the contents of the file, the command is "view". To search
the contents of the csv file, the command is "search [column index] [value]". The column index
can either be the index of the column or the name of the column. Mock starts off in brief mode,
which means that command history is not displayed. To switch to verbose mode, the command is
"mode verbose". Commands made after this command will be displayed in Mock. To switch to brief
mode, the command is "mode brief". We have three mock CSV files: blueRoomCSV, fruitsCSV, and
campusBuildingsCSV.

To run our tests, type "npx playwright test" into the terminal. Please see our test package to read more about what we tested for. Our testing suite 
tested the state functionalities from the REPL.O The testing suite focused on interactions between commands and its affect on other commands. For example, loading a file and reloading a new file. 

## Bugs
We have not identified any bugs at this time. 