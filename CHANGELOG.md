# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-01-30

### Fixed

- Moved `jsdom` from `devDependencies` to `dependencies` to fix ERR_MODULE_NOT_FOUND error when running via npx

## [1.0.0] - 2026-01-29

### Added

#### Major New Features

- `asana_section_operations`: Unified section management tool supporting create, update, and delete operations in batch (max 50 operations)
- `asana_batch_create_tasks_with_subtasks`: Create multiple tasks with individual subtasks in single operation (max 50 tasks total, up to 50 subtasks per task)
- `asana_create_task_with_subtasks`: Universal task creation tool supporting any task type with optional subtasks (max 50 subtasks)

#### Security & Access Control

- **Selective Tool Activation**: Configure which tools are available using `--enabled-tool-categories` or `--enabled-tools` parameters for role-based access control
- **Read-Only Mode**: Environment variable `READ_ONLY_MODE=true` disables all write operations for testing, audits, or restricted environments
- Tool categorization system with 10 categories: workspaces, projects, project-status, tasks, subtasks, batch, dependencies, stories, tags, sections

#### Performance Enhancements

- Direct section assignment during task creation using Asana's memberships property (eliminates separate API calls)
- Increased batch operation limits to 150 operations per batch (aligned with Asana's free tier rate limit of 150 requests/minute)
- Enhanced batch processing across all batch tools: `asana_batch_create_tasks`, `asana_batch_update_tasks`, `asana_batch_create_subtasks`, `asana_batch_delete_tasks`

#### Robustness & Validation

- Enhanced error handling with `continue_on_error` support for resilient batch operations
- Comprehensive input validation and improved error messages for all API operations

#### Documentation & Planning

- Comprehensive implementation plans for all major features
- Enhanced tool documentation with detailed parameter specifications
- Professional documentation standards and testing procedures

### Fixed

- Resource subtype validation corrected (removed invalid "section" subtype for tasks)
- API parameter mapping improvements for search filters
- Section creation API parameter format corrected

### Inherited Features

This release builds upon the foundation of [roychri/mcp-server-asana](https://github.com/roychri/mcp-server-asana), incorporating all existing MCP server functionality for Asana API integration including core task management, project operations, custom fields, and MCP resources.

[unreleased]: https://github.com/n0zer0d4y/asana-project-ops/compare/v1.0.1..HEAD
[1.0.1]: https://github.com/n0zer0d4y/asana-project-ops/compare/v1.0.0..v1.0.1
[1.0.0]: https://github.com/n0zer0d4y/asana-project-ops/releases/tag/v1.0.0
