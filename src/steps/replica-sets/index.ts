import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { AppsClient } from '../../kubernetes/clients/apps';
import { createReplicaSetEntity } from './converters';

export async function fetchReplicaSets(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new AppsClient(config);

  await client.iterateReplicaSets(async (replicaSet) => {
    const replicaSetEntity = createReplicaSetEntity(replicaSet);
    await jobState.addEntity(replicaSetEntity);

    for (const owner of replicaSet.metadata?.ownerReferences || []) {
      const ownerEntity = await jobState.findEntity(owner.uid);
      // So far, to my knowledge, ReplicaSets's owners are Deployments
      // This check is here if we later find out other scenarios, so we can just add more relationships
      if (ownerEntity && owner.kind === 'Deployment') {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: ownerEntity,
            to: replicaSetEntity,
          }),
        );
      }
    }
  });
}

export const replicaSetsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.REPLICASETS,
    name: 'Fetch ReplicaSets',
    entities: [Entities.REPLICASET],
    relationships: [Relationships.DEPLOYMENT_HAS_REPLICASET],
    dependsOn: [IntegrationSteps.DEPLOYMENTS],
    executionHandler: fetchReplicaSets,
  },
];
