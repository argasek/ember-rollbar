/*jshint node:true*/
module.exports = {
  description: '',

  normalizeEntityName: function() {},

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  afterInstall: function() {
    return this.addBowerPackageToProject('rollbar', '1.9.3');
  }
};
