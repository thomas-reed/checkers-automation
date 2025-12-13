import { expect } from '@playwright/test';
import test from '@fixtures/BaseTest';
import { instructions, spaceOptions } from '@pages/Checkers.page';

// test.use({ headless: false });
test.describe('Test Suite for Checkers game', () => {
  test('Scenario 1: Initial game board state', async ({ checkers }) => {
    await expect(checkers.gameBoard).toHaveScreenshot('initial_gameboard.png', {
      maxDiffPixelRatio: 0.05,
    });
    await expect(checkers.instruction).toHaveText(instructions['start']);
    expect(await checkers.rulesLink).toHaveAttribute(
      'href',
      'https://en.wikipedia.org/wiki/English_draughts#Starting_position',
    );
  });

  test('Scenario 2: Select pieces', async ({ checkers }) => {
    // get initial gameboard state
    let gameboard = await checkers.getGameboardState();

    // click on orange man, check for highlight
    await gameboard[6][2].locator.click();
    gameboard = await checkers.getGameboardState();
    expect(gameboard[6][2].contents).toEqual(spaceOptions.orangeSel);

    // click on other orange man, check highlight moved
    await gameboard[4][2].locator.click();
    gameboard = await checkers.getGameboardState();
    expect(gameboard[4][2].contents).toEqual(spaceOptions.orangeSel);
    expect(gameboard[6][2].contents).toEqual(spaceOptions.orange);

    // click on highlighted man, check for highlight removed
    await gameboard[4][2].locator.click();
    gameboard = await checkers.getGameboardState();
    expect(gameboard[4][2].contents).toEqual(spaceOptions.orange);
  });

  test('Scenario 3: First move', async ({ checkers }) => {
    // get initial gameboard state
    let gameboard = await checkers.getGameboardState();

    // select a piece with an empty diagonally adjacent space
    await gameboard[6][2].locator.click();
    gameboard = await checkers.getGameboardState();
    expect(gameboard[6][2].contents).toEqual(spaceOptions.orangeSel);
    expect(gameboard[7][3].contents).toEqual(spaceOptions.empty);

    // click a valid move location and verify piece moved
    await gameboard[7][3].locator.click();
    await checkers.waitForBlueTurn(gameboard);
    gameboard = await checkers.getGameboardState();
    expect(gameboard[7][3].contents).toEqual(spaceOptions.orange);
    expect(gameboard[6][2].contents).toEqual(spaceOptions.empty);

    checkers.printBoardState(gameboard);
  });
});
