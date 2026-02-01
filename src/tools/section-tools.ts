import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const sectionOperationsTool: Tool = {
  name: "asana_section_operations",
  description: "Manage Asana project sections: create new sections, update section names, or delete empty sections. Supports batch operations for efficient section management.",
  inputSchema: {
    type: "object",
    properties: {
      operations: {
        type: "array",
        description: "Array of section operations to perform",
        items: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: ["create", "update", "delete"],
              description: "Operation type: create new section, update existing section name, or delete empty section"
            },
            section_gid: {
              type: "string",
              description: "Section GID (required for update/delete operations)"
            },
            project_gid: {
              type: "string",
              description: "Project GID (required for create operations)"
            },
            name: {
              type: "string",
              description: "Section name (required for create/update operations)"
            },
            insert_before: {
              type: "string",
              description: "Optional for create: Section GID to insert new section before"
            },
            insert_after: {
              type: "string",
              description: "Optional for create: Section GID to insert new section after"
            }
          },
          required: ["operation"],
          // Conditional requirements based on operation type
          allOf: [
            {
              if: { properties: { operation: { const: "create" } } },
              then: { required: ["project_gid", "name"] }
            },
            {
              if: { properties: { operation: { const: "update" } } },
              then: { required: ["section_gid", "name"] }
            },
            {
              if: { properties: { operation: { const: "delete" } } },
              then: { required: ["section_gid"] }
            }
          ]
        },
        minItems: 1,
        maxItems: 50
      },
      continue_on_error: {
        type: "boolean",
        description: "Continue processing if individual operations fail",
        default: false
      }
    },
    required: ["operations"]
  }
};
