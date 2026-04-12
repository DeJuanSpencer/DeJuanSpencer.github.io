#!/bin/bash
# Agent Team Setup - Install Script
# Copies agent definitions and team playbook into the current project.
# Does NOT overwrite existing agent files.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(pwd)"
AGENTS_DIR="$PROJECT_ROOT/.claude/agents"

echo "=== Agent Team Setup ==="
echo ""

# Create .claude/agents if it doesn't exist
if [ ! -d "$AGENTS_DIR" ]; then
    mkdir -p "$AGENTS_DIR"
    echo "Created .claude/agents/"
fi

# Copy agent files (skip existing)
INSTALLED=0
SKIPPED=0
for agent_file in "$SKILL_DIR"/agents/*.md; do
    filename=$(basename "$agent_file")
    if [ -f "$AGENTS_DIR/$filename" ]; then
        echo "  SKIP  $filename (already exists)"
        SKIPPED=$((SKIPPED + 1))
    else
        cp "$agent_file" "$AGENTS_DIR/$filename"
        echo "  ADD   $filename"
        INSTALLED=$((INSTALLED + 1))
    fi
done

# Copy team playbook (skip if exists)
if [ -f "$PROJECT_ROOT/CLAUDE-AGENT-TEAMS.md" ]; then
    echo "  SKIP  CLAUDE-AGENT-TEAMS.md (already exists)"
    SKIPPED=$((SKIPPED + 1))
else
    cp "$SKILL_DIR/CLAUDE-AGENT-TEAMS.md" "$PROJECT_ROOT/CLAUDE-AGENT-TEAMS.md"
    echo "  ADD   CLAUDE-AGENT-TEAMS.md"
    INSTALLED=$((INSTALLED + 1))
fi

echo ""
echo "Done. $INSTALLED files installed, $SKIPPED skipped."
echo ""

if [ $INSTALLED -gt 0 ]; then
    echo "Next steps:"
    echo "  1. Enable agent teams in settings.json:"
    echo '     { "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }'
    echo "  2. Update designer.md and design-system-enforcer.md with your project's design tokens"
    echo "  3. Update devops.md with your hosting/framework setup"
    echo "  4. Say 'spin up a build team' to get started"
fi