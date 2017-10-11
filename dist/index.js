(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["SentenceAutoComplete"] = factory(require("React"));
	else
		root["SentenceAutoComplete"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return webpackJsonpSentenceAutoComplete([0],[
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PropsSelector", function() { return PropsSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DynamicInput", function() { return DynamicInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Field", function() { return Field; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NumberField", function() { return NumberField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateField", function() { return DateField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BooleanField", function() { return BooleanField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectSwitchCase", function() { return SelectSwitchCase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectSwitch", function() { return SelectSwitch; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


var style = {
    border: '1px',
    width: 'auto',
    background: 'transparent',
    color: '#000',
    display: 'inline-block'
};
var PropsSelector = function (_React$Component) {
    _inherits(PropsSelector, _React$Component);

    function PropsSelector(props) {
        _classCallCheck(this, PropsSelector);

        var _this = _possibleConstructorReturn(this, (PropsSelector.__proto__ || Object.getPrototypeOf(PropsSelector)).call(this, props));

        _this.resize = function (ele) {
            if (!_this.hiddenSelect || !_this.hiddenOption || !ele.options[ele.selectedIndex]) return;
            _this.hiddenOption.innerText = ele.options[ele.selectedIndex].text;
            ele.style.width = _this.hiddenSelect.getBoundingClientRect().width + 'px';
            _this.setState(_defineProperty({}, _this.props.id, ele.value));
        };
        _this.onChange = function (e) {
            _this.resize(e.target);
        };
        _this.state = props.choices;
        return _this;
    }

    _createClass(PropsSelector, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                _props$filter = _props.filter,
                filter = _props$filter === undefined ? function ($) {
                return true;
            } : _props$filter,
                _props$map = _props.map,
                map = _props$map === undefined ? function ($) {
                return $;
            } : _props$map;

            var selected = this.props.properties.filter(filter).map(map).find(function (_ref) {
                var id = _ref.id;
                return id === _this2.state[_this2.props.id];
            });
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null, selected && this.props.pre && this.props.pre(selected), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("select", { ref: function ref($) {
                    return _this2.hiddenSelect = $;
                }, style: {
                    position: 'absolute',
                    visibility: 'hidden'
                } }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("option", { ref: function ref($) {
                    return _this2.hiddenOption = $;
                } })), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("select", { style: style, ref: this.resize, onLoad: this.onChange, onChange: this.onChange, onBlur: this.onChange, name: this.props.id, id: this.props.id, value: this.state[this.props.id] || '' }, !this.props.required && __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("option", { value: "" }, this.props.placeholder || ''), this.props.properties.filter(filter).map(map).map(function (_ref2) {
                var id = _ref2.id,
                    value = _ref2.value;
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("option", { key: id, value: id }, value);
            })), selected && this.props.children && this.props.children(selected));
        }
    }]);

    return PropsSelector;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);
var DynamicInput = function (_React$Component2) {
    _inherits(DynamicInput, _React$Component2);

    function DynamicInput() {
        _classCallCheck(this, DynamicInput);

        var _this3 = _possibleConstructorReturn(this, (DynamicInput.__proto__ || Object.getPrototypeOf(DynamicInput)).apply(this, arguments));

        _this3.resize = function (ele) {
            if (!_this3.hiddenSpan) return;
            _this3.hiddenSpan.innerText = ele.value || ele.placeholder;
            ele.style.width = _this3.hiddenSpan.getBoundingClientRect().width + 'px';
        };
        return _this3;
    }

    _createClass(DynamicInput, [{
        key: 'render',
        value: function render() {
            var _this4 = this;

            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { ref: function ref($) {
                    return _this4.hiddenSpan = $;
                }, style: {
                    minWidth: '20px',
                    position: 'absolute',
                    visibility: 'hidden'
                } }), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("input", Object.assign({}, this.props, { style: style, ref: this.resize, onKeyPress: function onKeyPress(e) {
                    return _this4.resize(e.target);
                } })));
        }
    }]);

    return DynamicInput;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);
var Field = function () {
    function Field(id, value) {
        var properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        _classCallCheck(this, Field);

        this.id = id;
        this.value = value;
        this.properties = properties;
        this.Input = function (props) {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](DynamicInput, { placeholder: '<blank>', id: props.id, name: props.id, defaultValue: props.value });
        };
    }

    _createClass(Field, [{
        key: 'conditions',
        get: function get() {
            return [new Field('eq', 'is'), new Field('neq', 'is not')];
        }
    }]);

    return Field;
}();
var NumberField = function (_Field) {
    _inherits(NumberField, _Field);

    function NumberField() {
        _classCallCheck(this, NumberField);

        var _this5 = _possibleConstructorReturn(this, (NumberField.__proto__ || Object.getPrototypeOf(NumberField)).apply(this, arguments));

        _this5.Input = function (props) {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](DynamicInput, { style: style, id: props.id, name: props.id, defaultValue: props.value, type: 'number' });
        };
        return _this5;
    }

    return NumberField;
}(Field);
var DateField = function (_Field2) {
    _inherits(DateField, _Field2);

    function DateField() {
        _classCallCheck(this, DateField);

        var _this6 = _possibleConstructorReturn(this, (DateField.__proto__ || Object.getPrototypeOf(DateField)).apply(this, arguments));

        _this6.Input = function (props) {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("input", { style: style, id: props.id, name: props.id, defaultValue: props.value, type: 'date' });
        };
        return _this6;
    }

    _createClass(DateField, [{
        key: 'conditions',
        get: function get() {
            return [new Field('gt', 'after'), new Field('lt', 'before')];
        }
    }]);

    return DateField;
}(Field);
var BooleanField = function (_Field3) {
    _inherits(BooleanField, _Field3);

    function BooleanField() {
        _classCallCheck(this, BooleanField);

        var _this7 = _possibleConstructorReturn(this, (BooleanField.__proto__ || Object.getPrototypeOf(BooleanField)).apply(this, arguments));

        _this7.Input = function (props) {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("select", { style: style, name: props.id, id: props.id, defaultValue: props.value }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("option", { value: 'true' }, "True"), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("option", { value: 'false' }, "False"));
        };
        return _this7;
    }

    return BooleanField;
}(Field);
var SelectSwitchCase = function SelectSwitchCase(props) {
    return null;
};
var SelectSwitch = function SelectSwitch(_ref3) {
    var id = _ref3.id,
        choices = _ref3.choices,
        children = _ref3.children;
    return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](PropsSelector, { choices: choices, id: id, properties: __WEBPACK_IMPORTED_MODULE_0_react__["Children"].toArray(children).filter(function (child) {
            return child && child.type === SelectSwitchCase;
        }).map(function (child) {
            return child.props;
        }) }, function (field) {
        return field.children;
    });
};

/***/ })
],[1]);
});