---
id: "5"
title: "Stride and Stream Prefetchers"
slug: "stride-stream-prefetchers"
excerpt: "Stride and stream prefetchers, their Verilog implementations, and how they optimize memory latency."
date: "Jan-31-2025"
readTime: "8 min"
category: "Hardware Design"
tags: ["Verilog", "Cache", "Prefetching", "Memory Optimization"]
imageUrl: "/prefetchers.png"
---

# A Detailed Explanation of Stride and Stream Prefetchers in Verilog
- When designing high-performance processors, memory latency is a major bottleneck. Prefetchers are hardware components that predict and fetch data into the cache before it’s requested, reducing wait times. In this explanation, we’ll explore two Verilog implementations—stride_prefetcher and stream_prefetcher—diving into their purpose, how they work, and their actual code. I’ll break down their designs, highlight key differences, and provide clear examples from the code to make everything easy to follow.

## What Are Prefetchers and Why Do They Matter?
Prefetchers sit between the processor and memory, watching memory access patterns to guess what data will be needed next. By loading this data into the cache ahead of time, they cut down on delays that happen when the processor has to wait for memory. The stride_prefetcher and stream_prefetcher are two flavors of this idea, each with its own way of spotting patterns and deciding what to fetch.
## Shared Foundations: How Both Prefetchers Are Built
Both prefetchers share a common goal: detect patterns in memory addresses and prefetch accordingly. Let’s look at their building blocks.
Key Parameters
These settings control how the prefetchers behave and can be tweaked for different systems:

-    `ADDR_WIDTH`: Size of memory addresses (default: 32 bits).
-    `PREFETCH_DEPTH`: How many prefetch requests can be queued (default: 16).
-    `STREAM_TRACKS`: How many memory streams they can monitor at once (default: 4).
-    `PREFETCH_DISTANCE`: How far ahead they prefetch (default: 4 addresses).
-    `CONFIDENCE_THRESHOLD`: How sure they need to be of a pattern before prefetching (default: 3).
-    `MAX_LRU_AGE`: Tracks how recently a stream was used for replacement (default: 15).

The Stream Structure
Both use a stream_t structure to keep track of each memory stream they’re monitoring. Here’s the Verilog code defining it:
verilog
```
typedef struct packed {
    logic [ADDR_WIDTH-1:0] last_addr;     // Last address seen in this stream
    logic [ADDR_WIDTH-1:0] stride;        // Difference between consecutive addresses
    logic [2:0]            confidence;    // How confident we are in the pattern
    logic [3:0]            lru_age;       // Age for deciding which stream to replace
} stream_t;
```
-    last_addr: Remembers the most recent address.
-    stride: The gap between addresses (e.g., 4 if addresses are 100, 104, 108).
-    confidence: Builds up as the pattern holds; triggers prefetching when it hits the threshold.
-    lru_age: Helps replace the least recently used stream when all trackers are full.

The Prefetch Queue
A FIFO (first-in, first-out) queue holds addresses to prefetch. It’s managed with:

-    queue_head: Points to the next address to send out.
-    queue_tail: Where new addresses are added.
-    queue_count: Tracks how full the queue is.

Outputs:
-    prefetch_valid: Signals when there’s a valid address to fetch.
-    prefetch_addr: The address to fetch.

## How They Work: Core Mechanisms
Both prefetchers watch incoming memory requests (req_addr and req_valid) and try to spot patterns. Here’s how they do it.
1. Spotting a Pattern (Stream Detection)
They scan their streams array to see if the new address fits an existing pattern. Here’s the Verilog logic:
verilog
```
always_comb begin
    found = 0;
    stream_index = 0;
    for (int i = 0; i < STREAM_TRACKS; i++) begin
        if (streams[i].last_addr + streams[i].stride == req_addr && streams[i].confidence > 0) begin
            stream_index = i;
            found = 1;
            break;
        end
    end
    if (!found) begin
        logic [3:0] max_age = 0;
        for (int i = 0; i < STREAM_TRACKS; i++) begin
            if (streams[i].lru_age > max_age) begin
                max_age = streams[i].lru_age;
                stream_index = i;
            end
        end
    end
end
```
-    If there’s a match: The new address equals last_addr + stride, so found = 1, and stream_index points to that stream.
-    If no match: Pick the stream with the highest lru_age (least recently used) to replace with this new pattern.

