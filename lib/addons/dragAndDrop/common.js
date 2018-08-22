'use strict'

exports.__esModule = true
exports.mergeComponents = exports.nest = exports.dragAccessors = undefined

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

var _accessors = require('../../utils/accessors')

var _react = require('react')

function _objectWithoutProperties(obj, keys) {
  var target = {}
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }
  return target
}

var dragAccessors = (exports.dragAccessors = {
  start: (0, _accessors.wrapAccessor)(function(e) {
    return e.start
  }),
  end: (0, _accessors.wrapAccessor)(function(e) {
    return e.end
  }),
})

var nest = function nest() {
  for (
    var _len = arguments.length, Components = Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    Components[_key] = arguments[_key]
  }

  var factories = Components.filter(Boolean).map(_react.createFactory)
  var Nest = function Nest(_ref) {
    var children = _ref.children,
      props = _objectWithoutProperties(_ref, ['children'])

    return factories.reduceRight(function(child, factory) {
      return factory(props, child)
    }, children)
  }

  return Nest
}

exports.nest = nest
var mergeComponents = (exports.mergeComponents = function mergeComponents() {
  var components =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
  var addons = arguments[1]

  var keys = Object.keys(addons)
  var result = _extends({}, components)

  keys.forEach(function(key) {
    result[key] = components[key] ? nest(addons[key]) : addons[key]
  })
  return result
})
