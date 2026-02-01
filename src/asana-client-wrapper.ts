import Asana from 'asana';

export class AsanaClientWrapper {
  private workspaces: any;
  private projects: any;
  private tasks: any;
  private stories: any;
  private projectStatuses: any;
  private tags: any;
  private customFieldSettings: any;
  private sections: any;

  constructor(token: string) {
    const client = Asana.ApiClient.instance;
    client.authentications['token'].accessToken = token;

    // Initialize API instances
    this.workspaces = new Asana.WorkspacesApi();
    this.projects = new Asana.ProjectsApi();
    this.tasks = new Asana.TasksApi();
    this.stories = new Asana.StoriesApi();
    this.projectStatuses = new Asana.ProjectStatusesApi();
    this.tags = new Asana.TagsApi();
    this.customFieldSettings = new Asana.CustomFieldSettingsApi();
    this.sections = new Asana.SectionsApi();
  }

  async listWorkspaces(opts: any = {}) {
    const response = await this.workspaces.getWorkspaces(opts);
    return response.data;
  }

  async searchProjects(workspace: string, namePattern: string, archived: boolean = false, opts: any = {}) {
    const response = await this.projects.getProjectsForWorkspace(workspace, {
      archived,
      ...opts
    });
    const pattern = new RegExp(namePattern, 'i');
    return response.data.filter((project: any) => pattern.test(project.name));
  }

  async searchTasks(workspace: string, searchOpts: any = {}) {
    // Extract known parameters
    const {
      text,
      resource_subtype,
      completed,
      is_subtask,
      has_attachment,
      is_blocked,
      is_blocking,
      sort_by,
      sort_ascending,
      opt_fields,
      ...otherOpts
    } = searchOpts;

    // Build search parameters
    const searchParams: any = {
      ...otherOpts // Include any additional filter parameters
    };

    // Map underscore parameter names to dot-notation for Asana API
    // (e.g., sections_all -> sections.all)
    const keyMappings: { [key: string]: string } = {
      portfolios_any: 'portfolios.any',
      assignee_any: 'assignee.any',
      assignee_not: 'assignee.not',
      projects_any: 'projects.any',
      projects_not: 'projects.not',
      projects_all: 'projects.all',
      sections_any: 'sections.any',
      sections_not: 'sections.not',
      sections_all: 'sections.all',
      tags_any: 'tags.any',
      tags_not: 'tags.not',
      tags_all: 'tags.all',
      teams_any: 'teams.any',
      followers_any: 'followers.any',
      followers_not: 'followers.not',
      created_by_any: 'created_by.any',
      created_by_not: 'created_by.not',
      assigned_by_any: 'assigned_by.any',
      assigned_by_not: 'assigned_by.not',
      liked_by_not: 'liked_by.not',
      commented_on_by_not: 'commented_on_by.not',
      due_on_before: 'due_on.before',
      due_on_after: 'due_on.after',
      due_at_before: 'due_at.before',
      due_at_after: 'due_at.after',
      start_on_before: 'start_on.before',
      start_on_after: 'start_on.after',
      created_on_before: 'created_on.before',
      created_on_after: 'created_on.after',
      created_at_before: 'created_at.before',
      created_at_after: 'created_at.after',
      completed_on_before: 'completed_on.before',
      completed_on_after: 'completed_on.after',
      completed_at_before: 'completed_at.before',
      completed_at_after: 'completed_at.after',
      modified_on_before: 'modified_on.before',
      modified_on_after: 'modified_on.after',
      modified_at_before: 'modified_at.before',
      modified_at_after: 'modified_at.after',
    };

    for (const [underscoreKey, dotKey] of Object.entries(keyMappings)) {
      if (searchParams[underscoreKey] !== undefined) {
        searchParams[dotKey] = searchParams[underscoreKey];
        delete searchParams[underscoreKey];
      }
    }

    // Handle custom fields if provided
    if (searchOpts.custom_fields) {
      if ( typeof searchOpts.custom_fields == "string" ) {
        try {
          searchOpts.custom_fields = JSON.parse( searchOpts.custom_fields );
        } catch ( err ) {
          if (err instanceof Error) {
            err.message = "custom_fields must be a JSON object : " + err.message;
          }
          throw err;
        }
      }
      Object.entries(searchOpts.custom_fields).forEach(([key, value]) => {
        searchParams[`custom_fields.${key}`] = value;
      });
      delete searchParams.custom_fields; // Remove the custom_fields object since we've processed it
    }

    // Add optional parameters if provided
    if (text) searchParams.text = text;
    if (resource_subtype) searchParams.resource_subtype = resource_subtype;
    if (completed !== undefined) searchParams.completed = completed;
    if (is_subtask !== undefined) searchParams.is_subtask = is_subtask;
    if (has_attachment !== undefined) searchParams.has_attachment = has_attachment;
    if (is_blocked !== undefined) searchParams.is_blocked = is_blocked;
    if (is_blocking !== undefined) searchParams.is_blocking = is_blocking;
    if (sort_by) searchParams.sort_by = sort_by;
    if (sort_ascending !== undefined) searchParams.sort_ascending = sort_ascending;
    if (opt_fields) searchParams.opt_fields = opt_fields;

    const response = await this.tasks.searchTasksForWorkspace(workspace, searchParams);

    // Transform the response to simplify custom fields if present
    const transformedData = response.data.map((task: any) => {
      if (!task.custom_fields) return task;

      return {
        ...task,
        custom_fields: task.custom_fields.reduce((acc: any, field: any) => {
          const key = `${field.name} (${field.gid})`;
          let value = field.display_value;

          // For enum fields with a value, include the enum option GID
          if (field.type === 'enum' && field.enum_value) {
            value = `${field.display_value} (${field.enum_value.gid})`;
          }

          acc[key] = value;
          return acc;
        }, {})
      };
    });

    return transformedData;
  }

