import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function createClusterEntity(data: { name: string }) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.CLUSTER._class,
        _type: Entities.CLUSTER._type,
        _key: data.name,
        name: data.name,
        displayName: data.name,
      },
    },
  });
}
