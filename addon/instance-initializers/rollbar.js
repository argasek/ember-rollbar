export function initialize(instance) {
  const { application } = instance;
  instance.lookup('service:rollbar').configure(application.rollbar.config, application.rollbar.options);
}
