'use strict';

const { expect } = require('chai');
const overrideArgv = require('process-utils/override-argv');
const ServerlessError = require('../../../../lib/serverless-error');
const resolveInput = require('../../../../lib/cli/resolve-input');
const { triggeredDeprecations } = require('../../../../lib/utils/logDeprecation');
const ensureSupportedCommand = require('../../../../lib/cli/ensure-supported-command');

describe('test/unit/lib/cli/ensure-supported-command.test.js', () => {
  it('should do nothing on valid command', async () => {
    resolveInput.clear();
    triggeredDeprecations.clear();
    overrideArgv(
      {
        args: ['serverless', 'info'],
      },
      () => resolveInput()
    );
    ensureSupportedCommand();
    expect(triggeredDeprecations.has('UNSUPPORTED_CLI_OPTIONS')).to.be.false;
  });

  it('should reject invalid command', async () => {
    resolveInput.clear();
    triggeredDeprecations.clear();
    overrideArgv(
      {
        args: ['serverless', 'hablo'],
      },
      () => resolveInput()
    );
    expect(() => ensureSupportedCommand())
      .to.throw(ServerlessError)
      .with.property('code', 'UNRECOGNIZED_CLI_COMMAND');
  });

  it('should report invalid options', async () => {
    resolveInput.clear();
    triggeredDeprecations.clear();
    overrideArgv(
      {
        args: ['serverless', 'info', '--hadsfa'],
      },
      () => resolveInput()
    );
    ensureSupportedCommand();
    expect(triggeredDeprecations.has('UNSUPPORTED_CLI_OPTIONS')).to.be.true;
  });
});
