import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export enum IntegrationSteps {
  NAMESPACES = 'fetch-namespaces',
  CLUSTERS = 'fetch-clusters',
  REPLICASETS = 'fetch-replica-sets',
  NODES = 'fetch-nodes',
  PODS = 'fetch-pods',
  SERVICES = 'fetch-services',
  DEPLOYMENTS = 'fetch-deployments',
}

// Ordered "biggest" to "smallest"
export const Entities: Record<
  | 'NAMESPACE'
  | 'CLUSTER'
  | 'DEPLOYMENT'
  | 'REPLICASET'
  | 'NODE'
  | 'POD'
  | 'CONTAINER'
  | 'SERVICE',
  StepEntityMetadata
> = {
  NAMESPACE: {
    _type: 'kubernetes_namespace',
    _class: ['Group'],
    resourceName: 'Kubernetes Namespace',
  },
  CLUSTER: {
    _type: 'kubernetes_cluster',
    _class: ['Cluster'],
    resourceName: 'Kubernetes Cluster',
  },
  DEPLOYMENT: {
    _type: 'kubernetes_deployment',
    _class: ['Configuration'],
    resourceName: 'Kubernetes Deployment',
  },
  REPLICASET: {
    _type: 'kubernetes_replicaset',
    _class: ['Configuration'],
    resourceName: 'Kubernetes ReplicaSet',
  },
  NODE: {
    _type: 'kubernetes_node',
    _class: ['Group'],
    resourceName: 'Kubernetes Node',
  },
  POD: {
    _type: 'kubernetes_pod',
    _class: ['Group'],
    resourceName: 'Kubernetes Pod',
  },
  CONTAINER: {
    // TODO: maybe kubernetes_pod_container
    _type: 'kubernetes_container',
    _class: ['Container'],
    resourceName: 'Kubernetes Container',
  },
  SERVICE: {
    _type: 'kubernetes_service',
    _class: ['Service'],
    resourceName: 'Kubernetes Service',
  },
};

export const Relationships: Record<
  | 'NAMESPACE_HAS_POD'
  | 'NAMESPACE_HAS_NODE'
  | 'NAMESPACE_HAS_SERVICE'
  | 'NAMESPACE_HAS_DEPLOYMENT'
  | 'CLUSTER_HAS_NODE'
  | 'DEPLOYMENT_HAS_REPLICASET'
  | 'REPLICASET_HAS_POD'
  | 'NODE_HAS_POD'
  | 'POD_HAS_CONTAINER',
  StepRelationshipMetadata
> = {
  NAMESPACE_HAS_POD: {
    _type: 'kubernetes_namespace_has_pod',
    _class: RelationshipClass.HAS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.POD._type,
  },
  NAMESPACE_HAS_NODE: {
    _type: 'kubernetes_namespace_has_node',
    _class: RelationshipClass.HAS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.NODE._type,
  },
  NAMESPACE_HAS_SERVICE: {
    _type: 'kubernetes_namespace_has_service',
    _class: RelationshipClass.HAS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.SERVICE._type,
  },
  NAMESPACE_HAS_DEPLOYMENT: {
    _type: 'kubernetes_namespace_has_deployment',
    _class: RelationshipClass.HAS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.DEPLOYMENT._type,
  },
  CLUSTER_HAS_NODE: {
    _type: 'kubernetes_cluster_has_node',
    _class: RelationshipClass.HAS,
    sourceType: Entities.CLUSTER._type,
    targetType: Entities.NODE._type,
  },
  DEPLOYMENT_HAS_REPLICASET: {
    _type: 'kubernetes_deployment_has_replicaset',
    _class: RelationshipClass.HAS,
    sourceType: Entities.DEPLOYMENT._type,
    targetType: Entities.REPLICASET._type,
  },
  REPLICASET_HAS_POD: {
    _type: 'kubernetes_replicaset_has_pod',
    _class: RelationshipClass.HAS,
    sourceType: Entities.REPLICASET._type,
    targetType: Entities.POD._type,
  },
  NODE_HAS_POD: {
    _type: 'kubernetes_node_has_pod',
    _class: RelationshipClass.HAS,
    sourceType: Entities.NODE._type,
    targetType: Entities.POD._type,
  },
  POD_HAS_CONTAINER: {
    _type: 'kubernetes_pod_has_container',
    _class: RelationshipClass.HAS,
    sourceType: Entities.POD._type,
    targetType: Entities.CONTAINER._type,
  },
};
