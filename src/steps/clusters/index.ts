import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createClusterEntity } from './converters';

export async function fetchCluster(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;

  const clusterEntity = createClusterEntity({ name: 'my-cluster' });
  await jobState.addEntity(clusterEntity);

  await jobState.iterateEntities(
    {
      _type: Entities.NODE._type,
    },
    async (nodeEntity) => {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: clusterEntity,
          to: nodeEntity,
        }),
      );
    },
  );
}

export const clusterSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.CLUSTERS,
    name: 'Fetch Cluster',
    entities: [Entities.CLUSTER],
    relationships: [Relationships.CLUSTER_HAS_NODE],
    dependsOn: [IntegrationSteps.NODES],
    executionHandler: fetchCluster,
  },
];
