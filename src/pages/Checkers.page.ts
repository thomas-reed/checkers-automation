import { Locator, Page } from '@playwright/test';
import { Base } from '@pages/Base.page';

export const instructions = {
  start: 'Select an orange piece to move.',
  clickOnBlue:
    'Click on your orange piece, then click where you want to move it.',
  playerTurn: 'Make a move.',
  impatient: 'Please wait.',
  lateralMove: 'Move diagonally only.',
  invalidMove: 'This is an invalid move.',
  doubleJump: 'Complete the double jump or click on your piece to stay still.',
  playerLoses: 'You lose. Game over.',
  playerWins: 'You won the game, congratulations!',
  noMoves: 'You have won!',
};

export const spaceOptions = {
  blue: 'b',
  blueKing: 'bk',
  blueSel: '(b)',
  blueKingSel: '(bk)',
  orange: 'o',
  orangeKing: 'ok',
  orangeSel: '(o)',
  orangeKingSel: '(ok)',
  black: 'x',
  empty: '',
  error: 'err',
} as const;
export type SpaceOption = (typeof spaceOptions)[keyof typeof spaceOptions];

type BoardSpace = {
  contents: SpaceOption;
  locator: Locator;
};

export type Gameboard = BoardSpace[][];

const BOARD_SIZE = 8;

export class Checkers extends Base {
  public rulesLink = this.page.getByRole('link', { name: 'Rules' });
  public resetLink = this.page.getByRole('link', { name: 'Restart...' });
  public gameBoard = this.page.locator('#board');
  public instruction = this.page.locator('#message');
  private selectedPiece = this.page.locator('//img[contains(@src,"2")]');

  private boardSpaceLoc(row: number, col: number): Locator {
    return this.page.locator(`img[name*="space${row}${col}"]`);
  }

  constructor(page: Page) {
    super(page);
  }

  /**
   * Gets the current state of the gameboard and saves it into a Gameboard object
   * @returns {Promise<Gameboard>}
   */
  async getGameboardState(): Promise<Gameboard> {
    const board: Gameboard = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      board[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        let src = await this.boardSpaceLoc(row, col).getAttribute('src');
        if (src === null) {
          throw new Error(`boardSpaceLoc doesn't have src attribute`);
        }
        // adding this because sometimes the src is a fully qualified URL
        if (src.startsWith('http')) {
          src = src.split('/')[src.split('/').length - 1];
        }
        let space: SpaceOption;
        switch (src) {
          case 'me1.gif':
            space = spaceOptions.blue;
            break;
          case 'me1k.gif':
            space = spaceOptions.blueKing;
            break;
          case 'me2.gif':
            space = spaceOptions.blueSel;
            break;
          case 'me2k.gif':
            space = spaceOptions.blueKingSel;
            break;
          case 'you1.gif':
            space = spaceOptions.orange;
            break;
          case 'you1k.gif':
            space = spaceOptions.orangeKing;
            break;
          case 'you2.gif':
            space = spaceOptions.orangeSel;
            break;
          case 'you2k.gif':
            space = spaceOptions.orangeKingSel;
            break;
          case 'gray.gif':
            space = spaceOptions.empty;
            break;
          case 'black.gif':
            space = spaceOptions.black;
            break;
          default:
            space = spaceOptions.error;
        }
        board[row][col] = {
          contents: space,
          locator: this.boardSpaceLoc(row, col),
        } as BoardSpace;
      }
    }
    return board;
  }

  /**
   * Prints the given Gameboard to the console for debugging
   * @param board - Gameboard to print
   */
  printBoardState(board: Gameboard) {
    // looks like this is printing out backwards, but
    // this is only because of the way the game was designed -
    // [7][7] is the top/left, [0][0] is bottom right, and
    // first number being column and second number being row
    console.log('-'.repeat(49));
    for (let row = board.length - 1; row >= 0; row--) {
      let rowData = '|';
      for (let col = board[row].length - 1; col >= 0; col--) {
        const spaceContents = board[col][row].contents;
        rowData += `${' '.repeat(4 - spaceContents.length)}${spaceContents} |`;
      }
      console.log(rowData);
    }
    console.log('-'.repeat(49));
  }

  /**
   * Waits for all the piece selections (orange or blue) to reset to unselected,
   * then confirms that a change in state did occur from the previous gameboard.
   * @param {Gameboard} previousState - last gameboard state prior to completing the move
   */
  async waitForBlueTurn(previousState: Gameboard) {
    // this is necessary because it takes some time for the orange piece
    // to deselect after a move, and for the computer to select a piece,
    // then move it, and wait for that piece to deselect
    while (true) {
      await this.selectedPiece.waitFor({ state: 'detached' });

      try {
        await this.selectedPiece.waitFor({ state: 'attached', timeout: 500 });
      } catch {
        break;
      }
    }

    // verifying a move was made - new gameboard state should be different from previous
    const gameboard = await this.getGameboardState();
    if (JSON.stringify(gameboard) === JSON.stringify(previousState)) {
      console.log('No changes detected..');
    }
  }
}