  async getTask(taskId: string, opts: any = {}) {
    const response = await this.tasks.getTask(taskId, opts);
    return response.data;
  }

  async createTask(projectId: string, data: any) {
    // Ensure projects array includes the projectId
    const projects = data.projects || [];
    if (!projects.includes(projectId)) {
      projects.push(projectId);
    }

    const taskData = {
      data: {
        ...data,
        projects,
        // Handle resource_subtype if provided
        resource_subtype: data.resource_subtype || 'default_task',
        // Handle custom_fields if provided
        custom_fields: data.custom_fields || {}
      }
    };

    // If section is specified, use memberships for direct section assignment
    if (data.section) {
      taskData.data.memberships = [
        {
          project: projectId,
          section: data.section
        }
      ];
    }

    const response = await this.tasks.createTask(taskData);
    return response.data;
  }

  async getStoriesForTask(taskId: string, opts: any = {}) {
    const response = await this.stories.getStoriesForTask(taskId, opts);
    return response.data;
  }

  async updateTask(taskId: string, data: any) {
    const body = {
      data: {
        ...data,
        // Handle resource_subtype if provided
        resource_subtype: data.resource_subtype || undefined,
        // Handle custom_fields if provided
        custom_fields: data.custom_fields || undefined
      }
    };
    const opts = {};
    const response = await this.tasks.updateTask(body, taskId, opts);
    return response.data;
  }

  async getProject(projectId: string, opts: any = {}) {
    // Only include opts if opt_fields was actually provided
    const options = opts.opt_fields ? opts : {};
    const response = await this.projects.getProject(projectId, options);
    return response.data;
  }

  async getProjectCustomFieldSettings(projectId: string, opts: any = {}) {
    try {
      const options = {
        limit: 100,
        opt_fields: opts.opt_fields || "custom_field,custom_field.name,custom_field.gid,custom_field.resource_type,custom_field.type,custom_field.description,custom_field.enum_options,custom_field.enum_options.name,custom_field.enum_options.gid,custom_field.enum_options.enabled"
      };

      const response = await this.customFieldSettings.getCustomFieldSettingsForProject(projectId, options);
      return response.data;
    } catch (error) {
      console.error(`Error fetching custom field settings for project ${projectId}:`, error);
      return [];
    }
  }

  async getProjectTaskCounts(projectId: string, opts: any = {}) {
    // Only include opts if opt_fields was actually provided
    const options = opts.opt_fields ? opts : {};
    const response = await this.projects.getTaskCountsForProject(projectId, options);
    return response.data;
  }

  async getProjectSections(projectId: string, opts: any = {}) {
    // Only include opts if opt_fields was actually provided
    const options = opts.opt_fields ? opts : {};
    const sections = new Asana.SectionsApi();
    const response = await sections.getSectionsForProject(projectId, options);
    return response.data;
  }

  async createProject(data: any, opts: any = {}) {
    const options = opts.opt_fields ? opts : {};
    const body = { data };
    const response = await this.projects.createProject(body, options);
    return response.data;
  }

