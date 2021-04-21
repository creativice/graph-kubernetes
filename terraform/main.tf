terraform {
  required_version = "~> 0.14"

  required_providers {
    google = {
      source  = "hashicorp/kubernetes-alpha"
      version = "~> 0.3.2"
    }
  }
}

provider "kubernetes" {
  config_path = var.kubernetes_config_path
}
