'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _jsonDecycle = require('json-decycle');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ManifestActionComponent = (function (_React$Component) {
    _inherits(ManifestActionComponent, _React$Component);

    function ManifestActionComponent() {
        _classCallCheck(this, ManifestActionComponent);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ManifestActionComponent).call(this));

        _this.state = {
            expanded: false
        };
        return _this;
    }

    _createClass(ManifestActionComponent, [{
        key: 'getDiffs',
        value: function getDiffs() {
            var _this2 = this;

            var diff = this.props.diff;

            return diff.map(function (d, i) {
                return _this2.renderDiff(d, i);
            });
        }
    }, {
        key: 'expandAction',
        value: function expandAction() {
            this.setState({
                expanded: !this.state.expanded
            });
        }
    }, {
        key: 'disableAction',
        value: function disableAction() {
            this.props.toggleAction(this.props.index);
        }
    }, {
        key: 'createOldValue',
        value: function createOldValue(diff) {
            if (diff.item) {
                return JSON.stringify(diff.item.lhs, _jsonDecycle.decycle);
            }

            return JSON.stringify(diff.lhs, _jsonDecycle.decycle);
        }
    }, {
        key: 'createNewValue',
        value: function createNewValue(diff) {
            if (diff.item) {
                return JSON.stringify(diff.item.rhs, _jsonDecycle.decycle);
            }

            return JSON.stringify(diff.rhs, _jsonDecycle.decycle);
        }
    }, {
        key: 'createPath',
        value: function createPath(diff) {
            var path = [];

            if (diff.path) {
                path = path.concat(diff.path);
            }
            if (typeof diff.index !== 'undefined') {
                path.push(diff.index);
            }
            return path.length ? path.join('.') : '';
        }
    }, {
        key: 'renderDiff',
        value: function renderDiff(diff, index) {
            var oldValue = this.createOldValue(diff);
            var newValue = this.createNewValue(diff);
            var path = this.createPath(diff);

            return _react2.default.createElement(
                'div',
                { key: index },
                path,
                ': ',
                _react2.default.createElement(
                    'span',
                    { style: _style2.default.oldValue },
                    oldValue || 'undefined'
                ),
                _react2.default.createElement(
                    'span',
                    { style: _style2.default.newValue },
                    ' ',
                    newValue,
                    ' '
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var action = _props.action.action;
            var diff = _props.diff;
            var skipped = _props.skipped;

            var expanded = this.props.expanded || this.state.expanded;
            var storeHasChanged = !!diff.length;
            var changes = this.getDiffs();

            var actionBlock = this.state.expanded ? _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'pre',
                    { style: _style2.default.actionData },
                    JSON.stringify(action)
                )
            ) : null;

            var storeBlock = expanded && storeHasChanged ? _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { style: _style2.default.header },
                    _react2.default.createElement(
                        'span',
                        null,
                        'Store Mutations'
                    )
                ),
                _react2.default.createElement(
                    'pre',
                    {
                        className: 'diff',
                        style: _style2.default.store
                    },
                    changes
                )
            ) : null;

            var enableToggle = skipped ? 'enable' : 'disable';

            return _react2.default.createElement(
                'div',
                { className: 'manifest-action-component' },
                _react2.default.createElement(
                    'div',
                    { style: _style2.default.base },
                    _react2.default.createElement(
                        'div',
                        {
                            className: action.type,
                            style: [_style2.default.title, diff.length && _style2.default.mutated, skipped && _style2.default.skipped],
                            onClick: this.expandAction.bind(this)
                        },
                        _react2.default.createElement(
                            'span',
                            null,
                            action.type
                        ),
                        _react2.default.createElement(
                            'span',
                            { style: _style2.default.toggle, onClick: this.disableAction.bind(this) },
                            enableToggle
                        )
                    ),
                    actionBlock,
                    storeBlock
                )
            );
        }
    }]);

    return ManifestActionComponent;
})(_react2.default.Component);

ManifestActionComponent.propTypes = {
    diff: _react.PropTypes.array,
    toggleAction: _react.PropTypes.func,
    index: _react.PropTypes.number,
    action: _react.PropTypes.object,
    skipped: _react.PropTypes.bool,
    expanded: _react.PropTypes.bool
};
exports.default = (0, _radium2.default)(ManifestActionComponent);