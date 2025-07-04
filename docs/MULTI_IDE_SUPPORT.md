# Multi-IDE and AI Assistant Support

## Overview

VibeKit VDK Hub has been redesigned to support multiple IDEs and AI assistants, moving away from the Cursor-specific `.mdc` format to a universal approach that generates optimized outputs for different development environments.

## Universal Rule Format

### Standard Markdown with YAML Frontmatter

Rules are now stored in standard Markdown format with YAML frontmatter (`.md` files):

```markdown
---
title: "React 19 Best Practices"
description: "Modern React patterns and conventions"
tags: ["react", "javascript", "typescript", "frontend"]
compatibility:
  ides: ["cursor", "vscode", "webstorm", "sublime"]
  aiAssistants: ["vdk", "copilot", "codewhisperer", "tabnine"]
  frameworks: ["react", "nextjs", "remix"]
version: "1.0.0"
alwaysApply: false
---

# React 19 Best Practices

## Component Design & Structure

- Prefer functional components with Hooks over class components
  ...
```

### Benefits of Universal Format

1. **IDE Agnostic**: Works with any text editor or IDE
2. **AI Assistant Compatible**: Can be consumed by any AI coding assistant
3. **Human Readable**: Standard markdown format
4. **Extensible**: Easy to add new metadata fields
5. **Version Controlled**: Git-friendly format

## Multi-Format Package Generation

The wizard now generates different formats based on target IDE and AI assistant:

### Cursor IDE Output

- **Format**: `.mdc` files in `.ai/rules/` directory
- **Structure**: Cursor-specific frontmatter format
- **Integration**: Native Cursor AI integration

```bash
# Example Cursor output structure
.ai/
└── rules/
    ├── assistants/
    ├── languages/
    │   └── react-patterns.mdc
    ├── stacks/
    ├── tasks/
    ├── technologies/
    └── tools/
```

### VS Code Output

- **Format**: `.md` files in `.vscode/ai-rules/` directory
- **Structure**: Standard markdown with VS Code instructions
- **Integration**: Compatible with GitHub Copilot, CodeWhisperer, etc.

```bash
# Example VS Code output structure
.vscode/
└── ai-rules/
    ├── assistants/
    ├── languages/
    │   └── react-patterns.md
    ├── stacks/
    ├── tasks/
    ├── technologies/
    └── tools/
```

### JetBrains IDEs Output

- **Format**: `.md` files in `.idea/ai-rules/` directory
- **Structure**: Standard markdown with JetBrains-specific instructions
- **Integration**: Compatible with JetBrains AI Assistant

```bash
# Example JetBrains output structure
.idea/
└── ai-rules/
    ├── assistants/
    ├── languages/
    │   └── react-patterns.md
    ├── stacks/
    ├── tasks/
    ├── technologies/
    └── tools/
```

### General/Universal Output

- **Format**: `.md` files in `docs/coding-rules/` directory
- **Structure**: Standard markdown format
- **Integration**: Compatible with any AI assistant or manual reference

```bash
# Example general output structure
docs/
└── coding-rules/
    ├── assistants/
    ├── languages/
    │   └── react-patterns.md
    ├── stacks/
    ├── tasks/
    ├── technologies/
    └── tools/
```

## Supported IDEs and AI Assistants

### IDEs

- **Cursor**: Native `.mdc` support with AI integration
- **VS Code**: Standard markdown with extension compatibility
- **WebStorm/IntelliJ**: JetBrains AI Assistant compatible
- **General**: Universal markdown format

### AI Assistants

- Cursor's built-in AI assistant
- **GitHub Copilot**: GitHub's AI pair programmer
- **CodeWhisperer**: Amazon's AI coding companion
- **Tabnine**: AI assistant for code completion
- **General**: Compatible with any AI assistant

## Implementation Details

### Rule Conversion Engine

The `RuleGenerationEngine` class handles format conversion:

```typescript
// Convert rule content for specific IDE format
private convertRuleForIDE(rule: MatchedRule, targetIde: string): string {
  switch (targetIde.toLowerCase()) {
    case 'cursor':
      return this.generateMdcFormat(rule);
    case 'vscode':
      return this.generateVSCodeFormat(rule);
    case 'webstorm':
      return this.generateJetBrainsFormat(rule);
    default:
      return this.generateStandardFormat(rule);
  }
}
```

### Directory Structure Generation

Each IDE gets its own directory structure:

```typescript
private getIDESpecificSetup(targetIde: string): string {
  switch (targetIde.toLowerCase()) {
    case 'cursor':
      return 'RULES_DIR=".ai/rules"';
    case 'vscode':
      return 'RULES_DIR=".vscode/ai-rules"';
    case 'webstorm':
      return 'RULES_DIR=".idea/ai-rules"';
    default:
      return 'RULES_DIR="docs/coding-rules"';
  }
}
```

## Usage Instructions

### For Cursor Users

1. Select "Cursor" as target IDE in the wizard
2. Generate package (bash script, ZIP, or config files)
3. Rules will be placed in `.ai/rules/` directory
4. Cursor AI will automatically detect and use the rules

### For VS Code Users

1. Select "VS Code" as target IDE in the wizard
2. Choose your preferred AI assistant (Copilot, CodeWhisperer, etc.)
3. Generate package
4. Rules will be placed in `.vscode/ai-rules/` directory
5. Reference rules in your AI prompts or workspace settings

### For JetBrains IDE Users

1. Select "WebStorm" (or similar) as target IDE in the wizard
2. Generate package
3. Rules will be placed in `.idea/ai-rules/` directory
4. Use with JetBrains AI Assistant or manual reference

### For General Use

1. Select "Other/General" as target IDE in the wizard
2. Generate package
3. Rules will be placed in `docs/coding-rules/` directory
4. Use with any AI assistant or as manual reference

## Migration Path

### From Cursor-Only to Multi-IDE

1. **Phase 1**: Convert existing `.mdc` files to universal `.md` format
2. **Phase 2**: Update sync scripts to handle universal format
3. **Phase 3**: Deploy wizard with multi-IDE support
4. **Phase 4**: Gradually deprecate Cursor-specific endpoints

### Database Schema Updates

The database remains unchanged as it already stores rules in a universal format. The frontmatter parsing needs to be fixed to properly extract metadata from the universal format.

## Best Practices

### Rule Creation

1. Use standard markdown format with YAML frontmatter
2. Include comprehensive compatibility metadata
3. Test rules across multiple IDEs when possible
4. Use semantic tags for better matching

### Package Generation

1. Choose the most specific IDE/AI assistant combination
2. Use bash scripts for automated setup
3. Use ZIP archives for complete project setup
4. Use config files for manual integration

### Team Adoption

1. Standardize on one primary IDE/AI assistant combination
2. Generate team-specific rule packages
3. Version control the generated rules
4. Document team-specific usage patterns

## Future Enhancements

### Planned Features

- **Plugin System**: IDE-specific plugins for better integration
- **Real-time Sync**: Live updates to rules across IDEs
- **Template System**: Pre-built rule templates for common patterns
- **Analytics**: Usage tracking across different IDEs

### API Extensions

- **Rule Validation**: Ensure rules work across target IDEs
- **Format Conversion**: On-demand format conversion
- **Custom Templates**: User-defined rule templates
- **Integration Testing**: Automated testing across IDEs

This multi-IDE approach ensures VibeKit VDK Hub can serve the entire development community, not just Cursor users, while maintaining the quality and specificity that makes the rules effective.
