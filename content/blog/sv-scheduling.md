---
id: "2"
title: "SV-Scheduling"
slug: "sv-scheduling"
excerpt: "How the stratified event scheduler works in systemverilog"
date: "Jan-31-2025"
readTime: "8 min"
category: "Hardware Desgin"
tags: ["Verilog", "Hardware Design", "Digital Logic"]
imageUrl: "/sv-scheduling.png"
---


# Stratified Event Scheduler of SystemVerilog

*Published on Jan 30, 2025*

## Simulation Time & Time Slot

- Simulation Time: Used to refer to the time value maintained by the simulator to model the actual time it would take for the system description being simulated.
- Time Slot: Encompasses all simulation activity that is processed in the event regions for each simulation time. All simulation activity for a particular simulation time is executed until no further simulation activity remains for that time slot, that is, without advancing the simulation time.
- Race Two signals racing each other attempting to influence the output first.

## Hardware Races & Simulation Induced Races

- The simulator processes events one at a time, unavoidably serializing the events that occur in the same time slot.
- Hence, the design activity that in the actual hardware takes place concurrently is instead modeled as a set of ordered actions by the simulator.
- This deviation induces additional races that are not present in the design but are an artifact of the simulator.

## A Time Slot is Divided into a Set of Ordered Regions

- a) Preponed
- b) Pre-Active
- c) Active
- d) Inactive
- e) Pre-NBA
- f) NBA
- g) Post-NBA
- h) Pre-Observed
- i) Observed
- j) Post-Observed
- k) Reactive
- l) Re-Inactive
- m) Pre-Re-NBA
- n) Re-NBA
- o) Post-Re-NBA
- p) Pre-Postponed
- q) Postponed

The purpose of dividing a time slot into these ordered regions is to provide predictable interactions between the design and testbench code.

## Preponed Events Region

- Used by concurrent assertions.
- Executed only once in each time slot (no feedback path).
- Both preponed and postponed regions are read-only regions.
- The actual signal values are the same in any two contiguous postponed-preponed regions.

> The values of variables used in assertions are sampled in the Preponed region of a time slot, and the assertions are evaluated during the Observed region. ...

- The simulator samples signals in the Preponed region to ensure that the values are stable and consistent for the entire time slot.
- It maintains two values for each signal: the current value and the Preponed value.
- When a clocking event is triggered, the simulator uses the Preponed value for sampling, ensuring that the sampled value corresponds to the state of the signal at the beginning of the time slot.
- This mechanism can be optimized by techniques like peeking into the event queue, but the core idea is to ensure that sampling is consistent and predictable, regardless of when the clocking event occurs within the time slot.

## Active Region Set (Active-Inactive-NBA)

The Active Events Region, also commonly called the Active region, is part of the Active Region Set. The principal function of this region is to evaluate and execute all current module activity. Including (in any order):

- Execute all module blocking assignments.
- Evaluate the Right-Hand-Side (RHS) of all nonblocking assignments and schedule updates into the NBA region.
- Execute all module continuous assignments.
- Evaluate inputs and update outputs of Verilog primitives.
- Execute the *`$display`* and *`$finish`* commands.

## Observed Region

- The principal function of this region is to evaluate the concurrent assertions using the values sampled in the Preponed region.
- Assertions that execute a pass or fail action block actually schedule a process associated with the pass and fail code into the Reactive regions, not in the Observed region. This is because concurrent assertions are designed to behave strictly as monitors, thus, they are not allowed to modify the state of the design.

## Reactive Region

- Assertion action block (e.g., pass/fail statements) are executed here.

## Postponed Region

- Final value updates and *`$strobe`/`$monitor`* statements are executed here.

```systemverilog
execute_simulation {
  T = 0;
  initialize the values of all nets and variables;
  schedule all initialization events into time zero slot;
  while (some time slot is nonempty) {
    move to the first nonempty time slot and set T;
    execute_time_slot (T);
  }
}

execute_time_slot {
  execute_region (Preponed);
  execute_region (Pre-Active);
  while (any region in [Active ... Pre-Postponed] is nonempty) {
    while (any region in [Active ... Post-Observed] is nonempty) {
      execute_region (Active);
      R = first nonempty region in [Active ... Post-Observed];
      if (R is nonempty)
        move events in R to the Active region;
    }
    while (any region in [Reactive ... Post-Re-NBA] is nonempty) {
      execute_region (Reactive);
      R = first nonempty region in [Reactive ... Post-Re-NBA];
      if (R is nonempty)
        move events in R to the Reactive region;
    }
    if (all regions in [Active ... Post-Re-NBA] are empty)
      execute_region (Pre-Postponed);
  }
  execute_region (Postponed);
}

execute_region {
  while (region is nonempty) {
    E = any event from region;
    remove E from the region;
    if (E is an update event) {
      update the modified object;
      schedule evaluation event for any process sensitive to the object;
    } else { /* E is an evaluation event */
      evaluate the process associated with the event and possibly
      schedule further events for execution;
    }
  }
}
```

## Don't Make #0 Procedural Assignments
- Using #0 can introduce ambiguity because it doesn’t specify any actual time delay.
- Different tools have different internal scheduling algorithms, so they may handle this differently.