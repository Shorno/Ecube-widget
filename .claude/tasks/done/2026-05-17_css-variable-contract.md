# Task: CSS Variable Contract

**Plan:** [[design-system-and-monitoring]]
**Created:** 2026-05-17
**Status:** completed 2026-05-17

## Objective

Rename widget CSS tokens from --color-primary to --widget-primary (etc.) to fix the naming
collision with Tailwind @theme inline block. Does NOT touch existing widget components.
New designs will use bg-widget-primary, text-widget-text etc.

## Files Involved

- lib/design/catalog.js — TOKEN_MAP css property names
- app/globals.css — :root defaults + @theme aliases
