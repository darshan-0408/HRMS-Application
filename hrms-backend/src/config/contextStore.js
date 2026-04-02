import { AsyncLocalStorage } from 'async_hooks';

export const contextStore = new AsyncLocalStorage();

/**
 * Helper to get the current tenant ID from the async storage.
 */
export const getTenantId = () => {
  const store = contextStore.getStore();
  return store?.tenant_id;
};
