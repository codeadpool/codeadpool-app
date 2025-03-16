---
id: "4"
title: "Vertical Reuse with UVM_HARNESS"
slug: "Vertical Reuse with UVM_HARNESS"
excerpt: "Importance of vertical reuse and how uvm_harness helps with it"
date: "Jan-02-2025"
readTime: "8 min"
category: "Digital Logic"
tags: ["Verilog", "Hardware Design", "Digital Logic"]
imageUrl: "/verticalReuse.png"
---
# Vertical Reuse

## Published on Jan 02, 2025

### Reuse

- **Vertical Reuse**: Inheritance, using a verification component in a different hierarchical level, usually with an implied change of role.
- **Horizontal Reuse**: Composition, using a verification component in a different project but at the same abstraction level.

### Active/Passive Operations:

- Complete Environment must consider active/passive configuration not only verification components.
- Active components like drivers/sequencers must not be created in passive mode.
- Do not connect the scoreboard to active components.
- Perform functional checks in passive components.
- Collect functional coverage in passive components.
- Update configuration only from passive components.
- Generate important messages in passive components.
- Don't control end-of-test from components in passive mode.
- Put user constraints in sequences, not sequence items.
- Encapsulate all sub-components in a single-reusable Environment.
- SVAs in interface, combine multiple signal interfaces into a hierarchical interface.

---

# Port Coercion and Signal Driving for the UVM Harness

The key to understanding this approach lies in the concept of port coercion:

- Net ports, particularly when declared as inputs, can be coerced to inout ports by the SystemVerilog compiler.
- This coercion occurs when the compiler detects potential drivers for these ports, even if they are initially declared as inputs.

## Why Net Ports?

- **Flexibility**: Net ports, especially when declared as inputs, provide more flexibility than variable ports (like logic).
- **Coercion Behavior**: SystemVerilog allows net ports to be coerced to inout, enabling bidirectional signal flow when needed.
- **Resolving Multiple Drivers**: Net ports can handle multiple drivers more gracefully than variable ports, which is crucial for the harness technique.

## Driving Signals

Contrary to the initial assumption, these net ports can indeed be driven, but through a specific mechanism:

- **Virtual Interface Driving**: "VCS also coerces ports of an interface if there is any code that drives it from a virtual interface reference" [3.2.1].
- **Runtime Flexibility**: This allows for dynamic changes in signal direction and driving capability without modifying the interface definition.

## Detailed Explanation

- **Initial Declaration**: The ports are initially declared as inputs, which are net types by default.
- **Compilation Process**: During compilation, if the compiler detects any potential drivers (e.g., from virtual interfaces or testbench code), it automatically coerces these input ports to inout.
- **Runtime Behavior**: This coercion allows the ports to be driven from the testbench side when needed, while still being able to receive signals from the DUT.
- **Bidirectional Support**: This approach enables the same interface to work for both master and slave configurations without requiring separate definitions.
- **Avoiding Restrictions**: Using inout directly would impose restrictions on connecting to signals of different widths, which is avoided by this coercion technique.

## Practical Implications

- **Testbench Flexibility**: This approach allows testbench components to drive signals when needed, without hardcoding the direction in the interface definition.
- **Stub Compatibility**: It supports working with both active RTL and stub modules without changing the interface connections.
- **Dynamic Role Changes**: Agents can switch between master and slave roles dynamically, as the signal directions are not fixed in the interface definition.

## Summary

While the ports are declared as nets (typically inputs), the paper's approach leverages SystemVerilog's port coercion feature to enable driving these signals when needed, providing a flexible and powerful mechanism for testbench-DUT interactions.

## WE GOT:

- We removed the instantiation of interfaces.
- We removed the DEFINES for the parameters.
- Eliminated "two-pass randomization":
  - Randomization of ONE-SET of variables depends upon another.
  - First pass: RTL parametrization and then those are packed and imported to test-bench building.

## DO:

### Define an interface with all signals declared as ports which are all wire and input:

- Each interface port corresponds to the name of a DUT port (henceforth called the DUT interface).
- All ports must be wire and input:
  - **Port coercion**: Simulator forces the ports to their proper direction.
  - **Inout**: Inout doesn't work because both directions require the same length.

- Define a wrapper interface (henceforth called a harness) and make the harness instantiate the DUT interface.
- Connect the DUT interface's ports to the DUT using an upward reference to the module name.

### Bind the harness into the DUT

#### Syntax:
```systemverilog
bind <module_type> <interface_type> <interface_name>
```

### Variable Width support:

### Extract RTL Parameters:

- Put this function in a module and bind it to the harness.
- RTL Bug may not manifest in one RTL configuration but can be in another.
