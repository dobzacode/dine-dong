import boto3  # type: ignore


def set_lambda_environment_variables(lambda_arn, env_variables):
    client = boto3.client("lambda")

    # Get current environment variables
    response = client.get_function_configuration(FunctionName=lambda_arn)
    current_env = response["Environment"].get("Variables", {})

    # Update with new environment variables
    current_env.update(env_variables)

    # Update function configuration
    client.update_function_configuration(
        FunctionName=lambda_arn, Environment={"Variables": current_env}
    )


def load_env_variables_from_file(file_path):
    env_variables = {}
    with open(file_path) as file:
        for line in file:
            if line.strip() and not line.startswith("#"):
                key, value = line.strip().split("=", 1)
                # Remove quotes from value if present
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                env_variables[key] = value
    return env_variables


if __name__ == "__main__":
    lambda_arn = input("Enter the Lambda ARN: ")
    env_file_path = "../.env"
    env_variables = load_env_variables_from_file(env_file_path)
    set_lambda_environment_variables(lambda_arn, env_variables)
    print(f"Environment variables set for Lambda {lambda_arn}")