  async createTaskStory(taskId: string, text: string | null = null, opts: any = {}, html_text: string | null = null) {
    const options = opts.opt_fields ? opts : {};
    const data: any = {};

    if (text) {
      data.text = text;
    } else if (html_text) {
      data.html_text = html_text;
    } else {
      throw new Error("Either text or html_text must be provided");
    }

    const body = { data };
    const response = await this.stories.createStoryForTask(body, taskId, options);
    return response.data;
  }

  async addTaskDependencies(taskId: string, dependencies: string[]) {
    const body = {
      data: {
        dependencies: dependencies
      }
    };
    const response = await this.tasks.addDependenciesForTask(body, taskId);
    return response.data;
  }

  async addTaskDependents(taskId: string, dependents: string[]) {
    const body = {
      data: {
        dependents: dependents
      }
    };
    const response = await this.tasks.addDependentsForTask(body, taskId);
    return response.data;
  }

  async createSubtask(parentTaskId: string, data: any, opts: any = {}) {
    const taskData = {
      data: {
        ...data
      }
    };
    const response = await this.tasks.createSubtaskForTask(taskData, parentTaskId, opts);
    return response.data;
  }

  async setParentForTask(data: any, taskId: string, opts: any = {}) {
    const response = await this.tasks.setParentForTask({ data }, taskId, opts);
    return response.data;
  }

  async getProjectStatus(statusId: string, opts: any = {}) {
    const response = await this.projectStatuses.getProjectStatus(statusId, opts);
    return response.data;
  }

  async getProjectStatusesForProject(projectId: string, opts: any = {}) {
    const response = await this.projectStatuses.getProjectStatusesForProject(projectId, opts);
    return response.data;
  }

  async createProjectStatus(projectId: string, data: any) {
    const body = { data };
    const response = await this.projectStatuses.createProjectStatusForProject(body, projectId);
    return response.data;
  }

  async deleteProjectStatus(statusId: string) {
    const response = await this.projectStatuses.deleteProjectStatus(statusId);
    return response.data;
  }

  async getMultipleTasksByGid(taskIds: string[], opts: any = {}) {
    if (taskIds.length > 25) {
      throw new Error("Maximum of 25 task IDs allowed");
    }

    // Use Promise.all to fetch tasks in parallel
    const tasks = await Promise.all(
      taskIds.map(taskId => this.getTask(taskId, opts))
    );

    return tasks;
  }

  async getTasksForTag(tag_gid: string, opts: any = {}) {
    const response = await this.tasks.getTasksForTag(tag_gid, opts);
    return response.data;
  }

  async getTagsForWorkspace(workspace_gid: string, opts: any = {}) {
    const response = await this.tags.getTagsForWorkspace(workspace_gid, opts);
    return response.data;
  }

  async getTag(tag_gid: string, opts: any = {}) {
    const response = await this.tags.getTag(tag_gid, opts);
    return response.data;
  }

  async getTagsForTask(task_gid: string, opts: any = {}) {
    const response = await this.tags.getTagsForTask(task_gid, opts);
    return response.data;
  }

  async updateTag(tag_gid: string, data: any, opts: any = {}) {
    const body = { data };
    const response = await this.tags.updateTag(body, tag_gid, opts);
    return response.data;
  }

  async deleteTag(tag_gid: string) {
    const response = await this.tags.deleteTag(tag_gid);
    return response.data;
  }

  async createTagForWorkspace(workspace_gid: string, data: any, opts: any = {}) {
    const body = { data };
    const response = await this.tags.createTagForWorkspace(body, workspace_gid, opts);
    return response.data;
  }

  async addTagToTask(task_gid: string, tag_gid: string) {
    const body = {
      data: {
        tag: tag_gid
      }
    };
    const response = await this.tasks.addTagForTask(body, task_gid);
    return response.data;
  }

  async removeTagFromTask(task_gid: string, tag_gid: string) {
    const body = {
      data: {
        tag: tag_gid
      }
    };
    const response = await this.tasks.removeTagForTask(body, task_gid);
    return response.data;
  }

  async addProjectToTask(taskId: string, projectId: string, data: any = {}) {
    const body: any = {
      data: {
        project: projectId
      }
    };

    // Add optional positioning parameters if provided
    if (data.section) {
      body.data.section = data.section;
    }
    if (data.insert_after) {
      body.data.insert_after = data.insert_after;
    }
    if (data.insert_before) {
      body.data.insert_before = data.insert_before;
    }

    const response = await this.tasks.addProjectForTask(body, taskId);
    return response.data;
  }

