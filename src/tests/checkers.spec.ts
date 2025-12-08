import { expect } from '@playwright/test';
import test from '@fixtures/BaseTest';
import { instructions } from '@pages/Checkers.page';

test.describe('Test Suite for Checkers game', () => {
  test('Initial game board state', async ({ checkers }) => {
    await expect(checkers.gameBoard).toHaveScreenshot('initial_gameboard.png', {
      maxDiffPixelRatio: 0.01,
    });
    await expect(checkers.instruction).toHaveText(instructions['start']);
    expect(await checkers.rulesLink).toHaveAttribute(
      'href',
      'https://en.wikipedia.org/wiki/English_draughts#Starting_position',
    );

    try {
      const board = await checkers.getGameboardState();
      console.log(board);
    } catch (err) {
      console.log('Error getting Gameboard state: ', err);
    }
  });
});