2. Building Confidence
When a request comes in:
```
    Calculate new_stride = req_addr - last_addr.
    If it matches the existing stride and there’s a match (found = 1), increase confidence (up to 3).
    If it’s a new or different stride, reset confidence to 1 (or 0 if the stride is 0, meaning no pattern).
```
3. Triggering Prefetching
When confidence reaches CONFIDENCE_THRESHOLD and the queue isn’t full, they prefetch. They add addresses like:
```
    req_addr + stride
    req_addr + 2 * stride
    Up to req_addr + prefetch_distance * stride.
```
4. Managing the Queue

-    Adding addresses: If there’s space (queue_count < PREFETCH_DEPTH), add new prefetch addresses and update queue_tail.
-    Sending addresses: When the consumer (e.g., cache) is ready (consumer_ready), send prefetch_addr from queue_head and reduce queue_count.

## What Makes Them Different?
While they share a lot, the stride_prefetcher and stream_prefetcher have unique twists.
Stride Prefetcher: Dynamic Prefetch Distance
The stride_prefetcher adjusts how far ahead it prefetches based on cache performance:
verilog
```
if (req_valid && cache_hit && dynamic_prefetch_distance > 1) begin
    dynamic_prefetch_distance <= dynamic_prefetch_distance - 1; // Too many hits, prefetch less
end else if (req_valid && !cache_hit && dynamic_prefetch_distance < PREFETCH_DISTANCE) begin
    dynamic_prefetch_distance <= dynamic_prefetch_distance + 1; // More misses, prefetch more
end
```
- Cache hit: Data was already in the cache, so it reduces dynamic_prefetch_distance (minimum 1).
- Cache miss: Data wasn’t ready, so it increases dynamic_prefetch_distance (up to PREFETCH_DISTANCE).
- Output: It also provides prefetch_degree, showing the current distance.

This makes it adaptable to workloads that change over time.
Stream Prefetcher: Hit/Miss Tracking
The stream_prefetcher keeps a simple tally of cache hits and misses:

-    Increase hit_miss_ratio on hits.
-    Decrease it on misses.

It doesn’t use this info yet, but it could later adjust prefetching based on performance.
Comparing Strengths and Weaknesses
## Stride Prefetcher

Strengths:
-    Flexible: Adapts to workload changes, reducing wasted prefetches when the cache is doing well.
-    Efficient: Saves memory bandwidth by scaling back when unnecessary.
Weaknesses:
-    Complex: Dynamic adjustments add more logic to design and test.
-   Risk: Could flip-flop between distances if cache hits/misses vary wildly.

## Stream Prefetcher

Strengths:
-   Simple: Fixed distance is easier to build and verify.
-   Future-ready: Hit/miss tracking sets the stage for smarter tweaks.
Weaknesses:
-   Rigid: Fixed distance might prefetch too much or too little.
-   Untapped Potential: Doesn’t yet use its hit/miss data.

Code in Action: A Simple Example
Imagine addresses coming in: 100, 104, 108, 112 (stride = 4).
Stride Prefetcher:

    First request (100): New stream, last_addr = 100, stride = 0, confidence = 0.
    Second (104): new_stride = 104 - 100 = 4, stride = 4, confidence = 1.
    Third (108): 108 = 104 + 4, confidence = 2.
    Fourth (112): 112 = 108 + 4, confidence = 3. Prefetch 116, 120, 124, 128 (if dynamic_prefetch_distance = 4).
    Cache feedback: If misses occur, it might increase dynamic_prefetch_distance.

## Stream Prefetcher
Same as above, but always prefetches 4 ahead (116, 120, 124, 128) once confidence = 3, no adjustments.
Tips for Using Them

- Stride Prefetcher: Great for apps like video processing, where access patterns shift. Raise CONFIDENCE_THRESHOLD if there’s noise in the data.
- Stream Prefetcher: Perfect for steady, sequential tasks like file reading. Add logic to use hit_miss_ratio to throttle prefetching.

## Final Thoughts
The stride_prefetcher and stream_prefetcher are clever Verilog designs for tackling memory latency. The stride_prefetcher shines with its ability to adapt, while the stream_prefetcher keeps things straightforward with room to grow. Their code—structured with parameters, structs, and clear logic—makes them solid starting points for boosting cache performance. Pick the one that fits your workload, and tweak the settings to get the best results!