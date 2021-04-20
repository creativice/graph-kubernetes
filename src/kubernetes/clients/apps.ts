import * as k8s from '@kubernetes/client-node';
import { IntegrationConfig } from '../../config';
import { Client } from '../client';

export class AppsClient extends Client {
  private client: k8s.AppsV1Api;

  // TODO: eventually we can use the config's value to authenticate
  constructor(config: IntegrationConfig) {
    super();
    // Authentication needs to be called before the makeApiClient line
    this.authenticate();

    this.client = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
  }

  async iterateNamespacedDeployments(
    namespace: string,
    callback: (data: k8s.V1Deployment) => Promise<void>,
  ): Promise<void> {
    // Can be namespace listed as well (and maybe we want to use that one instead)
    const resp = await this.client.listNamespacedDeployment(namespace);

    for (const deployment of resp.body.items || []) {
      await callback(deployment);
    }
  }

  async iterateReplicaSets(
    callback: (data: k8s.V1ReplicaSet) => Promise<void>,
  ): Promise<void> {
    // Can be namespace listed as well (and maybe we want to use that one instead)
    const resp = await this.client.listReplicaSetForAllNamespaces();

    for (const replicaset of resp.body.items || []) {
      await callback(replicaset);
    }
  }
}
