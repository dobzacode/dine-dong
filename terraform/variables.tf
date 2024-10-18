variable "REGION" {
  type = string
  description = "AWS Region"
}

variable "API_DOMAIN_NAME" {
  type = string
  description = "API Domain Name"
}

variable "DOMAIN_NAME_CERTIFICATE_ARN" {
  type = string
  description = "Domain Name Certificate ARN"
}

# Security Variables
variable "SECURITY__JWT_SECRET_KEY" {
  type = string
  sensitive = true
  description = "JWT Secret Key for Security"
}

variable "SECURITY__BACKEND_CORS_ORIGINS_0" {
  type = string
  sensitive = true
  description = "Allowed CORS origins for the backend API"
}

variable "SECURITY__BACKEND_CORS_ORIGINS_1" {
  type = string
  sensitive = true
  description = "Allowed CORS origins for the backend API"
}

variable "SECURITY__BACKEND_CORS_ORIGINS_2" {
  type = string 
  sensitive = true
  description = "Allowed CORS origins for the backend API"
}

variable "SECURITY__ALLOWED_HOSTS_0" {
  type = string
  sensitive = true
  description = "Allowed hostnames for the application"
}

variable "SECURITY__ALLOWED_HOSTS_1" {
  type = string
  sensitive = true
  description = "Allowed hostnames for the application"
}

variable "SECURITY__ALLOWED_HOSTS_2" {
  type = string
  sensitive = true
  description = "Allowed hostnames for the application"
}

variable "DATABASE__HOSTNAME" {
  type = string
  sensitive = true
  description = "Database hostname"
}

variable "DATABASE__USERNAME" {
  type = string
  sensitive = true
  description = "Database username"
}

variable "DATABASE__PASSWORD" {
  type = string
  sensitive = true
  description = "Database password"
}

variable "DATABASE__PORT" {
  type = string
  description = "Database port"
}

variable "DATABASE__DB" {
  type = string
  description = "Database name"
}

# Auth0 Variables
variable "AUTH0_DOMAIN" {
  type = string
  description = "Auth0 domain"
}

variable "AUTH0_API_AUDIENCE" {
  type = string
  description = "Auth0 API audience"
}

variable "AUTH0_ISSUER" {
  type = string
  description = "Auth0 issuer"
}

variable "AUTH0_ALGORITHMS" {
  type = string
  description = "Auth0 algorithms"
}

# Base URL
variable "BASE_URL" {
  type = string
  description = "Base URL for the application"
}

# Stripe Variables
variable "STRIPE_SECRET_KEY" {
  type = string
  sensitive = true
  description = "Stripe Secret Key"
}

variable "WEBHOOK_SECRET" {
  type = string
  sensitive = true
  description = "Webhook Secret for Stripe"
}

# KV Store Variables
variable "KV_REST_API_URL" {
  type = string
  description = "KV Store REST API URL"
}

variable "KV_REST_API_TOKEN" {
  type = string
  sensitive = true
  description = "KV Store REST API Token"
}

# Axiom Variables
variable "AXIOM_DATASET" {
  type = string
  description = "Axiom dataset name"
}

variable "AXIOM_TOKEN" {
  type = string
  sensitive = true
  description = "Axiom token"
}