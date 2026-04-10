
# Team Development Workflow

## Branch Strategy


The repository follows a structured branching model to ensure stable releases and organized collaboration.

```
main      → production / stable releases
develop   → integration branch
feature/* → new features
fix/*     → bug fixes
chore/*   → maintenance tasks

```

Example branches:

```
feature/event-registration
feature/nextjs-dashboard
fix/login-validation
chore/update-dependencies

```

----------

# Development Process

## 1. Pick a Task

1.  Open the project board.
    
2.  Select an issue from **Backlog** or **Todo**.
    
3.  Assign the issue to yourself.
    
4.  Move the issue to **In Progress**.
    

----------

## 2. Create a Branch

Always branch from `develop`.

```
git checkout develop
git pull origin develop
git checkout -b feature/short-description

```

Example:

```
git checkout -b feature/event-registration

```

----------

## 3. Code and Commit

Work on the assigned issue and commit changes frequently.

Commit message format:

```
type: short description (#issue-number)

```

Examples:

```
feat: implement event registration API (#13)
fix: resolve event capacity validation bug (#21)
refactor: optimize event service logic (#18)

```

Guidelines:

-   Keep commits small and meaningful
    
-   Reference the related issue number
    
-   Avoid vague messages like "update" or "fix"
    

----------

## 4. Push and Create Pull Request

Push the branch:

```
git push origin feature/event-registration

```

Create a Pull Request with:

```
Base branch: develop
Compare branch: feature/event-registration

```

Fill the Pull Request template:

-   Description of changes
    
-   Related Issue (example: `Closes #13`)
    
-   Milestone
    
-   Module affected
    
-   Type of change
    
-   Checklist confirmation
    

Example:

```
Closes #13

```

This automatically closes the issue when the PR is merged.

----------

## 5. Review and Merge

Review process:

1.  Move the issue to **Review** on the project board.
    
2.  Another team member reviews the pull request.
    
3.  Reviewer verifies:
    
    -   functionality
        
    -   code quality
        
    -   absence of conflicts
        
4.  After approval, merge the PR into `develop`.
    

Use **Squash and Merge** to maintain a clean commit history.

----------

## 6. Release to Main

When a milestone is completed:

Create a pull request:

```
develop → main

```

Steps:

1.  Perform final testing
    
2.  Conduct team review
    
3.  Merge into `main`
    

The `main` branch always represents the **stable production version**.

----------

# Creating New Issues

## Bug Report

Use the **Bug Report template**.

Include:

-   description
    
-   steps to reproduce
    
-   expected behavior
    
-   actual behavior
    
-   affected module
    

Label automatically applied:

```
bug

```

----------

## Feature Request

Use the **Feature Request template**.

Include:

-   feature description
    
-   problem the feature solves
    
-   proposed solution
    
-   acceptance criteria
    

Label automatically applied:

```
enhancement

```

----------

## Task

Use the **Task template**.

Include:

-   task description
    
-   module affected
    
-   milestone
    
-   dependencies
    

Label automatically applied:

```
task

```

----------

# Project Board Workflow

Issues move through the following stages:

```
Backlog
   ↓
Todo
   ↓
In Progress
   ↓
Review
   ↓
Done

```

Movement rules:

-   When work starts → move to **In Progress**
    
-   When PR is created → move to **Review**
    
-   When PR is merged → move to **Done**
    

----------

# Team Collaboration Rules

1.  Do not push directly to `main`.
    
2.  Always create branches from `develop`.
    
3.  Every code change must be linked to an issue.
    
4.  All changes must go through pull request review.
    
5.  Use clear commit messages.
    
6.  Update issue status on the project board.
    

----------

# Quick Workflow Summary

```
Pick Issue
    ↓
Create Branch from develop
    ↓
Implement Feature / Fix
    ↓
Commit Changes
    ↓
Push Branch
    ↓
Create Pull Request → develop
    ↓
Code Review
    ↓
Merge into develop
    ↓
Milestone Complete → Merge develop → main

```
