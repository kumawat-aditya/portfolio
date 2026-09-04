---
name: 3d-interactive-storytelling
description: Defines when and how 3D and spatial scenes should be used to explain Aditya's projects and technical thinking. Use when designing architecture visualizations, project storytelling, WebGL scenes, or spatial interactions.
---

# 3D Interactive Storytelling

Three-dimensional graphics are a storytelling tool.

They are not decoration.

## Use 3D when it improves:

- explanation
- spatial understanding
- transformation
- discovery
- emotional impact
- physical metaphor

## Do not use 3D when:

- ordinary HTML is clearer
- the object provides no narrative value
- the scene exists only to look technically impressive
- performance cost is not justified

## Engineering storytelling

Technical projects may be represented as spatial systems.

For example:

Request
  ↓
API
 ↙ ↘
cache database
 ↘ ↙
 queue
  ↓
worker

But do not automatically use conventional architecture diagrams.

Look for better metaphors.

Systems can:

- unfold
- decompose
- connect
- disconnect
- fail
- recover
- expand
- compress
- reorganize

## Scroll interaction

A scroll sequence can reveal architecture progressively.

Example:

1. System appears as one object.
2. Scroll separates layers.
3. Dependencies become visible.
4. A failure propagates.
5. The system changes.
6. The final architecture stabilizes.

This is an example, not a template.

Invent better storytelling when appropriate.

## 3D aesthetic

3D objects should belong to the website's visual language.

Avoid generic:

- chrome blobs
- glowing spheres
- abstract wireframes
- random floating cubes

unless there is a deliberate reason.

## Technical discipline

Prefer:

- reusable scenes
- lazy loading
- disposal of resources
- low-poly/simple geometry when sufficient
- reduced rendering when offscreen
- adaptive quality

3D should never make the website feel broken.
