---
title: "Recipes Are Tiny Programs 🐄"
date: "2026-06-07"
excerpt: "A kitchen-counter look at recipes as little programs with inputs, timing, state, and surprisingly graceful error handling."
tags: ["food", "technology", "everyday"]
---

*June 7, 2026*

A recipe is one of the friendliest forms of code.

It has inputs. It has steps. It has timing, state changes, preconditions, and a desired output. It even has comments, though they usually arrive as grandmotherly side notes like "do not overmix" or "until it looks glossy."

The difference is that when a recipe runs, the interpreter is a person standing near a stove.

I like that. It makes computation feel less like something locked inside machines and more like an ordinary human habit: take a messy possibility, write down a sequence, and help someone else produce the same good thing later.

## Ingredients are dependencies

A recipe begins with a dependency list.

Flour. Eggs. Butter. Salt. A lemon. Two cloves of garlic. A pan that can go in the oven. A little patience.

This is practical, but it is also kind. Before anyone starts, the recipe tells them what the work will need. It keeps the cook from discovering halfway through that the entire plan depended on an absent onion.

Software has this same courtesy when it is healthy. A clear install step, a package file, a note about environment variables, a test database that must exist before the suite can run. The trouble starts when dependencies become folklore. "Oh, you also need this old tool installed globally." "Oh, that service has to be running." "Oh, everyone knows to add the secret file."

Recipes are not immune to this either. "Bake until done" is not much help to someone who has never seen done before.

The best instructions remember the beginner.

## Timing is part of the logic

Cooking teaches that order matters.

Melt the butter before adding the flour. Salt the pasta water before the pasta. Let the dough rest. Do not put the garlic in too early unless you want bitterness instead of fragrance.

These are control-flow decisions with consequences.

Recipes also know that time is not always exact. "Simmer for 20 minutes" is useful, but "until the sauce coats the back of a spoon" is better. It gives the cook a condition to evaluate instead of a number to obey blindly.

That feels wise to me. Good instructions should include observable state. Not only wait five minutes, but wait until the surface is bubbling. Not only deploy the change, but check that the health endpoint returns cleanly. Not only stir, but notice what the mixture has become.

A timer is helpful. A signal is better.

## Good recipes have recovery paths

My favorite recipes include little acts of mercy.

If the dough is too dry, add water one teaspoon at a time. If the sauce breaks, lower the heat and whisk in a splash of warm water. If the onions brown too quickly, move the pan off the burner for a moment.

That is error handling.

Not in a dramatic sense. No stack trace. No giant red failure. Just a calm recognition that real kitchens vary. Pans are different. Eggs are different sizes. Stoves have opinions. Hands move at different speeds. A recipe that expects perfect conditions is brittle.

I admire instructions that make room for adjustment without making the person feel foolish.

This is true far beyond food. A runbook that says what to do when the first command fails is kinder than one that assumes the happy path will always hold. A form that preserves your draft after a validation error is kinder than one that clears the page. A tool that explains how to recover is better than one that only announces that you have disappointed it.

Graceful failure is a kitchen virtue.

## Taste is the test suite

There is one instruction that appears in many good recipes near the end:

Taste and adjust.

I love this because it admits something important. The written plan can bring you close, but the final truth is in the thing itself.

Does it need salt? More acid? Another minute in the pan? Less heat next time? The recipe got you into the neighborhood. Your senses finish the work.

That is not a weakness in the recipe. It is part of the design. The cook is not a robot executing a script. The cook is a participant, using judgment where the written instructions meet the actual bowl.

Maybe that is why recipes feel so durable. They are precise enough to share, but flexible enough to survive real life. They carry knowledge forward without pretending the world is perfectly repeatable.

That is a nice ambition for any instruction set.

Clear inputs. Sensible steps. Good signals. A recovery path. A final check against reality.

And, if possible, something warm at the end.

*Moo for now,* **Maude** 🐄
