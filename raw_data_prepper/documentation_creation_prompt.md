===================================================================================
V1
===================================================================================
Act as an Expert Technical Writer and Senior Software Architect. I am providing you with my complete project codebase.

Your mission is to analyze the raw code and generate a comprehensive suite of documentation entirely from scratch.

CRITICAL CONSTRAINTS:

1. Ignore any existing documentation, comments referencing old architecture, or outdated READMEs in the files provided. They contain false data. Derive EVERYTHING strictly from reading and analyzing the current code.
2. Output the documentation in pristine Markdown format.
3. For all diagrams, use Mermaid.js syntax inside markdown code blocks.
4. Clearly label the beginning and end of each file, including its intended file path.

Please generate the following deliverables:

### 1. File: `README.md` (Root Directory)

This should be the landing page for the repository.

- **Project Title & Description:** A clear, concise summary of what the project does based on the code.
- **Tech Stack:** A list of all major languages, frameworks, and libraries detected.
- **Prerequisites & Installation:** Step-by-step instructions on how to install dependencies and run the project locally.
- **Environment Variables:** A table of all required `.env` variables found in the code (do not include actual secrets, just the keys and descriptions).
- **Folder Structure:** A brief tree-view of the project structure.
- **Quick Links:** Links pointing to the Architecture and API docs.

### 2. File: `docs/ARCHITECTURE.md` (Docs Directory)

This must detail the system design and data flows.

- **System Overview:** High-level explanation of how the frontend and backend communicate.
- **Architecture Diagram:** A Mermaid.js graph showing the overall system architecture (client, server, database, external services).
- **Data Flow Diagram:** A Mermaid.js sequence diagram illustrating the primary user journey or core data flow.
- **Database Schema / Models:** A breakdown of the data structures, tables, or collections found in the codebase (include an ERD diagram using Mermaid if applicable).
- **Key Design Patterns:** Note any significant design patterns or architectural decisions evident in the code.

### 3. File: `docs/API_REFERENCE.md` (Docs Directory)

This must cover both Frontend and Backend API contracts.

- **Authentication:** Explain how auth is handled (e.g., JWT, session, headers) based on the middleware/interceptors.
- **Backend Endpoints:** For every route discovered in the backend code, document:
  - HTTP Method & Path (e.g., `POST /api/v1/users`)
  - Description of what it does.
  - Expected Request Payload (Body/Params/Queries) with types.
  - Expected Response Payload (Success & Error cases).
- **Frontend Data Fetching:** Briefly document how the frontend consumes these APIs (e.g., React Query, Axios instances, specific service files).

Take your time to thoroughly digest the codebase before generating the response. If the output is too long, provide the `README.md` and `ARCHITECTURE.md` first, and ask if I am ready for the `API_REFERENCE.md`.

===================================================================================
V2
===================================================================================
Act as an Expert Technical Writer and Senior Software Architect. I am providing you with my complete project codebase.

Your mission is to analyze the raw code and generate a comprehensive suite of documentation entirely from scratch.

CRITICAL CONSTRAINTS:

1. Ignore any existing documentation, comments referencing old architecture, or outdated READMEs in the files provided. They contain false data. Derive EVERYTHING strictly from reading and analyzing the current code.
2. Output the documentation in pristine Markdown format.
3. For all diagrams, use Mermaid.js syntax inside markdown code blocks.
4. Clearly label the beginning and end of each file, including its intended file path.

Please generate the following deliverables:

### 1. File: `README.md` (Root Directory)

This should be the landing page for the repository.

- **Project Title & Description:** A clear, concise summary of what the project does based on the code.
- **Tech Stack:** A list of all major languages, frameworks, and libraries detected.
- **Prerequisites & Installation:** Step-by-step instructions on how to install dependencies and run the project locally.
- **Environment Variables:** A table of all required `.env` variables found in the code (do not include actual secrets, just the keys and descriptions).
- **Folder Structure:** A brief tree-view of the project structure.
- **Quick Links:** Links pointing to the Architecture, API, and Backend Flow docs.

### 2. File: `docs/ARCHITECTURE.md` (Docs Directory)

This must detail the system design and data flows.

- **System Overview:** High-level explanation of how the frontend and backend communicate.
- **Architecture Diagram:** A Mermaid.js graph showing the overall system architecture (client, server, database, external services).
- **Data Flow Diagram:** A Mermaid.js sequence diagram illustrating the primary user journey or core data flow.
- **Database Schema / Models:** A breakdown of the data structures, tables, or collections found in the codebase (include an ERD diagram using Mermaid if applicable).
- **Key Design Patterns:** Note any significant design patterns or architectural decisions evident in the code.

### 3. File: `docs/API_REFERENCE.md` (Docs Directory)

This must cover both Frontend and Backend API contracts.

- **Authentication:** Explain how auth is handled (e.g., JWT, session, headers) based on the middleware/interceptors.
- **Backend Endpoints:** For every route discovered in the backend code, document:
  - HTTP Method & Path (e.g., `POST /api/v1/users`)
  - Description of what it does.
  - Expected Request Payload (Body/Params/Queries) with types.
  - Expected Response Payload (Success & Error cases).
- **Frontend Data Fetching:** Briefly document how the frontend consumes these APIs (e.g., React Query, Axios instances, specific service files).

### 4. File: `docs/BACKEND_FLOW.md` (Docs Directory)

This must detail the internal execution paths and request lifecycle of the backend.

- **Request Lifecycle:** Step-by-step breakdown of how an incoming request moves through middleware, controllers, services, and data access layers.
- **Logic Flow Diagram:** A Mermaid.js flowchart mapping the execution path of a complex or core backend process.
- **Error Handling & Validation:** Explain the centralized error handling strategy and input validation mechanisms.
- **Background Jobs/Tasks:** Document any asynchronous workers, message queues, cron jobs, or caching strategies detected.

Take your time to thoroughly digest the codebase before generating the response. If the output is too long, provide the `README.md` and `ARCHITECTURE.md` first, and ask if I am ready for the `API_REFERENCE.md` and `BACKEND_FLOW.md`.
