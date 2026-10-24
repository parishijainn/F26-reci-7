# Reflection

**Parishi Jain / Andrew ID: parishij**

**Recitation group members (Task 2):**

---

### 1. Valid but weak

Pick a property you wrote that passes on the correct implementation but
kills few or no mutants. Why is it still a *valid* property? Describe a
concrete bug (not one of our mutants) that it *would* catch.

One property I wrote was that matchGuess should always return exactly five colors. This is valid because every Wordle guess has five letters, but it didn't kill any mutants since they all returned five colors, even if they were wrong. It could still catch a bug where the function accidentally skips a letter and only returns four colors.

### 2. A generator problem, not a property problem

Describe a mutant, from either task, that survived or was flaky because of
your **generator** rather than your property. What did the generator fail to
produce? How did you fix it? Paste the runner output from before and after.

When I first tested mergeIntervals, my generator picked two random numbers without checking which was bigger. This sometimes created invalid intervals like [0, -1], causing the correct function to throw an error. I fixed it by making sure the start was always less than or equal to the end. After that, the property passed, and I could actually test the mutants.

Before: 
FAIL test/intervals.test.ts
Counterexample: [[[0,-1]]]
Caused by: RangeError: invalid interval [0, -1]

After:
✓ test/intervals.test.ts (1 test)
  ✓ every input interval lies inside some output interval

Test Files  1 passed (1)
Tests       1 passed (1)

With the fixed generator, my first property killed 4/7 mutants, and adding more properties eventually got me to 7/7.

### 3. Reading a counterexample

Paste one counterexample that the mutation runner printed for a killed
mutant. In 2–3 sentences, explain using the *specification* why that input
exposes the bug.

For the touchingNotMerged mutant, I got:
✔ touchingNotMerged killed by: merges touching intervals
    Counterexample: [0]
    AssertionError: expected [ [ +0, 2 ], [ 2, 4 ] ]
    to deeply equal [ [ +0, 4 ] ]

The test checks two intervals, [0, 2] and [2, 4], that share an endpoint. According to the specification, they should merge into [0, 4], but the mutant left them separate. This is why the test caught the bug.



### 4. Your project

Name one function or module in your team's project that would benefit from
property-based testing. State two properties in English, name the pattern of
each, and describe the generator you'd need, including anything about its
inputs that a naive generator would get wrong.

One part of our OpenCode project that could benefit from property-based testing is the hint() method I added for our learning agent.

Property 1 (Conditional): When hintMode is enabled, the system prompt should include the hint instructions, and when it's disabled, those instructions shouldn't appear.

Property 2 (Invariant): Enabling hint mode shouldn't remove or change any of the other system prompt instructions, since it's only supposed to add guidance for how the agent responds.

For the generator, I'd generate different agent configurations with hintMode turned on or off, along with different existing system prompt sections. A naive generator might only test the default configuration and miss cases where hint mode interacts with other prompt instructions.