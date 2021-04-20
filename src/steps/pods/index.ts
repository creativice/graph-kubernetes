import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { CoreClient } from '../../kubernetes/clients/core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { getNodeKey } from '../nodes/converters';
import { createContainerEntity, createPodEntity } from './converters';

export async function fetchPods(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new CoreClient(config);

  await jobState.iterateEntities(
    {
      _type: Entities.NAMESPACE._type,
    },
    async (namespaceEntity) => {
      await client.iterateNamespacedPods(
        namespaceEntity.name as string,
        async (pod) => {
          const podEntity = createPodEntity(pod);
          await jobState.addEntity(podEntity);

          for (const container of pod.spec?.containers || []) {
            const containerEntity = createContainerEntity(container);
            // TODO: placeholder, some issues with name collisions
            if (!(await jobState.findEntity(`container:${container.name}`))) {
              await jobState.addEntity(containerEntity);
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.HAS,
                  from: podEntity,
                  to: containerEntity,
                }),
              );
            }
          }

          const nodeEntity = await jobState.findEntity(
            getNodeKey(pod.spec?.nodeName as string),
          );
          if (nodeEntity) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: nodeEntity,
                to: podEntity,
              }),
            );

            // Client doesn't have a way to list namespacedNodes, like it has for pods etc
            // But we can use the following facts:
            // 1) We know these pods belong to namespace X
            // 2) We know these pods belong to node Y
            // 3) Therefore, the node Y belongs to the namespace X
            // If we can fetch/have a representation of Cluster (even higher entity than node), then
            // we wouldn't necessarily want to have a Namespace -> HAS -> Node, instead
            // we should probably have Namespace -> HAS -> Cluster -> HAS -> Node,
            // but for now let's have this in place just in case.
            // await jobState.addRelationship(createDirectRelationship({
            //   _class: RelationshipClass.HAS,
            //   from: namespaceEntity,
            //   to: nodeEntity,
            // }))
          }

          for (const owner of pod.metadata?.ownerReferences || []) {
            const ownerEntity = await jobState.findEntity(owner.uid);
            // So far, to my knowledge, Pod's owners are ReplicaSets
            // This check is here if we later find out other scenarios, so we can just add more relationships
            if (ownerEntity && owner.kind === 'ReplicaSet') {
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.HAS,
                  from: ownerEntity,
                  to: podEntity,
                }),
              );
            }
          }
        },
      );
    },
  );
}

export const podsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.PODS,
    name: 'Fetch Pods',
    entities: [Entities.POD, Entities.CONTAINER],
    relationships: [
      Relationships.NODE_HAS_POD,
      Relationships.NAMESPACE_HAS_NODE,
      Relationships.POD_HAS_CONTAINER,
      Relationships.REPLICASET_HAS_POD,
    ],
    dependsOn: [
      IntegrationSteps.NAMESPACES,
      IntegrationSteps.NODES,
      IntegrationSteps.REPLICASETS,
    ],
    executionHandler: fetchPods,
  },
];
