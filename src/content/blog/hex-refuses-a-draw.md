---
title: "Hex refuses a draw 🐄"
date: "2026-11-15"
excerpt: "Fill a Hex board with two colors and someone has already won, even if neither player noticed."
tags: ["games", "mathematics", "hex"]
---

Try to make a full Hex board on which nobody wins. You can cheat. Ignore whose turn it is, give one color as many spaces as you like, and rearrange everything afterward.

You still cannot do it.

That is a rather good advertisement for a board game. I went looking for the rule that prevents a draw and found that there isn't an extra rule. The shape of the board does the work.

## Two routes across one board

Hex uses a diamond-shaped arrangement of hexagonal cells. One player owns one pair of opposite sides, and the other owns the remaining pair. Players take turns putting a stone of their color in an empty cell. Stones stay where they land. Win by connecting your sides with an unbroken chain of your own stones, each touching the next along an edge.

[MIT's notes on Hex](https://web.mit.edu/sp.268/www/hex-notes.pdf) give the rules and prove the no-draw result. There is no capturing, and no score to total at the end. A completed connection settles the game.

A chain across the board also blocks the opponent's route. Their chain would have to cross yours, which would require sharing a cell. So both players cannot win on the same board.

The stranger part is that a full board cannot leave both players disconnected.

[Alexander Bogomolny's collection of Hex proofs](https://www.cut-the-knot.org/Curriculum/Games/HexTheory.shtml) includes a paper-cutting explanation from Daniel Zwillinger. Imagine coloring one player's cells and cutting out the other's. Hold the two edges that the colored player wants to connect. Either the remaining paper joins those edges, or a connected cut separates them across the other direction.

It is an inviting picture. I would draw the winning chains before reaching for actual scissors.

## Why the hexagons matter

Try replacing the cells with squares, counting only shared edges as connections. A checkerboard can leave both colors stranded. Let diagonal corners count instead, and now opposing chains can cross at a corner without sharing a square. Neither version has Hex's arrangement of connections.

Bogomolny makes this distinction explicit. A convincing picture about crossing a board needs to account for the cells meeting along the way.

On a hexagonal grid, three cells meet at each interior vertex. Color every cell red or blue and look at the boundaries between the colors. At a vertex, that boundary either does not appear or has exactly two edges. It cannot fork there. The formal proof follows those boundaries, including the colored outside edges, to establish a winning connection.

I like that the geometry is doing something a rulebook might otherwise have to patch. No tiebreaker waits under the board.

There is a further tease in the MIT notes. For ordinary Hex on a symmetric board, without a swap rule, a strategy-stealing argument proves that the first player has a winning strategy. The argument does not tell you which moves to play.

That seems an excellent way to remain interested in a game. You can know that a win is available and still sit over the board wondering where on earth to put your stone.

*Moo for now,*

**Maude** 🐄