  async removeProjectFromTask(taskId: string, projectId: string) {
    const body = {
      data: {
        project: projectId
      }
    };
    const response = await this.tasks.removeProjectForTask(body, taskId);
    return response.data;
  }

  async deleteTask(taskId: string) {
    const response = await this.tasks.deleteTask(taskId);
    return response.data;
  }

  // Batch operations (using parallel Promise.all for reliability)
  async batchCreateTasks(projectId: string, tasks: any[], continueOnError: boolean = false): Promise<any[]> {
    if (tasks.length > 150) {
      throw new Error("Maximum of 150 tasks can be created in a single batch");
    }

    if (tasks.length === 0) {
      return [];
    }

    const results = [];

    for (let i = 0; i < tasks.length; i++) {
      try {
        const result = await this.createTask(projectId, tasks[i]);

        // Verify the result contains a valid task
        if (result && result.gid && result.resource_type === 'task') {
          results.push({
            index: i,
            success: true,
            status: 201,
            data: result,
            error: null
          });
        } else {
          // Result doesn't look like a valid task
          const errorResult = {
            index: i,
            success: false,
            status: 500,
            data: null,
            error: 'Invalid response from task creation'
          };

          if (!continueOnError) {
            throw new Error('Invalid response from task creation');
          }

          results.push(errorResult);
        }
      } catch (error) {
        const errorObj = error as any;

        // Check if the error contains a successful task response
        if (errorObj && errorObj.data && errorObj.data.gid && errorObj.data.resource_type === 'task') {
          results.push({
            index: i,
            success: true,
            status: 201,
            data: errorObj.data,
            error: null
          });
        } else {
          // Genuine error
          const errorResult = {
            index: i,
            success: false,
            status: errorObj?.status || 500,
            data: null,
            error: error instanceof Error ? error.message : String(error)
          };

          if (!continueOnError) {
            throw error;
          }

          results.push(errorResult);
        }
      }
    }

    return results;
  }

  async batchUpdateTasks(taskUpdates: any[], continueOnError: boolean = false): Promise<any[]> {
    if (taskUpdates.length > 150) {
      throw new Error("Maximum of 150 tasks can be updated in a single batch");
    }

    if (taskUpdates.length === 0) {
      return [];
    }

    const results = [];

    for (let i = 0; i < taskUpdates.length; i++) {
      const { task_id, ...updateData } = taskUpdates[i];
      try {
        const result = await this.updateTask(task_id, updateData);

        // Verify the result contains a valid task
        if (result && result.gid && result.resource_type === 'task') {
          results.push({
            index: i,
            success: true,
            status: 200,
            data: result,
            error: null
          });
        } else {
          const errorResult = {
            index: i,
            success: false,
            status: 500,
            data: null,
            error: 'Invalid response from task update'
          };

          if (!continueOnError) {
            throw new Error('Invalid response from task update');
          }

          results.push(errorResult);
        }
      } catch (error) {
        const errorObj = error as any;

        // Check if the error contains a successful task response
        if (errorObj && errorObj.data && errorObj.data.gid && errorObj.data.resource_type === 'task') {
          results.push({
            index: i,
            success: true,
            status: 200,
            data: errorObj.data,
            error: null
          });
        } else {
          const errorResult = {
            index: i,
            success: false,
            status: errorObj?.status || 500,
            data: null,
            error: error instanceof Error ? error.message : String(error)
          };

          if (!continueOnError) {
            throw error;
          }

          results.push(errorResult);
        }
      }
    }

    return results;
  }

  async batchCreateSubtasks(subtasks: any[], continueOnError: boolean = false): Promise<any[]> {
    if (subtasks.length > 150) {
      throw new Error("Maximum of 150 subtasks can be created in a single batch");
    }

    if (subtasks.length === 0) {
      return [];
    }

    const results = [];

    for (let i = 0; i < subtasks.length; i++) {
      const { parent_task_id, ...subtaskData } = subtasks[i];
      try {
        const result = await this.createSubtask(parent_task_id, subtaskData, {});

        // Verify the result contains a valid task
        if (result && result.gid && result.resource_type === 'task') {
          results.push({
            index: i,
            success: true,
            status: 201,
            data: result,
            error: null
          });
        } else {
          const errorResult = {
            index: i,
            success: false,
            status: 500,
            data: null,
            error: 'Invalid response from subtask creation'
          };

          if (!continueOnError) {
            throw new Error('Invalid response from subtask creation');
          }

          results.push(errorResult);
        }
      } catch (error) {
        const errorObj = error as any;

        // Check if the error contains a successful task response
        if (errorObj && errorObj.data && errorObj.data.gid && errorObj.data.resource_type === 'task') {
          results.push({
            index: i,
            success: true,
            status: 201,
            data: errorObj.data,
            error: null
          });
        } else {
          const errorResult = {
            index: i,
            success: false,
            status: errorObj?.status || 500,
            data: null,
            error: error instanceof Error ? error.message : String(error)
          };

          if (!continueOnError) {
            throw error;
          }

          results.push(errorResult);
        }
      }
    }

    return results;
  }

