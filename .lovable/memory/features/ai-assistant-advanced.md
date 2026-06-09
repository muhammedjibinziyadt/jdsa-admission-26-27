---
name: AI Assistant Advanced
description: Enhanced floating chat with multi-conversation history (localStorage), search, copy/share, markdown rendering, and admin usage stats
type: feature
---
- Conversations stored in localStorage key `aiAssistantConvs:v1`; active id in `aiAssistantActive:v1`.
- History view: searchable conversation list with delete; "+" button creates a new chat.
- Assistant messages render markdown via `react-markdown`; user messages plain text.
- Copy & Share buttons per assistant message (Web Share API w/ clipboard fallback).
- Usage stats: `ai_usage_stats` table + `increment_ai_usage()` RPC called on each user send. Shown in AIAssistantAdmin (total messages, last used).
