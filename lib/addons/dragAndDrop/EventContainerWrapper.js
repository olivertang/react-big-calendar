'use strict'

exports.__esModule = true

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

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _dates = require('../../utils/dates')

var _dates2 = _interopRequireDefault(_dates)

var _reactDom = require('react-dom')

var _Selection = require('../../Selection')

var _Selection2 = _interopRequireDefault(_Selection)

var _TimeGridEvent = require('../../TimeGridEvent')

var _TimeGridEvent2 = _interopRequireDefault(_TimeGridEvent)

var _common = require('./common')

var _NoopWrapper = require('../../NoopWrapper')

var _NoopWrapper2 = _interopRequireDefault(_NoopWrapper)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

var pointInColumn = function pointInColumn(bounds, _ref) {
  var x = _ref.x,
    y = _ref.y
  var left = bounds.left,
    right = bounds.right,
    top = bounds.top

  return x < right + 10 && x > left && y > top
}
var propTypes = {}

var EventContainerWrapper = (function(_React$Component) {
  _inherits(EventContainerWrapper, _React$Component)

  function EventContainerWrapper() {
    _classCallCheck(this, EventContainerWrapper)

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    var _this = _possibleConstructorReturn(
      this,
      _React$Component.call.apply(_React$Component, [this].concat(args))
    )

    _this.handleMove = function(point, boundaryBox) {
      var event = _this.context.draggable.dragAndDropAction.event
      var slotMetrics = _this.props.slotMetrics

      if (!pointInColumn(boundaryBox, point)) {
        _this.reset()
        return
      }

      var currentSlot = slotMetrics.closestSlotFromPoint(
        { y: point.y - _this.eventOffsetTop, x: point.x },
        boundaryBox
      )

      var end = _dates2.default.add(
        currentSlot,
        _dates2.default.diff(event.start, event.end, 'minutes'),
        'minutes'
      )

      _this.update(event, slotMetrics.getRange(currentSlot, end))
    }

    _this._selectable = function() {
      var node = (0, _reactDom.findDOMNode)(_this)
      var selector = (_this._selector = new _Selection2.default(function() {
        return node.closest('.rbc-time-view')
      }))

      selector.on('beforeSelect', function(point) {
        var dragAndDropAction = _this.context.draggable.dragAndDropAction

        if (!dragAndDropAction.action) return false
        if (dragAndDropAction.action === 'resize') {
          return pointInColumn((0, _Selection.getBoundsForNode)(node), point)
        }

        var eventNode = (0, _Selection.getEventNodeFromPoint)(node, point)
        if (!eventNode) return false

        _this.eventOffsetTop =
          point.y - (0, _Selection.getBoundsForNode)(eventNode).top
      })

      selector.on('selecting', function(box) {
        var bounds = (0, _Selection.getBoundsForNode)(node)
        var dragAndDropAction = _this.context.draggable.dragAndDropAction

        if (dragAndDropAction.action === 'move') _this.handleMove(box, bounds)
        if (dragAndDropAction.action === 'resize')
          _this.handleResize(box, bounds)
      })

      selector.on('selectStart', function() {
        return _this.context.draggable.onStart()
      })

      selector.on('select', function(point) {
        var bounds = (0, _Selection.getBoundsForNode)(node)

        if (!_this.state.event || !pointInColumn(bounds, point)) return
        _this.handleInteractionEnd()
      })

      selector.on('click', function() {
        return _this.context.draggable.onEnd(null)
      })
    }

    _this.handleInteractionEnd = function() {
      var resource = _this.props.resource
      var event = _this.state.event

      _this.reset()

      _this.context.draggable.onEnd({
        start: event.start,
        end: event.end,
        resourceId: resource,
      })
    }

    _this._teardownSelectable = function() {
      if (!_this._selector) return
      _this._selector.teardown()
      _this._selector = null
    }

    _this.state = {}
    return _this
  }

  EventContainerWrapper.prototype.componentDidMount = function componentDidMount() {
    this._selectable()
  }

  EventContainerWrapper.prototype.componentWillUnmount = function componentWillUnmount() {
    this._teardownSelectable()
  }

  EventContainerWrapper.prototype.reset = function reset() {
    if (this.state.event)
      this.setState({ event: null, top: null, height: null })
  }

  EventContainerWrapper.prototype.update = function update(event, _ref2) {
    var startDate = _ref2.startDate,
      endDate = _ref2.endDate,
      top = _ref2.top,
      height = _ref2.height
    var lastEvent = this.state.event

    if (
      lastEvent &&
      startDate === lastEvent.start &&
      endDate === lastEvent.end
    ) {
      return
    }

    this.setState({
      top: top,
      height: height,
      event: _extends({}, event, { start: startDate, end: endDate }),
    })
  }

  EventContainerWrapper.prototype.handleResize = function handleResize(
    point,
    boundaryBox
  ) {
    var start = void 0,
      end = void 0
    var _props = this.props,
      accessors = _props.accessors,
      slotMetrics = _props.slotMetrics
    var _context$draggable$dr = this.context.draggable.dragAndDropAction,
      event = _context$draggable$dr.event,
      direction = _context$draggable$dr.direction

    var currentSlot = slotMetrics.closestSlotFromPoint(point, boundaryBox)
    if (direction === 'UP') {
      end = accessors.end(event)
      start = _dates2.default.min(
        currentSlot,
        slotMetrics.closestSlotFromDate(end, -1)
      )
    } else if (direction === 'DOWN') {
      start = accessors.start(event)
      end = _dates2.default.max(
        currentSlot,
        slotMetrics.closestSlotFromDate(start)
      )
    }

    this.update(event, slotMetrics.getRange(start, end))
  }

  EventContainerWrapper.prototype.render = function render() {
    var _props2 = this.props,
      children = _props2.children,
      accessors = _props2.accessors,
      components = _props2.components,
      getters = _props2.getters,
      slotMetrics = _props2.slotMetrics,
      localizer = _props2.localizer
    var _state = this.state,
      event = _state.event,
      top = _state.top,
      height = _state.height

    if (!event) return children

    var events = children.props.children
    var start = event.start,
      end = event.end

    var label = void 0
    var format = 'eventTimeRangeFormat'

    var startsBeforeDay = slotMetrics.startsBeforeDay(start)
    var startsAfterDay = slotMetrics.startsAfterDay(end)

    if (startsBeforeDay) format = 'eventTimeRangeEndFormat'
    else if (startsAfterDay) format = 'eventTimeRangeStartFormat'

    if (startsBeforeDay && startsAfterDay) label = localizer.messages.allDay
    else label = localizer.format({ start: start, end: end }, format)

    return _react2.default.cloneElement(children, {
      children: _react2.default.createElement(
        _react2.default.Fragment,
        null,
        events,
        event &&
          _react2.default.createElement(_TimeGridEvent2.default, {
            event: event,
            label: label,
            className: 'rbc-addons-dnd-drag-preview',
            style: { top: top, height: height, width: 100 },
            getters: getters,
            components: _extends({}, components, {
              eventWrapper: _NoopWrapper2.default,
            }),
            accessors: _extends({}, accessors, _common.dragAccessors),
            continuesEarlier: startsBeforeDay,
            continuesLater: startsAfterDay,
          })
      ),
    })
  }

  return EventContainerWrapper
})(_react2.default.Component)

EventContainerWrapper.propTypes = {
  accessors: _propTypes2.default.object.isRequired,
  components: _propTypes2.default.object.isRequired,
  getters: _propTypes2.default.object.isRequired,
  localizer: _propTypes2.default.object.isRequired,
  slotMetrics: _propTypes2.default.object.isRequired,
  resource: _propTypes2.default.any,
}
EventContainerWrapper.contextTypes = {
  draggable: _propTypes2.default.shape({
    onStart: _propTypes2.default.func,
    onEnd: _propTypes2.default.func,
    onBeginAction: _propTypes2.default.func,
    dragAndDropAction: _propTypes2.default.object,
  }),
}

EventContainerWrapper.propTypes = propTypes

exports.default = EventContainerWrapper
module.exports = exports['default']
