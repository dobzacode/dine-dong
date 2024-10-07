terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.67"
    }
  }
}

provider "aws" {
  region = var.REGION
}

variable "REGION" {
  description = "Region AWS"
  type        = string
  default     = "eu-west-3"
}

module "lambda_layer_poetry" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 4.0"

  create_layer        = true
  layer_name          = "fastapi-in-aws-lambda-layer"
  compatible_runtimes = ["python3.10"]

  source_path = [
    {
      path           = "${path.root}/../server"
      poetry_install = true
    }
  ]

  build_in_docker = true
  runtime         = "python3.10"
  docker_image    = "build-python3.10-poetry"
  docker_file     = "${path.module}/../server/Dockerfile"
  artifacts_dir   = "${path.root}/builds/lambda_layer_poetry/"
}


module "lambda_function" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 4.0"

  function_name = "fastapi-prod-eu-west-3-lambda"
  description   = "Dine Dong API"
  handler       = "app.handler.handler"
  runtime       = "python3.10"
  publish       = true
  create_lambda_function_url = true

  source_path = "${path.root}/../server"

  artifacts_dir   = "${path.root}/builds/lambda_function/"

  build_in_docker = true
  docker_image    = "build-python3.10-poetry"
  docker_file     = "${path.module}/../server/Dockerfile"

  layers = [
    module.lambda_layer_poetry.lambda_layer_arn,
  ]

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }

}

module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "~> 2.0"

  name          = "app-prod-apigateway"
  description   = "Dine Dong API Gateway"
  protocol_type = "HTTP"

  create_api_domain_name = true
  domain_name = "dine-dong.fr"
  domain_name_certificate_arn = "arn:aws:acm:eu-west-3:556234189812:certificate/9178bbc1-99a3-44ea-b2f4-16e7c14dbe9c"
  
  cors_configuration = {
    allow_headers = ["*"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  integrations = {
    "ANY /api/{proxy+}" = {
      payload_format_version = "2.0"
      lambda_arn       = module.lambda_function.lambda_function_arn
    }
    
  "ANY /{proxy+}" = {
      integration_type = "HTTP_PROXY"
      integration_uri  = "http://13.39.15.59"
  }
  
  }
}



output "apigateway_url" {
  description = "Api Gateway URL"
  value       = module.api_gateway.apigatewayv2_api_api_endpoint
}

output "lambda_function_invoke_arn" {
  description = "The Invoke ARN of the Lambda Function"
  value       = module.lambda_function.lambda_function_invoke_arn
}

output "lambda_function_url" {
  description = "Lambda URL"
  value       = module.lambda_function.lambda_function_url
}

