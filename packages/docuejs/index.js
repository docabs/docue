'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/docuejs.cjs.prod.js')
} else {
  module.exports = require('./dist/docuejs.cjs.js')
}
