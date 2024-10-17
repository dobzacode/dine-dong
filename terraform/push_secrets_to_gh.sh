#!/bin/bash

# Ensure gh CLI is installed
if ! command -v gh &>/dev/null; then
    echo "Error: GitHub CLI (gh) is not installed."
    exit 1
fi

# Load GitHub configuration from .github.env
GITHUB_ENV_FILE=".github.env"

if [ ! -f "$GITHUB_ENV_FILE" ]; then
    echo "Error: Could not find .github.env file at $GITHUB_ENV_FILE"
    exit 1
fi

# Load variables from .github.env
export $(grep -v '^#' "$GITHUB_ENV_FILE" | xargs)

# Check required variables
if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
    echo "Error: OWNER and REPO must be set in .github.env"
    exit 1
fi

# Check if tfvars.json file exists
TFVARS_FILE="terraform.tfvars.json"

if [ ! -f "$TFVARS_FILE" ]; then
    echo "Error: Could not find tfvars.json file at $TFVARS_FILE"
    exit 1
fi

# Authenticate with GitHub if not already authenticated
if ! gh auth status &>/dev/null; then
    echo "You need to authenticate with GitHub CLI."
    gh auth login
fi

# Process secrets from tfvars.json
jq -r 'to_entries | .[] | "\(.key)=\(.value | if type == "array" then tostring | gsub("\\\\"; "") else tostring end)"' "$TFVARS_FILE" | while IFS= read -r line; do
    SECRET_NAME="${line%%=*}"
    SECRET_VALUE="${line#*=}"

    echo "Processing secret: $SECRET_NAME"

    # Set the secret using gh secret set without additional quoting
    echo "$SECRET_VALUE" | xargs echo -n | gh secret set "TF_VAR_$SECRET_NAME" --repo "$OWNER/$REPO" -b -

    if [ $? -eq 0 ]; then
        echo "Secret \"$SECRET_NAME\" created/updated successfully with the value: $SECRET_VALUE"
    else
        echo "Error: Failed to create/update secret \"$SECRET_NAME\"."
    fi
done


