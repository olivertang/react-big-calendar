'use strict';

exports.__esModule = true;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _scrollbarSize = require('dom-helpers/util/scrollbarSize');

var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dates = require('./utils/dates');

var _dates2 = _interopRequireDefault(_dates);

var _DateContentRow = require('./DateContentRow');

var _DateContentRow2 = _interopRequireDefault(_DateContentRow);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _helpers = require('./utils/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeGridHeader = function (_React$Component) {
  _inherits(TimeGridHeader, _React$Component);

  function TimeGridHeader() {
    var _temp, _this, _ret;

    _classCallCheck(this, TimeGridHeader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleHeaderClick = function (date, view, e) {
      e.preventDefault();
      (0, _helpers.notify)(_this.props.onDrillDown, [date, view]);
    }, _this.renderRow = function (resource) {
      var _this$props = _this.props,
          events = _this$props.events,
          rtl = _this$props.rtl,
          selectable = _this$props.selectable,
          getNow = _this$props.getNow,
          range = _this$props.range,
          getters = _this$props.getters,
          localizer = _this$props.localizer,
          accessors = _this$props.accessors,
          components = _this$props.components;


      var resourceId = accessors.resourceId(resource);
      var eventsToDisplay = resource ? events.filter(function (event) {
        return accessors.resource(event) === resourceId;
      }) : events;

      return _react2.default.createElement(_DateContentRow2.default, {
        isAllDay: true,
        rtl: rtl,
        getNow: getNow,
        minRows: 2,
        range: range,
        events: eventsToDisplay,
        resourceId: resourceId,
        className: 'rbc-allday-cell',
        selectable: selectable,
        selected: _this.props.selected,
        components: components,
        accessors: accessors,
        getters: getters,
        localizer: localizer,
        onSelect: _this.props.onSelectEvent,
        onDoubleClick: _this.props.onDoubleClickEvent,
        onSelectSlot: _this.props.onSelectSlot,
        longPressThreshold: _this.props.longPressThreshold
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  TimeGridHeader.prototype.renderHeaderCells = function renderHeaderCells(range) {
    var _this2 = this;

    var _props = this.props,
        localizer = _props.localizer,
        getDrilldownView = _props.getDrilldownView,
        getNow = _props.getNow,
        dayProp = _props.getters.dayProp,
        _props$components$hea = _props.components.header,
        HeaderComponent = _props$components$hea === undefined ? _Header2.default : _props$components$hea;


    var today = getNow();

    return range.map(function (date, i) {
      var drilldownView = getDrilldownView(date);
      var label = localizer.format(date, 'dayFormat');

      var _dayProp = dayProp(date),
          className = _dayProp.className,
          style = _dayProp.style;

      var header = _react2.default.createElement(HeaderComponent, { date: date, label: label, localizer: localizer });

      return _react2.default.createElement(
        'div',
        {
          key: i,
          style: style,
          className: (0, _classnames2.default)('rbc-header', className, _dates2.default.eq(date, today, 'day') && 'rbc-today')
        },
        drilldownView ? _react2.default.createElement(
          'a',
          {
            href: '#',
            onClick: function onClick(e) {
              return _this2.handleHeaderClick(date, drilldownView, e);
            }
          },
          header
        ) : _react2.default.createElement(
          'span',
          null,
          header
        )
      );
    });
  };

  TimeGridHeader.prototype.render = function render() {
    var _this3 = this;

    var _props2 = this.props,
        width = _props2.width,
        rtl = _props2.rtl,
        resources = _props2.resources,
        range = _props2.range,
        events = _props2.events,
        getNow = _props2.getNow,
        accessors = _props2.accessors,
        selectable = _props2.selectable,
        components = _props2.components,
        getters = _props2.getters,
        scrollRef = _props2.scrollRef,
        localizer = _props2.localizer,
        isOverflowing = _props2.isOverflowing,
        TimeGutterHeader = _props2.components.timeGutterHeader;


    var style = {};
    if (isOverflowing) {
      style[rtl ? 'marginLeft' : 'marginRight'] = (0, _scrollbarSize2.default)() + 'px';
    }

    var groupedEvents = resources.groupEvents(events);

    return _react2.default.createElement(
      'div',
      {
        style: style,
        ref: scrollRef,
        className: (0, _classnames2.default)('rbc-time-header', isOverflowing && 'rbc-overflowing')
      },
      _react2.default.createElement(
        'div',
        {
          className: 'rbc-label rbc-time-header-gutter',
          style: { width: width, minWidth: width, maxWidth: width }
        },
        TimeGutterHeader && _react2.default.createElement(TimeGutterHeader, null)
      ),
      resources.map(function (_ref, idx) {
        var id = _ref[0],
            resource = _ref[1];
        return _react2.default.createElement(
          'div',
          { className: 'rbc-time-header-content', key: id || idx },
          resource && _react2.default.createElement(
            'div',
            { className: 'rbc-row rbc-row-resource' },
            _react2.default.createElement(
              'div',
              { key: 'resource_' + idx, className: 'rbc-header' },
              accessors.resourceTitle(resource)
            )
          ),
          range.length > 1 && _react2.default.createElement(
            'div',
            { className: 'rbc-row rbc-time-header-cell' },
            _this3.renderHeaderCells(range)
          ),
          _react2.default.createElement(_DateContentRow2.default, {
            isAllDay: true,
            rtl: rtl,
            getNow: getNow,
            minRows: 2,
            range: range,
            events: groupedEvents.get(id) || [],
            resourceId: resource && id,
            className: 'rbc-allday-cell',
            selectable: selectable,
            selected: _this3.props.selected,
            components: components,
            accessors: accessors,
            getters: getters,
            localizer: localizer,
            onSelect: _this3.props.onSelectEvent,
            onDoubleClick: _this3.props.onDoubleClickEvent,
            onSelectSlot: _this3.props.onSelectSlot,
            longPressThreshold: _this3.props.longPressThreshold
          })
        );
      })
    );
  };

  return TimeGridHeader;
}(_react2.default.Component);

TimeGridHeader.propTypes = {
  range: _propTypes2.default.array.isRequired,
  events: _propTypes2.default.array.isRequired,
  resources: _propTypes2.default.object,
  getNow: _propTypes2.default.func.isRequired,
  isOverflowing: _propTypes2.default.bool,

  rtl: _propTypes2.default.bool,
  width: _propTypes2.default.number,

  localizer: _propTypes2.default.object.isRequired,
  accessors: _propTypes2.default.object.isRequired,
  components: _propTypes2.default.object.isRequired,
  getters: _propTypes2.default.object.isRequired,

  selected: _propTypes2.default.object,
  selectable: _propTypes2.default.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: _propTypes2.default.number,

  onSelectSlot: _propTypes2.default.func,
  onSelectEvent: _propTypes2.default.func,
  onDoubleClickEvent: _propTypes2.default.func,
  onDrillDown: _propTypes2.default.func,
  getDrilldownView: _propTypes2.default.func.isRequired,
  scrollRef: _propTypes2.default.any
};
exports.default = TimeGridHeader;
module.exports = exports['default'];