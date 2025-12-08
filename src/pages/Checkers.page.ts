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

export type spaceOption = 'b' | 'o' | 'x' | '' | 'oh' | 'bk' | 'ok' | 'okh';

export class Checkers extends Base {
  public rulesLink = this.page.getByRole('link', { name: 'Rules' });
  public resetLink = this.page.getByRole('link', { name: 'Restart...' });
  public gameBoard = this.page.locator('#board');
  public instruction = this.page.locator('#message');

  private boardSpace(row: number, col: number): Locator {
    return this.page.locator(`img[name*="space${row}${col}"]`);
  }

  constructor(page: Page) {
    super(page);
  }

  async getGameboardState(): Promise<[string, Locator][][]> {
    const gameBoard: [string, Locator][][] = [];
    for (let row = 0; row < 8; row++) {
      gameBoard[row] = [];
      for (let col = 0; col < 8; col++) {
        const src = await this.boardSpace(row, col).getAttribute('src');
        if (src == null) {
          throw new Error(`boardSpace not found with src attribute`);
        }
        let space: spaceOption;
        switch (src) {
          case 'me1.gif':
            space = 'b';
            break;
          case 'me1k.gif':
            space = 'bk';
            break;
          case 'you1.gif':
            space = 'o';
            break;
          case 'you1k.gif':
            space = 'ok';
            break;
          case 'you2.gif':
            space = 'oh';
            break;
          case 'you2k.gif':
            space = 'okh';
            break;
          case 'gray.gif':
            space = '';
            break;
          default:
            space = 'x';
        }
        gameBoard[row][col] = [space, this.boardSpace(row, col)];
      }
    }
    return gameBoard;
  }
}
