import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { CoreClient } from './kubernetes/clients/core';

export function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.clientId || !config.clientSecret) {
    throw new IntegrationValidationError(
      'Config requires all of {clientId, clientSecret}',
    );
  }

  const coreClient = new CoreClient(config);
  coreClient.verifyAuthentication();
}
