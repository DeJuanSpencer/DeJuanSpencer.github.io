---
name: agent-team-setup
description: Sets up a full agent team roster and team configuration for any Claude Code project. Use this skill whenever starting a new project, initializing a repo, scaffolding a codebase, or when the user says "set up agents," "add agents," "initialize agents," "set up my team," "add my dev team," or any reference to configuring subagents or agent teams for a project. Also trigger when the user says "new project" and agents aren't yet present in `.claude/agents/`. This skill copies 17 subagent definitions and a team playbook into the project so Claude Code can assemble Build, Research, and Ship teams on demand.
---

# Agent Team Setup

This skill installs a complete agent roster and team configuration into any Claude Code project.

## What It Installs

**17 subagent definitions** into `.claude/agents/`:

| Agent | Model | Role |
|---|---|---|
| `architect` | sonnet | Plans structure, file layout, data flow before code is written |
| `designer` | sonnet | UI/UX decisions, layout, interactions, responsive, accessibility |
| `builder` | sonnet | Writes implementation code from specs |
| `strategist` | sonnet | Prioritizes what to build, synthesizes research |
| `devops` | sonnet | Deploy validation, build debugging, config management |
| `pre-commit-reviewer` | haiku | Reviews git diff for bugs, secrets, debug artifacts |
| `qa` | sonnet | Tests flows, edge cases, error handling |
| `conversion-copy-writer` | sonnet | Reviews user-facing text for conversion |
| `responsive-stress-tester` | haiku | Flags layout issues across breakpoints |
| `design-system-enforcer` | haiku | Checks components against design tokens |
| `trend-radar` | sonnet | Researches industry trends and patterns |
| `feature-gap-analyzer` | sonnet | Surfaces missing features ranked by impact |
| `onboarding-flow-designer` | sonnet | Designs user onboarding sequences |
| `stack-evolution-advisor` | sonnet | Audits dependencies and architecture health |
| `ux-friction-auditor` | sonnet | Identifies drop-off points in user flows |
| `micro-interaction-suggester` | haiku | Suggests animations and feedback patterns |
| `ui-pattern-scout` | sonnet | Finds reusable patterns and best practices |

**Team playbook** (`CLAUDE-AGENT-TEAMS.md`) into the project root, documenting three team configurations:

- **Build Team** (4-5): architect → designer → builder → copy → qa
- **Research Team** (3): trend-radar + feature-gap-analyzer → strategist
- **Ship Team** (3-5): pre-commit-reviewer + qa + responsive-stress-tester + devops + stack-evolution-advisor

## When to Run

- At project initialization (new repo, new Next.js project, new app)
- When the user asks to set up agents or teams
- When `.claude/agents/` doesn't exist or is empty
- When the user references agent teams but no team playbook exists

## Installation Steps

1. Check if `.claude/agents/` exists in the project. If not, create it.
2. Check if `CLAUDE-AGENT-TEAMS.md` exists in the project root. If not, proceed.
3. Run the install script from this skill's `scripts/` directory:

```bash
bash /path/to/agent-team-setup/scripts/install.sh
```

The script will:
- Create `.claude/agents/` if it doesn't exist
- Copy all 17 agent definitions, skipping any that already exist
- Copy `CLAUDE-AGENT-TEAMS.md` to the project root, skipping if it exists
- Report what was installed and what was skipped

Alternatively, you can manually read each agent file from this skill's `agents/` directory and write them to the project's `.claude/agents/` directory using file tools.

**Important:** Never overwrite existing agent files without asking the user first.

## Post-Installation

After installing, remind the user:

1. Agent teams are experimental. Enable them by adding to `settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

2. Individual agents work as subagents without enabling agent teams. They'll be automatically invoked when Claude matches a task to the agent's description.

3. To assemble a team, say things like:
   - "Spin up a build team for [feature]"
   - "Run a research team on [topic]"
   - "Ship team, audit before I push"

## Customization

The `designer` agent includes a default design system (DM Sans, JetBrains Mono, gold/red/violet palette). If the project uses a different design system, update `designer.md` and `design-system-enforcer.md` with the project's actual tokens after installation.

The `devops` agent includes Vercel/Next.js context by default. Update it if the project uses a different hosting or framework setup.

The `strategist` agent uses a specific prioritization filter (compound / demonstrate / close a gap). This filter can be customized per project by editing `strategist.md`.