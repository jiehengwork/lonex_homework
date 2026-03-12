---
name: skill-spec
description: Provides the official formatting specifications for Gemini CLI Agent Skills to ensure they are correctly detected and activated.
---

# Gemini CLI Skill Formatting Rules

When generating or auditing a Skill for Gemini CLI, you MUST strictly adhere to the following metadata and structural requirements:

## 1. Mandatory Frontmatter (YAML)
The file must start with a YAML block enclosed by triple dashes `---`. This is the only way the CLI parser recognizes the file as a Skill.

- **name**: A unique, slug-style identifier (lowercase, no spaces, e.g., `ts-enforcer`).
- **description**: A concise summary of the skill's purpose. This text is used by the model to decide when to suggest activating the skill.

## 2. File Naming and Location
- **Filename**: Must be exactly `SKILL.md` (all caps).
- **Directory**: Must be placed within a subfolder named after the skill, inside a `.gemini/skills/` directory.
  - *Example:* `.gemini/skills/my-new-skill/SKILL.md`

## 3. Body Content (Instructions)
The content following the second `---` separator should be standard Markdown. Use this space to define:
- **Role**: Who the AI should be when this skill is active.
- **Rules/Constraints**: Clear "Do" and "Do Not" lists (e.g., "Never use `any`").
- **Context**: Specific project details or coding standards to follow.

## 4. Common Pitfalls to Avoid (Strictly Prohibited)
- **No HTML Tags**: Do not use `<description>` or `<instruction>` tags; use Markdown headers (`#`, `##`) instead.
- **No Leading Text**: Do not put any text, comments, or whitespace before the opening `---`.
- **No Special Characters**: Avoid symbols in the `name` field of the frontmatter.

---

# Usage
If the user provides a prompt for a new skill,