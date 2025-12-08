# Checkers Test Plan 

## Overview
Looking to test out the checkers game located at https://www.gamesforthebrain.com/game/checkers/

## Objectives
Test:
- Clickable static elements
- Ensure instructions/messages are valid
- Legal/illegal moves on the gameboard
- Endgame states

## Scope
### In Scope:
Game-related links, all elements in the gameboard itself

### Out of Scope:
Ads, Footer

## Test Approach
1. Test static elements - initial board state, message, rules link
2. Store the game state as 2d array of tuples [string, Locator], the locator being the Playwright locator for that square, and the string is:
- '' for unoccupied space
- 'x' for black space
- 'b' for blue man
- 'o' for orange man
- 'bk' for blue king
- 'ok' for orange king
- 'oh' for highlighted orange man
- 'okh' for highlighted orange king

3. Make moves to generate the scenarios required to test, refresh game state array after computer's turn

## Tests

### Feature: Core - Game Logic
#### Scenario 1: initial page load, static elements
As a user starting a new game, the gameboard should be arranged in its initial game state, and any static page elements should be functional.

Test steps:
1. Game board is loaded -> Assert it has loaded with blue pieces in the light gray squares on the top 3 rows, 2 rows of empty spaces, and the bottom 3 rows have orange pieces in the light gray squares.
2. There is a message that says 'Select an orange piece to move.'
3. There is a link called 'Rules' that links to 'https://en.wikipedia.org/wiki/English_draughts#Starting_position'

#### Scenario 2: First move
Player should be able to make the first move with a legal piece

Test steps:
1. Click on orange man -> Assert: piece highlights
2. Click on another orange man -> Assert: new man highlights, first man is deselected
3. Click on highlighted man -> Assert: man is deselected
4. With orange man highlighted, click unoccupied diagonally adjacent space (valid) -> Assert: orange man moves to selected space. Comp takes turn.

#### Scenario 3: Man can jump opponent
Player's pieces can jump over the opponent's pieces, removing them from the game

Test steps:
1. (dynamic) Move orange pieces so there is a blue piece diagonally next to an orange piece, with an empty space diagonally beyond the space occupied by the blue piece
2. Click on orange piece to highlight
3. Click on empty space beyond blue piece -> Assert: orange man moves to the space clicked. Blue piece is removed from the gameboard - space blue piece occupied is empty.

#### Scenario 4: Man can be kinged and move down the gameboard
When a player's piece reaches the top of the gameboard, the piece is Kinged

Test steps:
1. (dynamic) Move orange pieces and force computer to move so there is a blank space at the top of the gameboard.
2. (dynamic) Move orange piece such that it is one diagonal move away from empty space at the top of the board.
2. Click on orange piece to highlight
3. Click on empty space at the top of the board diagonal from orange piece-> Assert: orange man moves to the space clicked. Orange man is now kinged. Comp takes turn.
4. Click on Kinged piece to highlight.
5. Click empty space down the gameboard diagonally adjacent to kinged piece -> Assert: kinged piece moves down to clicked unoccupied space.

#### Scenario 5: Kinged piece can jump opponents down the gameboard
When a player's piece is kinged, it can jump over opponent's piece down the gameboard

Test steps:
1. (dynamic) Move pieces such that orange has a kinged piece.
2. (dynamic) Move kinged piece such that it is diagonally adjacent to a blue piece with an empty space diagonally over the blue piece.
2. Click on orange kinged piece to highlight
3. Click on empty space diagonally beyond the blue piece down the gameboard-> Assert: orange king moves to the space clicked. Blue piece is removed from the board and the space it occupied is now empty.

#### Scenario 6: Gameboard can be reset at any time
When a player clicks the 'Restart...' button, the gameboard is reset to the starting state.

Test steps:
1. (dynamic) Move pieces such that the game board is not in the initial game state.
2. Click on the 'Restart...' link -> Assert: gameboard is reset to the initial game state.

### Feature: Core - Negative
#### Scenario 7: Player cannot highlight blue pieces.
Players do not have the ability to select blue pieces to move.

Test steps:
1. Click on a blue man to highlight -> Assert: blue piece is not highlighted. Message appears saying: 'Click on your orange piece, then click where you want to move it.'.

#### Scenario 8: Man can only move up gameboard
Non-kinged pieces can only move forward up the gameboard, not backward.

