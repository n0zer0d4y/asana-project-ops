# BASIC WORKFLOW GUIDE: Project & Task Management

This guide provides end-to-end workflows for common Asana project and task management scenarios using the Asana Project Ops MCP Server. It covers the essential tools and tool categories needed for typical daily operations.

## Table of Contents

- [Quick Start Setup](#quick-start-setup)
- [Project Management Workflows](#project-management-workflows)
- [Task Management Workflows](#task-management-workflows)
- [Advanced Task Operations](#advanced-task-operations)
- [Organization & Maintenance](#organization--maintenance)
- [Tool Category Recommendations](#tool-category-recommendations)

## Quick Start Setup

### Recommended Tools for Most Users

For general project and task management, enable these **specific tools** (not entire categories, to avoid cognitive overload):

```bash
# Core batch operations for efficient workflow
--enabled-tools "asana_batch_create_tasks_with_subtasks,asana_batch_create_tasks,asana_batch_update_tasks,asana_create_project"
```

**Why these specific tools:**

- `asana_batch_create_tasks_with_subtasks` - Create multiple tasks with subtasks in one operation
- `asana_batch_create_tasks` - Create multiple tasks efficiently
- `asana_batch_update_tasks` - Update multiple tasks simultaneously
- `asana_create_project` - Set up project structure

### Advanced Setup (For Power Users)

```bash
# Full batch-first workflow with additional capabilities
--enabled-tools "asana_batch_create_tasks_with_subtasks,asana_batch_create_tasks,asana_batch_update_tasks,asana_batch_create_subtasks,asana_batch_delete_tasks,asana_create_project,asana_section_operations"
```

**Additional tools for comprehensive management:**

- `asana_batch_create_subtasks` - Add subtasks to multiple parent tasks
- `asana_batch_delete_tasks` - Clean up multiple tasks
- `asana_section_operations` - Organize project sections

## Project Management Workflows

### 1. Creating a New Project

**Goal:** Set up a new project with basic structure.

**Required Tools:** `projects`

**Workflow:**

```bash
# 1. Create the project
Project created with ID: 1201234567890

# 2. Optional: Get project details to verify
Project details retrieved successfully

# 3. Optional: Create sections for organization
Section "Planning" created
Section "In Progress" created
Section "Review" created
Section "Done" created
```

**AI Agent Commands:**

- _"Create a new project called 'Q4 Marketing Campaign'"_
- _"Set up a project with sections for To Do, In Progress, and Done"_

### 2. Project Status Updates

**Goal:** Keep stakeholders informed with project progress.

**Required Tools:** `project-status`

**Workflow:**

```bash
# Create status updates for different project phases
Status update created: "Planning phase completed, moving to development"
Status update created: "Beta version released, gathering feedback"
```

**AI Agent Commands:**

- _"Post a project status update saying 'Sprint planning completed'"_
- _"Update the project status with current progress"_

## Task Management Workflows

### 1. Batch Task Creation (Recommended)

**Goal:** Create multiple tasks efficiently, just like drafting a task list.

**Required Tools:** `asana_batch_create_tasks_with_subtasks` (preferred), `asana_batch_create_tasks`

**Workflow:**

```bash
# Plan your tasks first (typical human workflow)
# 1. Draft your task list mentally or on paper
# 2. Create all tasks in one batch operation

# Example: Create sprint tasks with subtasks
Sprint tasks created:
├── "Implement user login" (ID: 1201234567891)
│   ├── "Create login form" (ID: 1201234567892)
│   ├── "Add password validation" (ID: 1201234567893)
│   └── "Test login flow" (ID: 1201234567894)
├── "Design dashboard" (ID: 1201234567895)
│   ├── "Wireframe layout" (ID: 1201234567896)
│   ├── "Create mockups" (ID: 1201234567897)
│   └── "Get stakeholder approval" (ID: 1201234567898)
└── "Write documentation" (ID: 1201234567899)
    ├── "API docs" (ID: 1201234567900)
    └── "User guide" (ID: 1201234567901)
```

**Why batch operations:**

- **Efficiency:** Create multiple tasks in one API call
- **Atomic:** All tasks succeed or fail together
- **Planning:** Matches how humans think (draft list → execute)
- **Subtasks:** Include subtasks in the same operation

**AI Agent Commands:**

- _"Create these 5 tasks for the sprint: User auth, Dashboard design, API integration, Testing, Documentation"_
- _"Set up my weekly tasks: Monday meeting prep, Code reviews, Client calls, Report writing, Team standup"_
- _"Plan the product launch tasks with subtasks for each phase"_

### 2. Batch Task Updates (Recommended)

**Goal:** Update multiple tasks efficiently, just like checking off a task list.

**Required Tools:** `asana_batch_update_tasks` (preferred), individual task tools for single updates

**Workflow:**

```bash
# Typical workflow: Review and update multiple tasks at once
# 1. Check current status of all sprint tasks
# 2. Update multiple tasks in one batch operation

# Example: Update sprint progress
Batch update completed:
├── "Implement user login" → Status: completed
├── "Design dashboard" → Due date: 2026-02-18
├── "Write documentation" → Assignee: Sarah
└── "API integration" → Priority: high

# All updates applied in single operation
```

**Why batch updates:**

- **Bulk efficiency:** Update 10 tasks in 1 API call vs 10 separate calls
- **Consistency:** Apply same changes to multiple related tasks
- **Progress tracking:** Update entire work streams simultaneously
- **Status meetings:** Quickly update all tasks discussed

**AI Agent Commands:**

- _"Mark all completed tasks from today's standup as done"_
- _"Update due dates for all sprint tasks to next week"_
- _"Change assignee for all design tasks to the new team member"_
- _"Update priority to high for all blocking tasks"_

### 3. Task Comments and Communication

**Goal:** Maintain communication threads on tasks.

**Required Tools:** `stories`

**Workflow:**

```bash
# Add comments to tasks
Comment added: "Initial design looks good, proceeding with implementation"

# System automatically adds creation/update notes
Task creation noted in activity feed

# Comments appear in task activity
All stakeholders can see communication history
```

**AI Agent Commands:**

- _"Add a comment to task X saying 'Design approved, ready for development'"_
- _"Post an update on the current task status"_

## Advanced Task Operations

### 1. Batch Subtask Creation (Recommended)

**Goal:** Create tasks with subtasks in one operation, matching how humans plan complex work.

**Required Tools:** `asana_batch_create_tasks_with_subtasks` (preferred), `asana_batch_create_subtasks` for adding to existing tasks

**Workflow:**

```bash
# Most efficient: Plan task + subtasks together
# This matches how humans think: "I need to implement dashboard with these 4 steps"

# Example: Create feature development with subtasks in one operation
Feature tasks created:
├── "Implement user dashboard" (ID: 1201234567891)
│   ├── "Design dashboard layout" (ID: 1201234567892)
│   ├── "Implement data fetching" (ID: 1201234567893)
│   ├── "Add interactive elements" (ID: 1201234567894)
│   └── "Write unit tests" (ID: 1201234567895)
├── "Update documentation" (ID: 1201234567896)
│   ├── "API reference" (ID: 1201234567897)
│   └── "User guide updates" (ID: 1201234567898)

# Progress tracking built-in
Parent tasks automatically show completion percentage as subtasks are done
```

**Why create tasks with subtasks together:**

- **Planning efficiency:** Design entire task breakdown upfront
- **Single operation:** No separate calls for parent + subtasks
- **Atomic creation:** All tasks succeed or fail together
- **Progress tracking:** Built-in completion percentage

**AI Agent Commands:**

- _"Create the sprint backlog with tasks and subtasks: User auth (login, validation, security), Dashboard (design, data, charts), API (endpoints, docs)"_
- _"Set up my project plan: Phase 1 (research, planning, requirements), Phase 2 (design, development, testing)"_
- _"Break down 'Website launch' into tasks with subtasks for each department"_

### 2. Task Dependencies

**Goal:** Ensure proper task sequencing.

**Required Tools:** `dependencies`

**Workflow:**

```bash
# Set up task dependencies
Task A must be completed before Task B can start

# System prevents starting dependent tasks prematurely
Cannot start "Deploy to production" until "Testing completed"

# Visual dependency indicators in Asana
Tasks show dependency relationships clearly
```

**AI Agent Commands:**

- _"Make task A a dependency of task B"_
- _"Set up dependencies so testing must complete before deployment"_

### 3. Task Organization with Tags

**Goal:** Categorize and filter tasks effectively.

**Required Tools:** `tags`

**Workflow:**

```bash
# Create tags for categorization
Tag "urgent" created
Tag "backend" created
Tag "frontend" created

# Apply tags to tasks
Task tagged with "urgent" and "backend"

# Filter tasks by tags
Show only tasks tagged "urgent"

# Remove tags when no longer needed
Tag "completed" removed from task
```

**AI Agent Commands:**

- _"Tag this task as 'high-priority'"_
- _"Create a new tag called 'bug-fix'"_
- _"Show me all tasks tagged 'frontend'"_

### 4. Section Management

**Goal:** Organize tasks within projects.

**Required Tools:** `sections`

**Workflow:**

```bash
# Move tasks between sections
Task moved from "To Do" to "In Progress"

# Reorganize project structure
Section "Review" moved before "Done"

# Create new sections as needed
Section "On Hold" created for paused work

# Clean up empty sections
Unused section removed
```

**AI Agent Commands:**

- _"Move the 'Logo design' task to the 'Review' section"_
- _"Create a new section called 'Backlog' in the project"_
- _"Reorganize the sections so 'Testing' comes before 'Deployment'"_

## Organization & Maintenance

### 1. Bulk Operations

**Goal:** Efficiently manage multiple tasks at once.

**Required Tools:** `batch`

**Workflow:**

```bash
# Update multiple tasks simultaneously
5 tasks updated with new due dates

# Create multiple tasks at once
3 new user stories added to backlog

# Bulk status changes
10 tasks marked as completed

# Mass tag application
All sprint tasks tagged appropriately
```

**AI Agent Commands:**

- _"Update all tasks in the 'Development' section to be due next Friday"_
- _"Create 5 tasks for the user story breakdown"_
- _"Mark all completed tasks in this section as done"_

### 2. Regular Maintenance Tasks

**Weekly/Monthly Tasks:**

- Review and update task due dates
- Archive completed projects
- Clean up unused tags
- Reorganize project sections
- Update project status reports

## Tool Category Recommendations

### For Different User Types:

#### **Project Manager**

```bash
--enabled-tools "asana_batch_create_tasks_with_subtasks,asana_batch_update_tasks,asana_create_project,asana_section_operations"
```

_Focus:_ Project setup, bulk task creation, organization

#### **Team Lead/Developer**

```bash
--enabled-tools "asana_batch_create_tasks_with_subtasks,asana_batch_create_subtasks,asana_batch_update_tasks"
```

_Focus:_ Sprint planning, task breakdown, progress updates

#### **Basic User**

```bash
--enabled-tools "asana_batch_create_tasks_with_subtasks,asana_batch_update_tasks"
```

_Focus:_ Simple task creation and updates using batch operations

#### **Power User**

```bash
--enabled-tools "asana_batch_create_tasks_with_subtasks,asana_batch_create_tasks,asana_batch_update_tasks,asana_batch_create_subtasks,asana_batch_delete_tasks,asana_create_project,asana_section_operations"
```

_Focus:_ Full control over all batch operations and project management

### Recommended Tool Explanations:

- **`asana_batch_create_tasks_with_subtasks`** - **MOST IMPORTANT**: Create multiple tasks with subtasks in one operation. Use this for planning sessions.
- **`asana_batch_create_tasks`** - Create multiple tasks without subtasks. Use when you have a simple task list.
- **`asana_batch_update_tasks`** - Update multiple tasks simultaneously. Perfect for status meetings and bulk updates.
- **`asana_batch_create_subtasks`** - Add subtasks to existing parent tasks in bulk.
- **`asana_batch_delete_tasks`** - Clean up multiple completed or obsolete tasks.
- **`asana_create_project`** - Set up new projects with basic configuration.
- **`asana_section_operations`** - Organize projects with sections for workflow management.

**Priority Order for Task Creation:**

1. `asana_batch_create_tasks_with_subtasks` - For complex planning with subtasks
2. `asana_batch_create_tasks` - For simple task lists
3. Individual task tools - Only for single, urgent tasks

## Best Practices

### 1. Plan in Batches

Think like a project manager: draft your task list first, then create all tasks at once using `asana_batch_create_tasks_with_subtasks`. This matches how humans naturally plan work.

### 2. Always Use Batch Operations

**Default to batch tools for any multi-task operations:**

- Creating multiple tasks? → `asana_batch_create_tasks_with_subtasks`
- Updating multiple tasks? → `asana_batch_update_tasks`
- Only use single-task tools for urgent, one-off items

### 3. Leverage AI Agent Intelligence

The AI agent automatically selects efficient batch operations when you describe multiple tasks. Say "create these 5 tasks for the sprint" and it will use the batch tool automatically.

### 4. Regular Batch Updates

Schedule regular "update sessions" where you review and batch-update multiple tasks at once, just like a daily standup or weekly status meeting.

### 5. Clear Communication

Use batch operations for consistent updates across related tasks, keeping teams aligned with comprehensive progress updates.

---

**This guide covers the essential workflows for day-to-day Asana project and task management using the MCP server. For advanced features or custom integrations, refer to the full API documentation.**
