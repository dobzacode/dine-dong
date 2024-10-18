 


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

  timeout = 30

  build_in_docker = true
  runtime         = "python3.10"
  docker_image    = "build-python3.10-poetry"
  docker_file     = "${path.module}/../server/Dockerfile"


  artifacts_dir   = "${path.root}/builds/lambda_layer_poetry/"
}


module "lambda_function" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 4.0"

  function_name = "fastapi-prod-${var.REGION}-lambda"
  description   = "Dine Dong API"
  handler       = "app.handler.handler"
  timeout       = 30
  runtime       = "python3.10"
  publish       = true
  create_lambda_function_url = true
  environment_variables = {
    SECURITY__JWT_SECRET_KEY = var.SECURITY__JWT_SECRET_KEY
    SECURITY__BACKEND_CORS_ORIGINS = var.SECURITY__BACKEND_CORS_ORIGINS
    SECURITY__ALLOWED_HOSTS = var.SECURITY__ALLOWED_HOSTS

    DATABASE__HOSTNAME = var.DATABASE__HOSTNAME
    DATABASE__USERNAME = var.DATABASE__USERNAME
    DATABASE__PASSWORD = var.DATABASE__PASSWORD
    DATABASE__PORT = var.DATABASE__PORT
    DATABASE__DB = var.DATABASE__DB

    AUTH0_DOMAIN = var.AUTH0_DOMAIN
    AUTH0_API_AUDIENCE = var.AUTH0_API_AUDIENCE
    AUTH0_ISSUER = var.AUTH0_ISSUER
    AUTH0_ALGORITHMS = var.AUTH0_ALGORITHMS

    BASE_URL = var.BASE_URL

    STRIPE_SECRET_KEY = var.STRIPE_SECRET_KEY
    WEBHOOK_SECRET = var.WEBHOOK_SECRET

    KV_REST_API_URL = var.KV_REST_API_URL
    KV_REST_API_TOKEN = var.KV_REST_API_TOKEN

    AXIOM_DATASET = var.AXIOM_DATASET
    AXIOM_TOKEN = var.AXIOM_TOKEN
  }
    

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
  domain_name           = var.API_DOMAIN_NAME
  domain_name_certificate_arn = var.DOMAIN_NAME_CERTIFICATE_ARN
  
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

