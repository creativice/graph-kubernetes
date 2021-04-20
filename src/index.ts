import { IntegrationConfig, instanceConfigFields } from './config';
import { validateInvocation } from './validator';
import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { namespaceSteps } from './steps/namespaces';
import { podsSteps } from './steps/pods';
import { nodeSteps } from './steps/nodes';
import { clusterSteps } from './steps/clusters';
import { serviceSteps } from './steps/services';
import { deploymentsSteps } from './steps/deployments';
import { replicaSetsSteps } from './steps/replica-sets';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [
    ...namespaceSteps,
    ...clusterSteps,
    ...serviceSteps,
    ...deploymentsSteps,
    ...replicaSetsSteps,
    ...nodeSteps,
    ...podsSteps,
  ],
};
