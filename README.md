# CodeRabbit Smart Auto-Comments

A GitHub Actions-based solution to save on CodeRabbit billing costs by automatically triggering reviews from a central bot account.

## Problem Solved

We use [@coderabbitai](https://github.com/coderabbitai) for code reviews, but currently, every PR author gets billed when they trigger a review. This project implements a centralized approach where a single bot account triggers the reviews, consolidating the billing to one user.

## How It Works

1. A GitHub Actions workflow monitors for new PRs or updates to existing PRs
2. The workflow checks if the PR author is a member of your organization
3. When a PR is from an external contributor, the workflow comments on the PR using a central bot account
4. The comment "@coderabbitai review" triggers CodeRabbit to review the PR
5. Labels are automatically added based on the review results
6. Notifications are sent to Slack for visibility

## Features

- **Central Billing**: All reviews triggered by one bot account
- **Rate Limiting**: Prevents excessive triggers (limited to once every 5 minutes)
- **Internal PR Skipping**: Automatically detects and skips reviews for organization members
- **Organization Detection**: Uses GitHub API to accurately identify internal team members
- **Auto-Labeling**: Adds appropriate labels based on review outcome and PR source
- **Slack Notifications**: Sends alerts when reviews are completed
- **Cost Efficient**: Eliminates the need for individual developers to have paid CodeRabbit accounts

## Setup Instructions

### 1. Create a Bot Account

1. Create a new GitHub account to act as your bot user (e.g., `your-org-bot`)
2. Ensure this account has appropriate permissions on your repositories
3. Generate a Personal Access Token (PAT) with `repo` and `workflow` scopes

### 2. Configure Repository Secrets

Add the following secrets to your GitHub repository:

- `BOT_TOKEN`: The Personal Access Token of your bot account
- `SLACK_WEBHOOK_URL`: Your Slack webhook URL for notifications

### 3. Customize Organization Settings

In the workflow file (`.github/workflows/review-trigger.yml`), update the organization name:
```yaml
- name: Check if organization member
  id: is_organization_member
  uses: JamesSingleton/is-organization-member@1.1.0
  with:
    organization: testorg  # Replace with your organization name
    username: ${{ github.event.pull_request.user.login }}
    token: ${{ secrets.GITHUB_TOKEN }}
```

### 4. Deploy the Workflow

The GitHub Actions workflow file is already set up in this repository. It will automatically run when PRs are created or updated.

### 5. Test the Setup

1. Create a test PR from a non-organization member account
2. Verify that the bot account comments on the PR
3. Create a test PR from an organization member account
4. Verify that the PR is labeled as 'internal-pr' and no review is triggered
5. Check that appropriate labels are applied
6. Verify Slack notifications are received

## Customization Options

- Adjust the rate limiting window (currently set to 5 minutes)
- Modify the organization membership check to include specific teams
- Customize labeling criteria based on your team's needs
- Extend the Slack notification format with additional information

## Dashboard (Future Enhancement)

A future enhancement could include a simple dashboard showing:
- Reviews performed per day/week/month
- Average review time
- Common issues identified
- Cost savings compared to individual billing

## Contributing

Feel free to submit PRs to improve this solution!

## License

CID
