import { createConfig } from '../tsup.config.base';

export default createConfig({
  name: '@agent-forge/utils',
  noExternal: [],
  splitting: false
});
