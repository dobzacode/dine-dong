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

# Check if .env file exists
ENV_FILE="terraform.tfvars"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Could not find .env file at $ENV_FILE"
    exit 1
fi

# Authenticate with GitHub if not already authenticated
if ! gh auth status &>/dev/null; then
    echo "You need to authenticate with GitHub CLI."
    gh auth login
fi

# Process secrets from .env file
grep -v '^#' "$ENV_FILE" | grep -v '^\s*$' | while IFS= read -r line; do
    SECRET_NAME="${line%%=*}"
    SECRET_VALUE="${line#*=}"

    # Remove leading and trailing double quotes from SECRET_VALUE
    SECRET_VALUE="${SECRET_VALUE%\"}"
    SECRET_VALUE="${SECRET_VALUE#\"}"

    PREFIXED_SECRET_NAME="TF_VAR_$SECRET_NAME"

    echo "Processing secret: $SECRET_NAME"

    # Set the prefixed secret using gh secret set
    echo "$SECRET_VALUE" | xargs echo -n | gh secret set "$PREFIXED_SECRET_NAME" --repo "$OWNER/$REPO" -b -

    if [ $? -eq 0 ]; then
        echo "Secret \"$PREFIXED_SECRET_NAME\" created/updated successfully with the value: $SECRET_VALUE"
    else
        echo "Error: Failed to create/update secret \"$PREFIXED_SECRET_NAME\"."
    fi
done