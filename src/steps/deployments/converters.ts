import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

export function createDeploymentEntity(data: k8s.V1Deployment) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.DEPLOYMENT._class,
        _type: Entities.DEPLOYMENT._type,
        // metadata properties - we could group them using "metadata." notation
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        // spec properties - we could group them using "spec." notation
        minReadySeconds: data.spec?.minReadySeconds,
        paused: data.spec?.paused,
        progressDeadlineSeconds: data.spec?.progressDeadlineSeconds,
        replicas: data.spec?.replicas,
        revisionHistoryLimit: data.spec?.revisionHistoryLimit,
        'strategy.type': data.spec?.strategy?.type,
        // TODO: these seem to be strings in my example, but TS type tells they're objects
        // "rollingUpdate": {
        //   "maxSurge": "25%",
        //   "maxUnavailable": "25%"
        // },
        // "strategy.maxSurge": data.spec?.strategy?.rollingUpdate?.maxSurge,
        // "strategy.maxUnavailable": data.spec?.strategy?.rollingUpdate?.maxUnavailable,
        // TODO: something about spec.template sections maybe?
        'status.availableReplicas': data.status?.availableReplicas,
        'status.collisionCount': data.status?.collisionCount,
        'status.observedGeneration': data.status?.observedGeneration,
        'status.readyReplicas': data.status?.readyReplicas,
        'status.replicas': data.status?.replicas,
        'status.unavailableReplicas': data.status?.unavailableReplicas,
        'status.updatedReplicas': data.status?.updatedReplicas,
      },
    },
  });
}
