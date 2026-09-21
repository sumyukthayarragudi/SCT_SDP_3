// ================================
// SUDOKU SOLVER
// ================================

// Get elements from the HTML
const sudokuGrid = document.getElementById("sudoku-grid");
const solveButton = document.getElementById("solve-btn");
const clearButton = document.getElementById("clear-btn");
const exampleButton = document.getElementById("example-btn");
const message = document.getElementById("message");


// ================================
// CREATE SUDOKU GRID
// ================================

function createGrid() {

    sudokuGrid.innerHTML = "";

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const cell = document.createElement("input");

            cell.type = "text";
            cell.maxLength = 1;

            cell.classList.add("sudoku-cell");

            cell.dataset.row = row;
            cell.dataset.col = col;

            // Allow only numbers 1-9
            cell.addEventListener("input", function () {

                this.value = this.value.replace(/[^1-9]/g, "");

                // If the user changes this cell,
                // it should no longer be treated as solved.
                this.classList.remove("solved");

                if (this.value !== "") {
                    this.classList.add("given");
                } else {
                    this.classList.remove("given");
                }

                message.textContent = "";
                message.classList.remove("error");
            });

            sudokuGrid.appendChild(cell);
        }
    }
}


// ================================
// GET CURRENT GRID
// ================================

function getGrid() {

    const cells = document.querySelectorAll(".sudoku-cell");

    const grid = [];

    for (let row = 0; row < 9; row++) {

        grid[row] = [];

        for (let col = 0; col < 9; col++) {

            const index = row * 9 + col;

            const value = cells[index].value;

            grid[row][col] = value === "" ? 0 : Number(value);
        }
    }

    return grid;
}


// ================================
// FIND EMPTY CELL
// ================================

function findEmptyCell(grid) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (grid[row][col] === 0) {
                return [row, col];
            }
        }
    }

    return null;
}


// ================================
// CHECK IF NUMBER IS VALID
// ================================

function isValid(grid, row, col, number) {

    // Check row
    for (let c = 0; c < 9; c++) {

        if (grid[row][c] === number) {
            return false;
        }
    }


    // Check column
    for (let r = 0; r < 9; r++) {

        if (grid[r][col] === number) {
            return false;
        }
    }


    // Find 3 × 3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;


    // Check 3 × 3 box
    for (let r = startRow; r < startRow + 3; r++) {

        for (let c = startCol; c < startCol + 3; c++) {

            if (grid[r][c] === number) {
                return false;
            }
        }
    }


    return true;
}


// ================================
// BACKTRACKING SOLVER
// ================================

function solveSudoku(grid) {

    const emptyCell = findEmptyCell(grid);

    // No empty cells = solved
    if (emptyCell === null) {
        return true;
    }

    const [row, col] = emptyCell;


    // Try numbers 1 to 9
    for (let number = 1; number <= 9; number++) {

        if (isValid(grid, row, col, number)) {

            grid[row][col] = number;


            // Recursively continue solving
            if (solveSudoku(grid)) {
                return true;
            }


            // Backtrack
            grid[row][col] = 0;
        }
    }


    return false;
}


// ================================
// CHECK INITIAL PUZZLE
// ================================

function isInitialGridValid(grid) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const number = grid[row][col];

            if (number !== 0) {

                // Temporarily remove number
                grid[row][col] = 0;

                if (!isValid(grid, row, col, number)) {

                    grid[row][col] = number;

                    return false;
                }

                grid[row][col] = number;
            }
        }
    }

    return true;
}


// ================================
// DISPLAY SOLUTION
// ================================

function displaySolution(grid, originalGrid) {

    const cells = document.querySelectorAll(".sudoku-cell");

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const index = row * 9 + col;
            const cell = cells[index];

            cell.value = grid[row][col];


            // Original numbers remain highlighted
            if (originalGrid[row][col] !== 0) {

                cell.classList.add("given");
                cell.classList.remove("solved");

            } else {

                // Numbers generated by solver
                cell.classList.add("solved");
                cell.classList.remove("given");
            }
        }
    }
}


// ================================
// SOLVE BUTTON
// ================================

solveButton.addEventListener("click", function () {

    const grid = getGrid();

    // Make a copy before solving
    const originalGrid = grid.map(row => [...row]);


    // Check whether puzzle has any numbers
    const hasNumber = grid.some(row =>
        row.some(value => value !== 0)
    );


    if (!hasNumber) {

        message.textContent =
            "Please enter a Sudoku puzzle first.";

        message.classList.add("error");

        return;
    }


    // Check whether starting puzzle is valid
    if (!isInitialGridValid(grid)) {

        message.textContent =
            "Invalid Sudoku. Please check the entered numbers.";

        message.classList.add("error");

        return;
    }


    // Try to solve
    const solved = solveSudoku(grid);


    if (solved) {

        displaySolution(grid, originalGrid);

        message.textContent =
            "Sudoku solved successfully!";

        message.classList.remove("error");

    } else {

        message.textContent =
            "This Sudoku puzzle has no solution.";

        message.classList.add("error");
    }
});


// ================================
// CLEAR BUTTON
// ================================

clearButton.addEventListener("click", function () {

    const cells = document.querySelectorAll(".sudoku-cell");

    cells.forEach(cell => {

        cell.value = "";

        cell.classList.remove("given");
        cell.classList.remove("solved");
    });


    message.textContent = "";

    message.classList.remove("error");
});


// ================================
// LOAD EXAMPLE
// ================================

exampleButton.addEventListener("click", function () {

    const examplePuzzle = [

        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],

        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],

        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]

    ];


    const cells = document.querySelectorAll(".sudoku-cell");


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const index = row * 9 + col;

            const cell = cells[index];

            const value = examplePuzzle[row][col];


            if (value !== 0) {

                cell.value = value;

                cell.classList.add("given");

            } else {

                cell.value = "";

                cell.classList.remove("given");
                cell.classList.remove("solved");
            }
        }
    }


    message.textContent = "";

    message.classList.remove("error");
});


// ================================
// START WEBSITE
// ================================

createGrid();