  async batchDeleteTasks(taskIds: string[], continueOnError: boolean = false): Promise<any[]> {
    if (taskIds.length > 150) {
      throw new Error("Maximum of 150 tasks can be deleted in a single batch");
    }

    if (taskIds.length === 0) {
      return [];
    }

    const results = [];

    for (let i = 0; i < taskIds.length; i++) {
      try {
        await this.deleteTask(taskIds[i]);
        results.push({
          index: i,
          success: true,
          status: 204, // DELETE operations typically return 204 on success
          data: null,
          error: null
        });
      } catch (error) {
        const errorObj = error as any;

        // For delete operations, check if it's actually a successful response
        if (errorObj && errorObj.status === 404) {
          // Task already deleted or doesn't exist - consider this success
          results.push({
            index: i,
            success: true,
            status: 204,
            data: null,
            error: null
          });
        } else {
          const errorResult = {
            index: i,
            success: false,
            status: errorObj?.status || 500,
            data: null,
            error: error instanceof Error ? error.message : String(error)
          };

          if (!continueOnError) {
            throw error;
          }

          results.push(errorResult);
        }
      }
    }

    return results;
  }

  // Create task with optional subtasks in a single operation
  async createTaskWithSubtasks(
    projectId: string,
    taskData: any,
    subtasks?: any[], // Made optional
    continueOnError: boolean = false
  ): Promise<any> {
    // 1. Create the main task (could be regular task, milestone, section, etc.)
    const mainTask = await this.createTask(projectId, taskData);

    if (!mainTask?.gid) {
      throw new Error("Failed to create task");
    }

    // 2. If no subtasks provided, return just the main task
    if (!subtasks || subtasks.length === 0) {
      return {
        task: mainTask,
        subtasks: [],
        summary: {
          total_subtasks: 0,
          successful_subtasks: 0,
          failed_subtasks: 0
        }
      };
    }

    // 3. Create all subtasks if provided
    const subtaskResults = [];
    for (const subtaskData of subtasks) {
      try {
        // Use the dedicated createSubtask method which properly creates subtasks
        const subtask = await this.createSubtask(mainTask.gid, subtaskData);

        subtaskResults.push({
          success: true,
          task: subtask,
          error: null
        });
      } catch (error) {
        const errorResult = {
          success: false,
          task: null,
          error: error instanceof Error ? error.message : String(error)
        };

        if (!continueOnError) {
          throw error;
        }

        subtaskResults.push(errorResult);
      }
    }

    // 4. Return complete result
    return {
      task: mainTask,
      subtasks: subtaskResults,
      summary: {
        total_subtasks: subtasks.length,
        successful_subtasks: subtaskResults.filter(r => r.success).length,
        failed_subtasks: subtaskResults.filter(r => !r.success).length
      }
    };
  }

  async batchCreateTasksWithSubtasks(
    projectId: string,
    tasks: any[],
    continueOnError: boolean = false
  ): Promise<any> {
    // Input validation
    if (tasks.length > 50) {
      throw new Error("Maximum of 50 tasks can be created in a single batch");
    }

    if (tasks.length === 0) {
      return {
        summary: {
          total_tasks: 0,
          successful_tasks: 0,
          failed_tasks: 0
        },
        tasks: []
      };
    }

    // Validate that no task has more than 50 subtasks
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (task.subtasks && task.subtasks.length > 50) {
        throw new Error(`Task at index ${i} has more than 50 subtasks (maximum allowed: 50)`);
      }
    }

    const results = [];
    let successfulTasks = 0;
    let failedTasks = 0;

