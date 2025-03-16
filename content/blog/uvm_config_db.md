---
id: "3"
title: "UVM_CONFIG_DB"
slug: "how to set uvm_config_db"
excerpt: "How to correctly set the configurations with umv_config_db"
date: "Jan-02-2025"
readTime: "8 min"
category: "Hardware Desgin"
tags: ["Verilog", "Hardware Design", "Digital Logic"]
imageUrl: "/howToUvmConfigDb.png"
---

# Context, Instance(path), Field, Value of uvm_config_db

*Published on Jan 02, 2025*

## Syntax:

```systemverilog
static function void set (uvm_component (cntxt), string (inst_name), string (field_name), T (value));
uvm_config_db#(data_type)::set(this/null, "", "", value);

static function bit get  (uvm_component (cntxt), string (inst_name), string (field_name), inout T (value));
uvm_config_db#(data_type)::get(this/null, "", "", value);
```

## Arguments/ Context:

### null (Global context):
- The configuration will be accessible to any component in the entire testbench hierarchy, regardless of the level at which the configuration is set.
- Use null when you want the configuration to be accessible by all components throughout the testbench, no matter where the get call is made.

### this (Component-specific context):
- The context refers to the specific component (or object) that is setting the configuration. When you use `this`, it indicates that the configuration will only be accessible to the component and its descendants (children) in the hierarchy.
- You're telling the framework where to start searching for the configuration, specifically within the current object (and its descendants).
- **Limitation:** However, it doesn't automatically know what specific object within that scope you're trying to access. This is where the **path** comes into play.
- Using `this` as the argument, otherwise `null` or `uvm_root::get()` gets interpreted as the highest level.

## Why Both `this` and the Path?

- **Analogy:**
  - `this` is like saying, "Start looking for the configuration from my current location."
  - The **path** is like saying, "But I need to look for a specific configuration inside a specific sub-object of the hierarchy."
- Even though you're starting the search from `this`, you still need the full path because:
  - There may be many components at the same level in the hierarchy. You need the path to specifically identify which one you're talking about.
  - You could be calling `get` from a component that’s higher up in the hierarchy but still want to get the configuration from a specific sub-component. The path allows UVM to follow the hierarchy to the right place.

---

## uvm_config_db Examples

### 1. Setting and Getting Integer Values with Component-Specific Context

```systemverilog
// In driver component (setting)
uvm_config_db#(int)::set(this, "uvm_test_top.env.mem_agnt.driver", "max_size", 1024);

// In monitor component (getting)
int max_size;
uvm_config_db#(int)::get(this, "uvm_test_top.env.mem_agnt.driver", "max_size", max_size);
```

### 2. Setting and Getting String Values in Different Components

```systemverilog
// In driver component (setting)
uvm_config_db#(string)::set(this, "uvm_test_top.env.mem_agnt.driver", "mode", "write");

// In scoreboard component (getting)
string mode;
uvm_config_db#(string)::get(this, "uvm_test_top.env.mem_agnt.driver", "mode", mode);
```

### 3. Using Enumerated Types for Configuration Values

```systemverilog
// Enum definition
typedef enum {READ, WRITE, IDLE} mode_t;

// In driver component (setting)
mode_t op_mode = WRITE;
uvm_config_db#(mode_t)::set(this, "uvm_test_top.env.mem_agnt.driver", "operation_mode", op_mode);

// In monitor component (getting)
mode_t mode;
uvm_config_db#(mode_t)::get(this, "uvm_test_top.env.mem_agnt.driver", "operation_mode", mode);
```

### 4. Using Object References in the Configuration Database

```systemverilog
// Define a UVM object (class)
class mem_config extends uvm_object;
    rand bit [31:0] size;
    rand bit [31:0] address;
    function new(string name = "mem_config");
        super.new(name);
    endfunction
endclass

// In driver component (setting)
mem_config config;
config = mem_config::type_id::create("config");
config.size = 1024;
config.address = 'h1000;
uvm_config_db#(mem_config)::set(this, "uvm_test_top.env.mem_agnt.driver", "mem_config", config);

// In monitor component (getting)
mem_config cfg;
uvm_config_db#(mem_config)::get(this, "uvm_test_top.env.mem_agnt.driver", "mem_config", cfg);
```

### 5. Using `null` for Global Access to Configuration Values

```systemverilog
// In driver component (setting)
uvm_config_db#(int)::set(null, "uvm_test_top.env.mem_agnt.driver", "timeout", 500);

// In scoreboard component (getting)
int timeout;
uvm_config_db#(int)::get(this, "uvm_test_top.env.mem_agnt.driver", "timeout", timeout);
```

### 6. Default Values in Case of Missing Configuration

```systemverilog
// In driver component (setting)
uvm_config_db#(int)::set(this, "uvm_test_top.env.mem_agnt.driver", "max_retries", 3);

// In scoreboard component (getting with default)
int retries;
if (!uvm_config_db#(int)::get(this, "uvm_test_top.env.mem_agnt.monitor", "max_retries", retries)) {
    retries = 10; // Default value
}
