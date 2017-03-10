/*global Rollbar*/
import Ember from 'ember';

const {
  Service,
  set,
  get,
  RSVP,
  Logger
} = Ember;

const GLOBAL_ERRORS = [];

window._getErrors = () => GLOBAL_ERRORS;
window._resetErrors = () => GLOBAL_ERRORS.length = 0;

const reportError = (...args) => {
  const [ err ] = args;

  // next allow do not report to rollbar if key is empty
  const { options: { accessToken, rollbarKey } } = Rollbar;
  if (accessToken || rollbarKey) {
    Rollbar.error.apply(Rollbar, args);
  }

  // By default `JSON.stringify` for `Error` instance return `{}`. Replace it with `error.stack`
  if (err instanceof Error) {
    const { stack } = err;
    args[0] = stack;
  }

  GLOBAL_ERRORS.push(JSON.parse(JSON.stringify(args)));
};

const reportEmberErrorToRollbar = (error, source) => {
  Logger.error(error);
  if (error instanceof Error) {
    reportError(error, { emberSource: `${source} with error object` });
  } else if (error) {
    if (error.message && error.name) {
      reportError(`${error.name}: ${error.message}`,
        { origError: error, emberSource: `${source} with non-error instance` });
    } else {
      reportError(error, { emberSource: `${source} with non-error instance` });
    }
  } else {
    reportError('Error is undefined', { emberSource: `${source} default` });
  }
};

const defaultOptions = {
  reportPromiseRejections: true
};

export default Service.extend({
  rollbar: null,
  options: defaultOptions,

  configure(config = {}, options = {}) {
    let modifiedOptions = get(this, 'options');
    const onError = Ember.onerror;

    Object.assign(modifiedOptions, options);

    if (Rollbar.init) {
      Rollbar.init(config);
    } else {
      Rollbar.configure(config);
    }

    Ember.onerror = (error) => {
      if (onError) {
        onError(error);
      }
      reportEmberErrorToRollbar(error, 'Ember.onerror');
    };

    if (options.reportPromiseRejections) {
      RSVP.on('error', reportEmberErrorToRollbar);
    }

    set(this, 'rollbar', Rollbar);
    set(this, 'options', modifiedOptions);

    return Rollbar;
  }
});
