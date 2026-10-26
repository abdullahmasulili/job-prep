---
version: alpha
colors:
  canvas: '#f6f7f9'
  surface: '#ffffff'
  ink: '#202733'
  muted: '#5e6878'
  primary: '#315be8'
  primarySoft: '#edf1ff'
  border: '#e2e6ed'
  success: '#16704d'
  danger: '#b42c3b'
typography:
  heading:
    fontFamily: 'Manrope, sans-serif'
    lineHeight: '1.2'
  body:
    fontFamily: 'DM Sans, sans-serif'
    lineHeight: '1.65'
  code:
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace'
    lineHeight: '1.7'
rounded:
  control: '8px'
  panel: '16px'
spacing:
  unit: '4px'
  panel: '28px'
components:
  button:
    height: '44px'
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
  panel:
    rounded: '{rounded.panel}'
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
---

## Overview

Jobprep is a personal study workspace for developers preparing for a role.
The screen's job is to identify the next useful practice activity. Product
register, English locale, global audience. The signature is the numbered
preparation trail: a connected sequence that carries real curriculum order.
Energy 1 / Rhythm 2 / Motion 1. No gradients, decorative illustrations, social
proof, invented progress, or terminal-like page styling.

## Colors

Blue identifies the current action and selection; quiet cool neutrals keep long
reading sessions comfortable. Success and danger are functional feedback colors,
always accompanied by text. Dark theme remaps semantic roles rather than changing
component layout: canvas #141820, surface #1c222d, ink #edf0f7, muted #a9b3c4,
primary #9bb2ff, primarySoft #263457, border #343f50. Primary buttons use dark ink
in dark mode. This file mirrors the accepted values. `src/theme/theme.ts` is the
canonical palette owner: it builds
the Material UI theme and emits the same semantic CSS variables through
`AppTheme`. Shared components consume that theme rather than separate palettes.

## Typography

Manrope's open shapes and firm headings distinguish navigation from long DM Sans
instructions. Locally bundled fonts avoid remote font-fetching at build time.
Code uses a system monospace face because alignment carries meaning. Headings
use fluid sizes; body text starts at 15px and learning content uses 16px.

## Layout

A compact 232px sidebar supports repeat visits. The content column has a 1200px
maximum and varies between overview, sequential path and a focused assessment.
Onboarding pairs the role decision with a compact real curriculum preview; the
role cards are choices, not marketing features. At 1050px the sidebar becomes a
compact top navigation, and at 650px choices and supporting columns stack.
Spacing follows a 4px unit, with 28px desktop panels and 20px mobile panels.
Whitespace separates stages rather than padding empty screen areas.

## Elevation & Depth

Panels sit flat with borders. Only modal dialogs use a shadow to mark foreground
interaction. No floating decorative cards. Global scrollbar colors remain visible;
forced-color mode defers to system colors.

## Shapes

8px control radius, 16px content panel radius. Small pills are restricted to
actual metadata/status. The path's circular index denotes position in a sequence.

## Components

Canonical owners: Material UI owns buttons, radio/checkbox controls, text fields,
tabs, stepper, papers, chips, navigation, progress and dialogs. `ui.tsx` supplies
thin shared Material adapters for app actions and confirmations. `icons.tsx` owns
SVG symbols. Window for frontend, server for backend,
layers for fullstack, checklist for path, chart for measured progress, and sliders
for settings. Each symbol reinforces the adjacent label. Arrow marks navigation
only on the main continue link and path rows. Hover/focus transitions clarify
interaction, with reduced motion respected. Both themes share the same CSS rules.

Token mapping: `src/theme/theme.ts` maps colors.* to Material palette roles and
--canvas/--surface/--ink/--muted/--primary/--primary-soft/--border/--success/--danger
through GlobalStyles. Layout CSS consumes those semantic variables. Typography
and component styles are configured in the Material theme. Redux Toolkit owns the
theme preference and workspace data; the progress controller owns persistence.

## Do's and Don'ts

Use specific actions: Build my path, Continue practice, Check answers, Reset path.
Keep quiz scores, self-review, and completion distinct. Never invent a readiness
rating. Show empty, loading and error states with a recovery action. Preserve
keyboard focus, >=44px targets, accessible contrast and document scrolling.
