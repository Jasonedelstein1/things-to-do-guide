# Project skills

Drop a Claude Code skill here so it travels with the repo (and is available in
Claude Code on the web, which doesn't carry your locally-installed skills).

Layout:

```
.claude/skills/
└── <skill-name>/
    └── SKILL.md      # the skill definition (frontmatter + instructions)
```

To add your UI skill: create a folder named after the skill (e.g.
`.claude/skills/ui-pro-max/`) and paste its `SKILL.md` (plus any supporting
files) inside.

Note: Claude Code discovers skills at session start, so after committing a new
skill you may need to start a fresh web session for it to register.
