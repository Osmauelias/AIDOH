# AIDOH — Product Operating Principles

## Authority

Scope: all AIDOH products, prototypes, debugging missions and reusable product systems.

Source authority: Osvaldo / Umbral.

Status: ACTIVE.

---

## Canonical Rule — SIMPLEST REAL-WORLD TEST FIRST

Before adding complexity to diagnose, validate or repair a product, ask:

> **What is the simplest, cheapest, reversible test a normal user could perform that would materially separate the competing explanations?**

If such a test exists, run it before:
- adding a new dependency;
- building a larger diagnostic harness;
- changing architecture;
- widening the experiment;
- generating many variants;
- escalating compute or tooling.

### Operating sequence

```text
FAILURE / UNCERTAINTY
↓
SIMPLE REAL-WORLD CONTROL EXISTS?
↓
RUN IT
↓
OBSERVE
↓
NARROW HYPOTHESES
↓
ONLY THEN ESCALATE
```

### A valid simple control should preferably

- take minutes, not hours;
- avoid new infrastructure;
- be reversible;
- approximate actual user behavior where relevant;
- produce an observable PASS/FAIL or comparison;
- reduce the next decision.

### Important

This rule does **not** replace technical rigor.

It controls the **order of operations**:

`simple reality test → measured delta → deeper diagnosis only if needed`.

### Relationship to Umbral

This is an operationalization of:
- Ockham / simplest sufficient explanation or path;
- reality over narrative;
- applicability before depth;
- less mapping, more movement;
- operator-load protection.

### Initial evidence

Within <24h during MVP-002 Content Factory work:

1. A user-like screen capture/recording changed the playback symptom and exposed that the playback path mattered, even though it did not solve root cause.
2. A manual CapCut cut from the same source/region played smoothly while internal FFmpeg microclips did not, localizing the fault domain toward the internal pipeline.

### Stop rule

If the simple test answers the operational question sufficiently, stop.

Do not continue diagnosing merely because more explanation is possible.

---

## Canonical Rule — SUFFICIENT NAVIGATION

AIDOH products do not need a complete explanation of the whole problem space before moving.

The product team needs enough map to:

- make the current decision safely;
- complete the next useful step;
- preserve operator and system capacity;
- retain room to change direction when weak signals or new evidence appear.

Operational question:

> **Do we know enough to navigate the next segment well, while preserving room to adapt?**

If yes, move.

If not, identify the smallest missing uncertainty that could materially change the decision and investigate only that.

### Stop rule

Do not continue diagnosis solely to achieve explanatory completeness.

Continue only when remaining uncertainty can materially change:
- safety;
- integrity;
- cost;
- direction;
- reversibility;
- or the next decision.

Relationship:
`SIMPLEST REAL-WORLD TEST FIRST → SUFFICIENT NAVIGATION → MOVE / ADAPT`.