Test steps:
1. Click on an orange man to highlight
2. Click on a valid forward move. Comp moves.
3. Click on the space the orange man started from -> Assert: Piece does not move back to empty space. Piece is still highlighted.

#### Scenario 9: Man can only jump opponent's piece
Player's pieces can only jump over the opponent's pieces, not their own.

Test steps:
1. Click on an orange man to highlight (piece1)
2. Click on a valid forward move such that it is diagonal from another orange piece (piece2). Comp moves.
3. Highlight the piece2, click the empty space diagonally beyond the piece1 -> Assert: Piece does not jump to empty space diagonally over piece2. Piece1 is still highlighted.

#### Scenario 10: Player cannot move orange pieces vertically.
Players cannot move pieces vertically over a black space.

Test steps:
1. Click on an orange man to highlight
2. Click on an empty space vertically above the selected piece -> Assert: orange piece remains highlighted. Message appears saying: 'Move diagonally only.'.

#### Scenario 11: Player cannot move orange pieces horizontally.
Players cannot move pieces horizontally over a black space.

Test steps:
1. Click on an orange man to highlight
2. Click on an empty space horizontally next to the selected piece -> Assert: orange piece remains highlighted. Message appears saying: 'Move diagonally only.'.

#### Scenario 12: Player cannot move to invalid spaces multiple spaces away.
Players cannot move pieces to empty spaces not diagonally adjacent, such as a knight's move in chess (2 over, 1 up).

Test steps:
1. Click on an orange man to highlight
2. Click on an empty space 2 coumns and 1 row away -> Assert: orange piece remains highlighted. Message appears saying: 'This is an invalid move.'.

### Feature: Core - Edge Case
#### Scenario 13: Man can jump 2 opponent pieces
Player's pieces can jump over 2 opponent's pieces if there is a empty space beyond a second diagonally adjacent opponent piece

Test steps:
1. (dynamic) Move orange pieces so there is a blue piece (piece1) diagonally next to an orange piece, with an empty space diagonally beyond the space occupied by the blue piece.  There is also another blue piece (piece2) adjacent to the empty space mentioned, with an empty space beyond piece2.
2. Click on orange piece to highlight
3. Click on empty space beyond blue piece1 -> Assert: orange man moves to the space clicked. Blue piece is removed from the gameboard - space blue piece1 occupied is empty.  Message appears saying 'Complete the double jump or click on your piece to stay still.' 
4. Click on the empty space beyond blue piece2 -> Assert: orange man moves to the space clicked. Blue piece is removed from the gameboard - space blue piece2 occupied is empty.

#### Scenario 14: Man can optionally choose not to double jump.
Player's pieces that has the option to double jump over 2 opponent's pieces can stop after the first jump by deselecting the piece instead of clicking the empty space to move.

Test steps:
1. (dynamic) Move orange pieces so there is a blue piece (piece1) diagonally next to an orange piece, with an empty space diagonally beyond the space occupied by the blue piece.  There is also another blue piece (piece2) adjacent to the empty space mentioned, with an empty space beyond piece2.
2. Click on orange piece to highlight
3. Click on empty space beyond blue piece1 -> Assert: orange man moves to the space clicked. Blue piece is removed from the gameboard - space blue piece1 occupied is empty.  Message appears saying 'Complete the double jump or click on your piece to stay still.' 
4. Click on the the orange piece to deselect -> Assert: orange man is now longer highlighed. Comp takes turn.

### Endgame scenarios
#### Scenario 15: Player wins if all opponent's pieces are removed from the board.
If all the opponent's pieces have been removed from the board, the player is declared the winner.

Test steps:
1. (dynamic) Make moves such that player has jumped all opponent's pieces -> Assert: Message appears saying 'You won the game, congratulations!'

#### Scenario 16: Player loses if all players's pieces are removed from the board.
If all the player's pieces have been removed from the board, the player is declared the loser of the game.

Test steps:
1. (dynamic) Make moves such that computer has jumped all player's pieces -> Assert: Message appears saying 'You lose. Game over.'

#### Scenario 17: Player wins if all opponent's pieces can no longer make legal moves.
If all the remaining opponent's pieces have no more legal moves, the player is declared as the winner.

Test steps:
1. (dynamic) Make moves such that player has blocked all remaining opponent's pieces from moving -> Assert: Message appears saying 'You have won!'


## Resources Required

