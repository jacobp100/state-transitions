(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("lodash"), require("events"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "lodash", "events"], factory);
	else if(typeof exports === 'object')
		exports["state-transitions"] = factory(require("react"), require("react-dom"), require("lodash"), require("events"));
	else
		root["state-transitions"] = factory(root["react"], root["react-dom"], root["lodash"], root["events"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _AnimateInOut = __webpack_require__(1);
	
	Object.defineProperty(exports, 'AnimateInOut', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_AnimateInOut).default;
	  }
	});
	
	var _TweenState = __webpack_require__(8);
	
	Object.defineProperty(exports, 'TweenState', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_TweenState).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(3);
	
	var _lodash = __webpack_require__(4);
	
	var _elementCommunicator = __webpack_require__(5);
	
	var _elementCommunicator2 = _interopRequireDefault(_elementCommunicator);
	
	var _util = __webpack_require__(7);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AnimateInOut = function (_React$Component) {
	  _inherits(AnimateInOut, _React$Component);
	
	  function AnimateInOut() {
	    _classCallCheck(this, AnimateInOut);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(AnimateInOut).apply(this, arguments));
	  }
	
	  _createClass(AnimateInOut, [{
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      var _transitionOutElement,
	          _this2 = this;
	
	      // The gist here is that we clone the element in place and assign a 'leave' animation to it. When the animation finishes, we remove the clone from the dom.
	      var originalElement = (0, _reactDom.findDOMNode)(this);
	
	      var transitionElement = (0, _util.serializeNode)(originalElement);
	      var transitionOutElement = (0, _util.createClone)(transitionElement);
	
	      transitionOutElement.style.top = transitionElement.rect.top + 'px';
	      transitionOutElement.style.left = transitionElement.rect.left + 'px';
	      (_transitionOutElement = transitionOutElement.classList).add.apply(_transitionOutElement, _toConsumableArray(this.props.animateOutClassName.split(' ')));
	
	      // Same as in animateElements
	      function removeAnimatingElements(id) {
	        (0, _lodash.forEach)(transitionOutElement.querySelectorAll('[data-_reactid="' + id + '"]'), function (element) {
	          // Don't remove incase it fucks up the DOM
	          element.style.opacity = 0;
	        });
	      }
	
	      _elementCommunicator2.default.addListener('animating-from', removeAnimatingElements);
	
	      function animationEnd() {
	        transitionOutElement.removeEventListener('animationend', animationEnd);
	        transitionOutElement.removeEventListener('webkitAnimationEnd', animationEnd);
	
	        _elementCommunicator2.default.removeListener('animating-from', removeAnimatingElements);
	
	        transitionOutElement.remove();
	      }
	
	      transitionOutElement.addEventListener('animationend', animationEnd);
	      transitionOutElement.addEventListener('webkitAnimationEnd', animationEnd);
	
	      (0, _util.requestNextAnimationFrame)(function () {
	        var styles = window.getComputedStyle(transitionOutElement);
	
	        if (!styles.animationName && !styles.webkitAnimationName) {
	          // Animations not available, just remove the node
	          animationEnd();
	        } else if (styles.animationName === 'none') {
	          // User bug: no animation set, just remove the node
	          // Only Safari 8 requires webkitAnimationName, so let's not make that a requirement for the user
	          console.warn('No animation set on element', _this2);
	          animationEnd();
	        }
	      });
	
	      document.body.appendChild(transitionOutElement);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.Children.only(this.props.children);
	    }
	  }]);
	
	  return AnimateInOut;
	}(_react2.default.Component);
	
	exports.default = AnimateInOut;
	
	
	AnimateInOut.propTypes = {
	  animateOutClassName: _react2.default.PropTypes.string,
	  children: _react2.default.PropTypes.object
	};
	AnimateInOut.defaultProps = {
	  animateOutClassName: 'leaving'
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _events = __webpack_require__(6);
	
	var elementCommunicator = new _events.EventEmitter();
	elementCommunicator.setMaxListeners(101);
	
	exports.default = elementCommunicator;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.requestNextAnimationFrame = requestNextAnimationFrame;
	exports.createClone = createClone;
	exports.serializeNode = serializeNode;
	
	var _lodash = __webpack_require__(4);
	
	var REACT_ID_RE = /(<[^>]+)(data-reactid)([^>]*>)/gm;
	
	function requestNextAnimationFrame(callback) {
	  requestAnimationFrame(function () {
	    requestAnimationFrame(callback);
	  });
	}
	
	function createClone(_ref) {
	  var outerHTML = _ref.outerHTML;
	  var rect = _ref.rect;
	
	  // Creates a clone that fits exactly in the space that the previous element used
	  var container = document.createElement('div');
	  container.innerHTML = outerHTML;
	
	  var element = container.firstChild;
	
	  element.style.position = 'absolute';
	  // Margin isn't included in getBoundingClientRect, so we have to clear it
	  element.style.margin = '0px';
	  // Content, padding, and border sizes are, so we have to use border-box sizing
	  element.style.boxSizing = 'border-box';
	  element.style.top = '0px';
	  element.style.left = '0px';
	  // If they set a max dimension with content-box sizing, it will change when we use box-sizing, so we have to clear these
	  element.style.maxWidth = 'none';
	  element.style.maxHeight = 'none';
	  element.style.width = rect.width + 'px';
	  element.style.height = rect.height + 'px';
	
	  return element;
	}
	
	function serializeNode(node, id) {
	  // Serialize a node in a form that createClone will use
	  var rect = node.getBoundingClientRect();
	
	  // Set input state values to HTML values so they don't change when creating the clone
	  (0, _lodash.forEach)(node.getElementsByTagName('input'), function (input) {
	    input.setAttribute('value', input.value);
	  });
	  (0, _lodash.forEach)(node.getElementsByTagName('textarea'), function (textarea) {
	    textarea.innerHTML = textarea.value;
	  });
	
	  // React will pick up on the ids of the clone and get confused, so change them
	  var outerHTML = node.outerHTML.replace(REACT_ID_RE, '$1data-_reactid$3');
	
	  return { id: id, rect: rect, outerHTML: outerHTML };
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(3);
	
	var _lodash = __webpack_require__(4);
	
	var _util = __webpack_require__(7);
	
	var _constants = __webpack_require__(9);
	
	var _itemTransition = __webpack_require__(10);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var contextProps = ['duration', 'timingFunction', 'delay', 'fadeOutDuration', 'fadeOutTimingFunction', 'fadeOutDelay', 'animateFromClassName', 'animateToClassName'];
	
	var TweenState = function (_React$Component) {
	  _inherits(TweenState, _React$Component);
	
	  function TweenState() {
	    _classCallCheck(this, TweenState);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(TweenState).apply(this, arguments));
	  }
	
	  _createClass(TweenState, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      // React doesn't provide a 'whole view just loaded' handler. To work around this, we use a setTimeout, which will be fired after this happens. However, this does mean that this element will flash on the screen, so we have to temporarily hide it. This has to be done regardless of whether the element will be animated.
	      var originalElement = (0, _reactDom.findDOMNode)(this);
	      var toElement = (0, _util.serializeNode)(originalElement, this.props.id);
	      var context = (0, _lodash.assign)({ toElement: toElement, originalElement: originalElement }, (0, _lodash.pick)(this.props, contextProps));
	
	      originalElement.style.opacity = 0;
	
	      (0, _itemTransition.transitionTo)(context);
	
	      // In the animateElement, we override the opacity. We don't want to override what animateElement is doing, so we set a flag (OPACITY_MANAGED_BY_TWEEN) on the element to say that the opacity is managed. If it isn't managed, we reset it.
	      setTimeout(function () {
	        // Called after animations are initialised
	        if (originalElement.getAttribute(_constants.OPACITY_MANAGED_BY_TWEEN) !== 'true') {
	          originalElement.style.opacity = '';
	        }
	
	        originalElement.removeAttribute(_constants.OPACITY_MANAGED_BY_TWEEN);
	      }, 0);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      var originalElement = (0, _reactDom.findDOMNode)(this);
	      var fromElement = (0, _util.serializeNode)(originalElement, this.props.id);
	
	      var placeholderElement = (0, _util.createClone)(fromElement);
	
	      // Don't allow default animations on the element (to be safe)
	      (0, _lodash.assign)(placeholderElement.style, {
	        animation: 'none',
	        webkitAnimation: 'none',
	        top: fromElement.rect.top + 'px',
	        left: fromElement.rect.left + 'px'
	      });
	
	      document.body.appendChild(placeholderElement);
	
	      (0, _itemTransition.transitionFrom)({ fromElement: fromElement });
	
	      // Remove the placeholder element once everything is finished (setTimeout, for the moment, is guaranteed to be finished after the next component is mounted)
	      setTimeout(function () {
	        // Called after animations are initialised
	        placeholderElement.remove();
	      }, 0);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.Children.only(this.props.children);
	    }
	  }]);
	
	  return TweenState;
	}(_react2.default.Component);
	
	exports.default = TweenState;
	
	
	TweenState.propTypes = {
	  id: _react2.default.PropTypes.string.isRequired,
	  duration: _react2.default.PropTypes.number,
	  timingFunction: _react2.default.PropTypes.string,
	  delay: _react2.default.PropTypes.number,
	  fadeOutDuration: _react2.default.PropTypes.number,
	  fadeOutTimingFunction: _react2.default.PropTypes.string,
	  fadeOutDelay: _react2.default.PropTypes.number,
	  animateFromClassName: _react2.default.PropTypes.string,
	  animateToClassName: _react2.default.PropTypes.string,
	  children: _react2.default.PropTypes.object
	};
	TweenState.defaultProps = {
	  duration: 0.6,
	  timingFunction: 'ease-in-out',
	  delay: 0,
	  fadeOutDuration: 0,
	  fadeOutTimingFunction: 'ease-in',
	  fadeOutDelay: 0,
	  animateFromClassName: 'tween-state-animating tween-state-animating-from',
	  animateToClassName: 'tween-state-animating tween-state-animating-to'
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var OPACITY_MANAGED_BY_TWEEN = exports.OPACITY_MANAGED_BY_TWEEN = 'data-opacity-managed';

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.transitionFrom = exports.transitionTo = undefined;
	
	var _lodash = __webpack_require__(4);
	
	var _animateBetween = __webpack_require__(11);
	
	var _animateBetween2 = _interopRequireDefault(_animateBetween);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// This is definitely a hack. To work around react not providing a 'a whole view just changed' handler, we have to use timeouts. We start two lists formed of components that will unmount (from), and components that have mounted (to). The handlers will call a function (tranisionFrom, transitionTo) to append to one of these lists. When the first function is called, we know that the view is about to update, so we set a timeout. Due to the synchronous nature of React and the event loop of JavaScript, this will be called once the whole view has changed. Once this is called, we have to reset the lists to empty so we can recognise a new view.
	var to = null;
	var from = null;
	var timerId = null;
	
	function fireAnimation() {
	  var fromKeys = (0, _lodash.keys)(from);
	  var toKeys = (0, _lodash.keys)(to);
	  var intersectingKeys = (0, _lodash.intersection)(toKeys, fromKeys);
	  (0, _lodash.forEach)(intersectingKeys, function (key) {
	    (0, _animateBetween2.default)(from[key], to[key]);
	  });
	
	  to = null;
	  from = null;
	  timerId = null;
	}
	
	function queueAnimation() {
	  if (timerId === null) {
	    // Spec says setTimeout(..., 0) is actually 5ms, so this may occasionally leak frames, there's nothing I can do about it
	    timerId = setTimeout(fireAnimation, 0);
	  }
	}
	
	function transitionTo(serial) {
	  if (to === null) {
	    to = {};
	  }
	
	  var id = serial.toElement.id;
	
	
	  if (!to[id]) {
	    to[id] = serial;
	    queueAnimation();
	  } else {
	    throw new Error('Transitioning to duplicate id (' + serial.id + ')');
	  }
	}
	
	function transitionFrom(serial) {
	  if (from === null) {
	    from = {};
	  }
	
	  var id = serial.fromElement.id;
	
	
	  if (!from[id]) {
	    from[id] = serial;
	    queueAnimation();
	  } else {
	    throw new Error('Transitioning from duplicate id (' + serial.id + ')');
	  }
	}
	
	exports.transitionTo = transitionTo;
	exports.transitionFrom = transitionFrom;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = animateBetween;
	
	var _lodash = __webpack_require__(4);
	
	var _elementCommunicator = __webpack_require__(5);
	
	var _elementCommunicator2 = _interopRequireDefault(_elementCommunicator);
	
	var _util = __webpack_require__(7);
	
	var _constants = __webpack_require__(9);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	// If an element and one of its subchildren is being transitioned, we don't want to animate both of them, else there will be duplicated artifacts. So we remove all child elements that are being animated. This pretty much has to be done with an event listener.
	function removeAnimatingElements(clone) {
	  return function (id) {
	    (0, _lodash.forEach)(clone.querySelectorAll('[data-_reactid="' + id + '"]'), function (element) {
	      if (element !== clone) {
	        element.style.opacity = 0;
	      }
	    });
	  };
	}
	
	function animateElement(_ref) {
	  var _fromClone$classList, _toClone$classList;
	
	  var toRect = _ref.toRect;
	  var fromRect = _ref.fromRect;
	  var originalElement = _ref.originalElement;
	  var toElement = _ref.toElement;
	  var fromElement = _ref.fromElement;
	  var duration = _ref.duration;
	  var timingFunction = _ref.timingFunction;
	  var delay = _ref.delay;
	  var fadeOutDuration = _ref.fadeOutDuration;
	  var fadeOutTimingFunction = _ref.fadeOutTimingFunction;
	  var fadeOutDelay = _ref.fadeOutDelay;
	  var animateFromClassName = _ref.animateFromClassName;
	  var animateToClassName = _ref.animateToClassName;
	
	  var container = document.createElement('div');
	
	  var fromClone = fromElement;
	  var toClone = toElement;
	
	  // To animate components, set initial scales, opacities, and transitions on the elements, and in the next frame, add the new initial scales and opacities.
	  var preScaleX = fromRect.width / toRect.width;
	  var preScaleY = fromRect.height / toRect.height;
	
	  var preTransition = 'all ' + duration + 's ' + timingFunction + ' ' + delay + 's';
	  var preTranslate = 'translate(' + fromRect.left + 'px, ' + fromRect.top + 'px)';
	  var preFromTransform = preTranslate + ' scale(1, 1)';
	  var preToTransform = preTranslate + ' scale(' + preScaleX + ', ' + preScaleY + ')';
	
	  var preSharedStyles = {
	    transition: preTransition,
	    transformOrigin: '0 0',
	    webkitTransformOrigin: '0 0'
	  };
	
	  var preFromStyles = {
	    transform: preFromTransform,
	    webkitTransform: preFromTransform
	  };
	
	  var preToStyles = {
	    transform: preToTransform,
	    webkitTransform: preToTransform,
	    opacity: 0
	  };
	
	  (0, _lodash.assign)(fromClone.style, preSharedStyles, preFromStyles);
	  (0, _lodash.assign)(toClone.style, preSharedStyles, preToStyles);
	
	  if (!toClone.style.transitionProperty) {
	    return; // Transitions not supported;
	  }
	
	  (_fromClone$classList = fromClone.classList).add.apply(_fromClone$classList, _toConsumableArray(animateFromClassName.split(' ')));
	  (_toClone$classList = toClone.classList).add.apply(_toClone$classList, _toConsumableArray(animateToClassName.split(' ')));
	
	  document.body.appendChild(container);
	
	  originalElement.style.opacity = 0;
	  originalElement.setAttribute(_constants.OPACITY_MANAGED_BY_TWEEN, 'true');
	
	  (0, _util.requestNextAnimationFrame)(function () {
	    var postScaleX = toRect.width / fromClone.offsetWidth;
	    var postScaleY = toRect.height / fromClone.offsetHeight;
	
	    var postToTranslate = 'translate(' + toRect.left + 'px, ' + toRect.top + 'px)';
	    var postToTransform = postToTranslate + ' scale(1, 1)';
	    var postFromTransform = postToTranslate + ' scale(' + postScaleX + ', ' + postScaleY + ')';
	
	    var postFromStyles = {
	      transform: postFromTransform,
	      webkitTransform: postFromTransform
	    };
	
	    var postToStyles = {
	      transform: postToTransform,
	      webkitTransform: postToTransform,
	      opacity: ''
	    };
	
	    (0, _lodash.assign)(fromClone.style, postFromStyles);
	    (0, _lodash.assign)(toClone.style, postToStyles);
	  });
	
	  var removeAnimatingToElements = removeAnimatingElements(toClone);
	  var removeAnimatingFromElements = removeAnimatingElements(fromClone);
	  var finish = function finish() {
	    return container.remove();
	  };
	
	  toClone.addEventListener('transitionend', function fadeOutToElement() {
	    originalElement.style.opacity = '';
	    toClone.removeEventListener('transitionend', fadeOutToElement);
	    fromClone.remove();
	
	    if (fadeOutDuration > 0.01) {
	      // Fade the clone of the original element to the original element in the case that it has updated during the animation (off by default)
	      toClone.style.transition = 'opacity ' + fadeOutDuration + 's ' + fadeOutTimingFunction + ' ' + fadeOutDelay + 's';
	      toClone.style.pointerEvents = 'none';
	
	      (0, _util.requestNextAnimationFrame)(function () {
	        toClone.addEventListener('transitionend', function removeContainer() {
	          // Probably not needed, best to be safe
	          toClone.removeEventListener('transitionend', removeContainer);
	          toClone.remove();
	
	          _elementCommunicator2.default.removeListener('animating-to', removeAnimatingToElements);
	          _elementCommunicator2.default.removeListener('animating-from', removeAnimatingFromElements);
	
	          finish();
	        });
	
	        toClone.style.opacity = 0;
	      });
	    } else {
	      // Remove the clone of the original element, and this animation is complete
	      toClone.remove();
	      finish();
	    }
	  });
	
	  _elementCommunicator2.default.addListener('animating-to', removeAnimatingToElements);
	  _elementCommunicator2.default.addListener('animating-from', removeAnimatingFromElements);
	
	  // elementCommunicator isn't async, so if we emit outside of a setTimeout, some elements will be missing, and if we do it inside a setTimout, there can be a frame flash. Do both!
	  function emitHandlers() {
	    _elementCommunicator2.default.emit('animating-to', toClone.getAttribute('data-_reactid'));
	    _elementCommunicator2.default.emit('animating-from', fromClone.getAttribute('data-_reactid'));
	  }
	  setTimeout(emitHandlers, 0);
	  emitHandlers();
	
	  container.appendChild(fromClone);
	  container.appendChild(toClone);
	}
	
	function resetElement(_ref2) {
	  var originalElement = _ref2.originalElement;
	  var toElement = _ref2.toElement;
	  var fromElement = _ref2.fromElement;
	
	  originalElement.style.opacity = '';
	  toElement.style.opacity = '';
	  fromElement.style.opacity = '';
	}
	
	function animateBetween(from, to) {
	  var elements = {
	    duration: to.duration,
	    timingFunction: to.timingFunction,
	    delay: to.delay,
	    fadeOutDuration: to.fadeOutDuration,
	    fadeOutTimingFunction: to.fadeOutTimingFunction,
	    fadeOutDelay: to.fadeOutDelay,
	    animateFromClassName: to.animateFromClassName,
	    animateToClassName: to.animateToClassName,
	    toRect: to.toElement.rect,
	    fromRect: from.fromElement.rect,
	    toElement: (0, _util.createClone)(to.toElement),
	    fromElement: (0, _util.createClone)(from.fromElement),
	    originalElement: to.originalElement
	  };
	
	  if (String(elements.fromElement.style.opacity) !== '0') {
	    animateElement(elements);
	  } else {
	    // A result of two quick successions
	    // We're dealing with an element inside React's reach that we've manually set the opacity of
	    // We'll just reset it
	    resetElement(elements);
	  }
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map