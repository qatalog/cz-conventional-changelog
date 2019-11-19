'format cjs';

var engine = require('./engine');
var configLoader = require('commitizen').configLoader;

// Modified from `require('conventional-commit-types')`
const COMMIT_TYPES = {
  break: {
    description: "A breaking change for downstream consumers",
    title: "Breaking changes",
  },
  perf: {
    description: "A performance improvement",
    title: "Performance improvements",
  },
  revert: {
    description: "Reverts a previous change",
    title: "Reverted changes",
  },
  fix: {
    description: "A bug fix",
    title: "Fixes",
  },
  feat: {
    description: "A new feature",
    title: "Features",
  },
  refactor: {
    description: "A refactoring, which fixes no bugs and adds no features",
    title: "Refactorings",
  },
  format: {
    description: "Trivial formatting changes, like indentation, semi-colons and automated linter fixes",
    title: "Formatting changes",
  },
  chore: {
    description: "Housekeeping, anything else",
    title: "Chores",
  },
};

var config = configLoader.load();
var options = {
  types: COMMIT_TYPES,
  defaultType: process.env.CZ_TYPE || config.defaultType,
  defaultScope: process.env.CZ_SCOPE || config.defaultScope,
  defaultSubject: process.env.CZ_SUBJECT || config.defaultSubject,
  defaultBody: process.env.CZ_BODY || config.defaultBody,
  defaultIssues: process.env.CZ_ISSUES || config.defaultIssues,
  disableScopeLowerCase:
    process.env.DISABLE_SCOPE_LOWERCASE || config.disableScopeLowerCase,
  maxHeaderWidth:
    (process.env.CZ_MAX_HEADER_WIDTH &&
      parseInt(process.env.CZ_MAX_HEADER_WIDTH)) ||
    config.maxHeaderWidth ||
    100,
  maxLineWidth:
    (process.env.CZ_MAX_LINE_WIDTH &&
      parseInt(process.env.CZ_MAX_LINE_WIDTH)) ||
    config.maxLineWidth ||
    100
};

(function(options) {
  try {
    var commitlintLoad = require('@commitlint/load');
    commitlintLoad().then(function(clConfig) {
      if (clConfig.rules) {
        var maxHeaderLengthRule = clConfig.rules['header-max-length'];
        if (
          typeof maxHeaderLengthRule === 'object' &&
          maxHeaderLengthRule.length >= 3 &&
          !process.env.CZ_MAX_HEADER_WIDTH &&
          !config.maxHeaderWidth
        ) {
          options.maxHeaderWidth = maxHeaderLengthRule[2];
        }
      }
    });
  } catch (err) {}
})(options);

module.exports = engine(options);
