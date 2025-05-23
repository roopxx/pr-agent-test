# CodeRabbit Smart Auto-Comments

## Hackathon Project: Save CodeRabbit Billing with Smart Auto-Comments

A GitHub Actions-based solution to save on CodeRabbit billing costs by automatically triggering reviews from a central bot account.

## Problem Solved

We use [@coderabbitai](https://github.com/coderabbitai) for code reviews, but currently, every PR author gets billed when they trigger a review. This project implements a centralized approach where a single bot account triggers the reviews, consolidating the billing to one user.

## Core Features

- **Automated PR Reviews**: Posts @coderabbitai review comments on every new PR
- **Central Bot User**: Uses a designated bot account for all reviews (not the PR author)
- **Cost Efficiency**: Consolidates billing to a single account
- **Rate Limiting**: Prevents excessive triggers (limited to once every 5 minutes)
- **Internal PR Detection**: Automatically detects and skips reviews for organization members
- **Smart Labeling**: Adds appropriate labels based on review outcome

## How It Works

1. A GitHub Actions workflow monitors for new PRs or updates to existing PRs
2. The workflow checks if the PR author is a member of your organization
3. When conditions are met, the workflow comments on the PR using a central bot account
4. The comment "@coderabbitai review" triggers CodeRabbit to review the PR

## Setup Instructions

### 1. Create a Bot Account

1. Create a new GitHub account to act as your bot user (e.g., `your-org-bot`)
2. Ensure this account has appropriate permissions on your repositories
3. Generate a Personal Access Token (PAT) with `repo` and `workflow` scopes

### 2. Configure Repository Secrets

Add the following secrets to your GitHub repository:

- `BOT_TOKEN`: The Personal Access Token (PAT) of your bot user account

### 3. Deploy the Workflow

The GitHub Actions workflow file is already set up in this repository. It will automatically run when PRs are created or updated.

## Advanced Features

### Rate Limiting Implementation
The workflow implements a cooldown period of 5 minutes between triggering reviews on the same PR to prevent excessive billing.

### Internal PR Skipping Logic
The system uses GitHub's API to check organization membership and skip reviews for internal team members, focusing resources on external contributions.

### Labeling System
PRs receive automatic labels based on:
- Source (internal/external)
- File changes (frontend, databases, etc) ref: labeler.yml for more info
- Content analysis (documentation/feature/bugfix)

## Last Updated
April 21, 2025