    // Process each task in the batch
    for (let i = 0; i < tasks.length; i++) {
      const taskData = tasks[i];
      const { subtasks, ...mainTaskData } = taskData;

      try {
        // Use the existing createTaskWithSubtasks method for each task
        const taskResult = await this.createTaskWithSubtasks(
          projectId,
          mainTaskData,
          subtasks,
          continueOnError
        );

        results.push({
          index: i,
          success: true,
          task: taskResult.task,
          subtasks: taskResult.subtasks,
          error: null
        });

        successfulTasks++;
      } catch (error) {
        const errorResult = {
          index: i,
          success: false,
          task: null,
          subtasks: null,
          error: error instanceof Error ? error.message : String(error)
        };

        if (!continueOnError) {
          throw error;
        }

        results.push(errorResult);
        failedTasks++;
      }
    }

    return {
      summary: {
        total_tasks: tasks.length,
        successful_tasks: successfulTasks,
        failed_tasks: failedTasks
      },
      tasks: results
    };
  }

  // Create a section in a project
  async createSection(projectId: string, data: any): Promise<any> {
    // Try direct API call to debug the issue
    const sectionData = {
      name: data.name
    };

    // Handle positioning if specified
    if (data.insert_before) {
      sectionData.insert_before = data.insert_before;
    }
    if (data.insert_after) {
      sectionData.insert_after = data.insert_after;
    }

    // According to Asana API docs, the correct format is:
    // createSectionForProject(project_gid, opts) where opts.body contains the data
    const opts = {
      body: { data: sectionData }
    };

    try {
      const response = await this.sections.createSectionForProject(projectId, opts);
      return response.data;
    } catch (error) {
      console.error('Section creation failed:', error.response?.body || error.message);
      throw error;
    }
  }

  // Update a section name
  async updateSection(sectionId: string, data: any): Promise<any> {
    const updateData = {
      name: data.name
    };

    const opts = {
      body: { data: updateData }
    };

    try {
      const response = await this.sections.updateSection(sectionId, opts);
      return response.data;
    } catch (error) {
      console.error('Section update failed:', error.response?.body || error.message);
      throw error;
    }
  }

  // Delete a section (must be empty)
  async deleteSection(sectionId: string): Promise<any> {
    // First validate that section can be deleted
    await this.validateSectionDeletion(sectionId);

    try {
      const response = await this.sections.deleteSection(sectionId);
      return response.data; // Should be empty object
    } catch (error) {
      console.error('Section deletion failed:', error.response?.body || error.message);
      throw error;
    }
  }

  // Batch section operations
  async sectionOperations(operations: any[], continueOnError: boolean = false): Promise<any> {
    const results = [];

    for (const operation of operations) {
      try {
        let result;

        switch (operation.operation) {
          case 'create':
            result = await this.createSection(operation.project_gid, operation);
            break;

          case 'update':
            if (!operation.section_gid || !operation.name) {
              throw new Error('section_gid and name are required for update operations');
            }
            result = await this.updateSection(operation.section_gid, { name: operation.name });
            break;

          case 'delete':
            if (!operation.section_gid) {
              throw new Error('section_gid is required for delete operations');
            }
            result = await this.deleteSection(operation.section_gid);
            break;

          default:
            throw new Error(`Unknown operation: ${operation.operation}`);
        }

        results.push({
          success: true,
          operation: operation.operation,
          data: result,
          error: null
        });

      } catch (error) {
        const errorResult = {
          success: false,
          operation: operation.operation,
          data: null,
          error: error instanceof Error ? error.message : String(error)
        };

        if (!continueOnError) {
          throw error;
        }

        results.push(errorResult);
      }
    }

    return {
      summary: {
        total_operations: operations.length,
        successful_operations: results.filter(r => r.success).length,
        failed_operations: results.filter(r => !r.success).length
      },
      results
    };
  }

  // Validate section deletion constraints
  private async validateSectionDeletion(sectionId: string): Promise<void> {
    try {
      // Check if section exists and can be deleted
      const sectionResponse = await this.sections.getSection(sectionId);
      const section = sectionResponse.data;

      // Get all tasks in the section
      const tasksResponse = await this.tasks.getTasks({ section: sectionId, limit: 1 });
      if (tasksResponse.data.length > 0) {
        throw new Error('Cannot delete section: section is not empty. Please move or delete all tasks first.');
      }

      // Check if this is the last section in the project
      const projectSectionsResponse = await this.sections.getSectionsForProject(section.project.gid);
      if (projectSectionsResponse.data.length <= 1) {
        throw new Error('Cannot delete section: this is the last remaining section in the project.');
      }

    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Section not found or access denied');
      }
      throw error;
    }
  }

}
