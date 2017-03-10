import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const {
  get
} = Ember;

moduleFor('service:rollbar', 'Unit | Service | rollbar');

test('it exists', function(assert) {
  const service = this.subject();
  assert.ok(service, 'Service is enabled.');
});

test('configure method returns rollbar instance', function(assert) {
  const service = this.subject();
  const rollbar = service.configure();
  assert.ok(rollbar, 'Returned rollbar is equal to default Rollbar.');
});

test('configure method saves rollbar to local property', function(assert) {
  const service = this.subject();
  service.configure();
  assert.ok(get(service, 'rollbar'), 'Service rollbar is equal to default Rollbar.');
});

test('configure method sets reportPromiseRejections option to true', function(assert) {
  const service = this.subject();
  service.configure();
  assert.deepEqual(get(service, 'options'), { reportPromiseRejections: true }, 'Service options is equal to defaults.');
});

test('service rollbar has methods equal to default Rollbar', function(assert) {
  const service = this.subject();
  const rollbar = service.configure();
  assert.ok(rollbar.critical, 'Service rollbar has critical method.');
  assert.ok(rollbar.debug, 'Service rollbar has critical method.');
  assert.ok(rollbar.warning, 'Service rollbar has critical method.');
  assert.ok(rollbar.info, 'Service rollbar has critical method.');
  assert.ok(rollbar.error, 'Service rollbar has critical method.');
  assert.ok(rollbar.configure, 'Service rollbar has critical method.');
  assert.ok(rollbar.scope, 'Service rollbar has critical method.');
});
