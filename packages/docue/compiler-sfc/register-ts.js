if (typeof require !== 'undefined') {
  try {
    require('@docue/compiler-sfc').registerTS(() => require('typescript'))
  } catch (e) {}
}
