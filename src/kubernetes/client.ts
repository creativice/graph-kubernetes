import * as k8s from '@kubernetes/client-node';
import { IntegrationConfig } from '../config';

export interface ClientOptions {
  config: IntegrationConfig;
}

export abstract class Client {
  public kubeConfig: k8s.KubeConfig;

  constructor() {
    this.kubeConfig = new k8s.KubeConfig();
    // TODO: we can for example authenticate here as we're instantiating a client
  }

  // Or have a specific method for authentication, to make it more separate
  authenticate() {
    this.kubeConfig.loadFromDefault();
  }
}
