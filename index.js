'use strict';

var React;
var events = require('events');
var _ = require('lodash');

var TRANSITION_BODY_DURATION = 0.6;
var TRANSITION_BODY_TIMING_FUNCTION = 'ease-in-out';
var TRANSITION_END_DURATION = 0;
var TRANSITION_END_TIMING_FUNCTION = 'ease-in';
var ANIMATE_OUT_CLASS_NAME = 'leaving';
var REACT_ID_RE = /(<[^>]+)(data-reactid)([^>]*>)/gm;
var OPACITY_MANAGED_BY_TWEEN = 'data-opacity-managed';

var elementComunicator = new events.EventEmitter();
elementComunicator.setMaxListeners(101);

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

function serializeNode(node, ref) {
	// Serialize a node in a form that createClone will use
	var element = React.findDOMNode(node);
	var rect = element.getBoundingClientRect();

	// Set input state values to HTML values so they don't change when creating the clone
	_.forEach(element.getElementsByTagName('input'), function (input) {
		input.setAttribute('value', input.value);
	});
	_.forEach(element.getElementsByTagName('textarea'), function (textarea) {
		textarea.innerHTML = textarea.value;
	});

	// React will pick up on the ids of the clone and get confused, so change them
	var outerHTML = element.outerHTML.replace(REACT_ID_RE, '$1data-_reactid$3');

	return {
		ref: ref, rect: rect, outerHTML: outerHTML
	};
}

function animateElement(_ref2) {
	var container = _ref2.container;
	var toRect = _ref2.toRect;
	var fromRect = _ref2.fromRect;
	var originalElem = _ref2.originalElem;
	var toElem = _ref2.toElem;
	var fromElem = _ref2.fromElem;
	var bodyDuration = _ref2.bodyDuration;
	var bodyTimingFunction = _ref2.bodyTimingFunction;
	var endDuration = _ref2.endDuration;
	var endTimingFunction = _ref2.endTimingFunction;
	var callback = _ref2.callback;
	var triggerAnimationCallback = _ref2.triggerAnimationCallback;

	// To animate components, set initial scales, opacities, and transitions on the elements, and in the next frame, add the new initial scales and opacities.
	var scaleX = fromRect.width / toRect.width;
	var scaleY = fromRect.height / toRect.height;

	var transition = 'all ' + bodyDuration + 's ' + bodyTimingFunction;
	var translate = 'translate(' + fromRect.left + 'px, ' + fromRect.top + 'px)';
	var fromTransform = '' + translate + ' scale(1, 1)';
	var toTransform = '' + translate + ' scale(' + scaleX + ', ' + scaleY + ')';

	var sharedStyles = {
		transition: transition,
		transformOrigin: '0 0',
		webkitTransformOrigin: '0 0'
	};

	var fromStyles = {
		transform: fromTransform,
		webkitTransform: fromTransform
	};

	var toStyles = {
		transform: toTransform,
		webkitTransform: toTransform,
		opacity: 0
	};

	originalElem.style.opacity = 0;
	originalElem.setAttribute(OPACITY_MANAGED_BY_TWEEN, 'true');

	_.assign(fromElem.style, sharedStyles, fromStyles);
	_.assign(toElem.style, sharedStyles, toStyles);

	requestNextAnimationFrame(function () {
		var scaleX = toRect.width / fromElem.offsetWidth;
		var scaleY = toRect.height / fromElem.offsetHeight;

		var toTranslate = 'translate(' + toRect.left + 'px, ' + toRect.top + 'px)';
		var toTransform = '' + toTranslate + ' scale(1, 1)';
		var fromTransform = '' + toTranslate + ' scale(' + scaleX + ', ' + scaleY + ')';

		var fromStyles = {
			transform: fromTransform,
			webkitTransform: fromTransform
		};

		var toStyles = {
			transform: toTransform,
			webkitTransform: toTransform,
			opacity: ''
		};

		_.assign(fromElem.style, fromStyles);
		_.assign(toElem.style, toStyles);
	});

	toElem.addEventListener('transitionend', function fadeOutToElement() {
		originalElem.style.opacity = '';
		toElem.removeEventListener('transitionend', fadeOutToElement);
		fromElem.remove();
		triggerAnimationCallback();

		if (endDuration > 0.01) {
			// Fade the clone of the original element to the original element in the case that it has updated during the animation (off by default)
			toElem.style.transition = 'opacity ' + endDuration + 's ' + endTimingFunction;
			toElem.style.pointerEvents = 'none';

			requestNextAnimationFrame(function () {
				toElem.addEventListener('transitionend', function removeContainer() {
					// Probably not needed, best to be safe
					toElem.removeEventListener('transitionend', removeContainer);
					toElem.remove();

					elementComunicator.removeListener('animating-to', removeAnimatingToElements);
					elementComunicator.removeListener('animating-from', removeAnimatingFromElements);

					callback();
				});

				toElem.style.opacity = 0;
			});
		} else {
			// Remove the clone of the original element, and this animation is complete
			toElem.remove();
			callback();
		}
	});

	elementComunicator.addListener('animating-to', removeAnimatingToElements);
	elementComunicator.addListener('animating-from', removeAnimatingFromElements);

	// elementCommunicator isn't async, so if we emit outside of a setTimeout, some elements will be missing, and if we do it inside a setTimout, there can be a frame flash. Do both!
	function emitHandlers() {
		elementComunicator.emit('animating-to', toElem.getAttribute('data-_reactid'));
		elementComunicator.emit('animating-from', fromElem.getAttribute('data-_reactid'));
	}
	setTimeout(emitHandlers, 0);
	emitHandlers();

	container.appendChild(fromElem);
	container.appendChild(toElem);

	// If an element and one of its subchildren is being transitioned, we don't want to animate both of them, else there will be duplicated artifacts. So we remove all child elements that are being animated. This pretty much has to be done with an event listener.
	function removeAnimatingToElements(id) {
		_.forEach(toElem.querySelectorAll('[data-_reactid="' + id + '"]'), function (element) {
			if (element !== toElem) {
				element.style.opacity = 0;
			}
		});
	}

	function removeAnimatingFromElements(id) {
		_.forEach(fromElem.querySelectorAll('[data-_reactid="' + id + '"]'), function (element) {
			if (element !== fromElem) {
				element.style.opacity = 0;
			}
		});
	}
}

function resetElement(_ref3) {
	var originalElem = _ref3.originalElem;
	var toElem = _ref3.toElem;
	var fromElem = _ref3.fromElem;
	var callback = _ref3.callback;

	originalElem.style.opacity = '';
	toElem.style.opacity = '';
	fromElem.style.opacity = '';
	callback();
}

function animateElements(_ref4, fromRefs, toRefs) {
	var refs = _ref4.refs;
	var bodyDuration = _ref4.bodyDuration;
	var bodyTimingFunction = _ref4.bodyTimingFunction;
	var endDuration = _ref4.endDuration;
	var endTimingFunction = _ref4.endTimingFunction;

	var sharedKeys = _.intersection(_.keys(fromRefs), _.keys(toRefs));

	if (sharedKeys.length > 0) {
		var container = document.createElement('div');

		var elementAnimationFinish = _.after(sharedKeys.length, function removeContainer() {
			container.remove();
		});

		var _$map$groupBy$value = _(sharedKeys).map(function (key) {
			return {
				container: container,
				bodyDuration: bodyDuration,
				bodyTimingFunction: bodyTimingFunction,
				endDuration: endDuration,
				endTimingFunction: endTimingFunction,
				toRect: toRefs[key].rect,
				fromRect: fromRefs[key].rect,
				toElem: createClone(toRefs[key]),
				fromElem: createClone(fromRefs[key]),
				originalElem: React.findDOMNode(refs[key]),
				callback: elementAnimationFinish,
				triggerAnimationCallback: function triggerAnimationCallback() {
					_.result(refs, [key, 'animationDidFinish']);
				}
			};
		}).groupBy(function (_ref5) {
			var fromElem = _ref5.fromElem;

			if (String(fromElem.style.opacity) === '0') {
				// A result of two quick successions
				// We're dealing with an element inside React's reach that we've manually set the opacity of
				// We'll just reset it
				return 'reset';
			} else {
				return 'animate';
			}
		}).value();

		var reset = _$map$groupBy$value.reset;
		var animate = _$map$groupBy$value.animate;

		_.forEach(reset, resetElement);
		_.forEach(animate, animateElement);

		document.body.appendChild(container);
	}
}

var itemTransition = (function () {
	// This is definitely a hack. To work around react not providing a 'a whole view just changed' handler, we have to use timeouts. We start two lists formed of components that will unmount (from), and components that have mounted (to). The handlers will call a function (tranisionFrom, transitionTo) to append to one of these lists. When the first function is called, we know that the view is about to update, so we set a timeout. Due to the synchronous nature of React and the event loop of JavaScript, this will be called once the whole view has changed. Once this is called, we have to reset the lists to empty so we can recognise a new view.
	var context = null;
	var to = null;
	var from = null;
	var timerId = null;

	function fireAnimation() {
		animateElements(context, from, to);

		context = null;
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

	function setContext(newContext) {
		context = newContext;
	}

	function transitionTo(serial) {
		if (to === null) {
			to = {};
		}

		if (!to[serial.ref]) {
			to[serial.ref] = serial;
			queueAnimation();
		} else {
			throw new Error('Transitioning to duplicate ref (' + serial.ref + ')');
		}
	}

	function transitionFrom(serial) {
		if (from === null) {
			from = {};
		}

		if (!from[serial.ref]) {
			from[serial.ref] = serial;
			queueAnimation();
		} else {
			throw new Error('Transitioning from duplicate ref (' + serial.ref + ')');
		}
	}

	return { transitionTo: transitionTo, transitionFrom: transitionFrom, setContext: setContext };
})();

var TweenState = {
	componentWillUnmount: function componentWillUnmount() {
		// To the surprise of many, React isn't all that fast sometimes---especially in Safari. When this component unmounts, there can be a substantial delay until the next component is mounted. This causes a flicker, so to work around this, just show the current component in place until the next component is mounted.
		var node = serializeNode(React.findDOMNode(this));
		var element = createClone(node);

		// Don't allow default animations on the element (to be safe)
		_.assign(element.style, {
			animation: 'none',
			webkitAnimation: 'none',
			top: node.rect.top + 'px',
			left: node.rect.left + 'px'
		});

		document.body.appendChild(element);

		var refs = _.result(this, 'getRefs', this.refs);
		_(refs).mapValues(serializeNode).forEach(itemTransition.transitionFrom).value();

		// Remove the placeholder element once everything is finished (setTimeout, for the moment, is guaranteed to be finished after the next component is mounted)
		setTimeout(function () {
			// Called after animations are initialised
			element.remove();
		}, 0);
	},
	componentDidMount: function componentDidMount() {
		// React doesn't provide a 'whole view just loaded' handler. To work around this, we use a setTimeout, which will be fired after this happens. However, this does mean that this element will flash on the screen, so we have to temporarily hide it. This has to be done regardless of whether the element will be animated.
		var node = React.findDOMNode(this);
		node.style.opacity = 0;

		var refs = _.result(this, 'getRefs', this.refs);
		var bodyDuration = _.get(this, 'transitionBodyDuration', TRANSITION_BODY_DURATION);
		var bodyTimingFunction = _.get(this, 'transitionBodyTimingFunction', TRANSITION_BODY_TIMING_FUNCTION);
		var endDuration = _.get(this, 'transitionEndDuration', TRANSITION_END_DURATION);
		var endTimingFunction = _.get(this, 'transitionEndTimingFunction', TRANSITION_END_TIMING_FUNCTION);

		itemTransition.setContext({
			refs: refs,
			bodyDuration: bodyDuration,
			bodyTimingFunction: bodyTimingFunction,
			endDuration: endDuration,
			endTimingFunction: endTimingFunction
		});
		_(refs).mapValues(serializeNode).forEach(itemTransition.transitionTo).value();

		// In the animateElement, we override the opacity. We don't want to override what animateElement is doing, so we set a flag (OPACITY_MANAGED_BY_TWEEN) on the element to say that the opacity is managed. If it isn't managed, we reset it.
		setTimeout(function () {
			// Called after animations are initialised
			if (node.getAttribute(OPACITY_MANAGED_BY_TWEEN) !== 'true') {
				node.style.opacity = '';
			}

			node.removeAttribute(OPACITY_MANAGED_BY_TWEEN);
		}, 0);
	}
};

var TransitionInOut = {
	componentWillUnmount: function componentWillUnmount() {
		var _this = this;

		// The gist here is that we clone the element in place and assign a 'leave' animation to it. When the animation finishes, we remove the clone from the dom.
		var ref = React.findDOMNode(this);

		var elem = serializeNode(ref);
		var node = createClone(elem);

		node.style.top = elem.rect.top + 'px';
		node.style.left = elem.rect.left + 'px';
		node.classList.add(_.get(this, 'animateOutClassName', ANIMATE_OUT_CLASS_NAME));

		// Same as in animateElements
		function removeAnimatingElements(id) {
			_.forEach(node.querySelectorAll('[data-_reactid="' + id + '"]'), function (element) {
				// Don't remove incase it fucks up the DOM
				element.style.opacity = 0;
			});
		}

		elementComunicator.addListener('animating-from', removeAnimatingElements);

		function animationend() {
			node.removeEventListener('animationend', animationend);
			node.removeEventListener('webkitAnimationEnd', animationend);

			elementComunicator.removeListener('animating-from', removeAnimatingElements);

			node.remove();
		}

		node.addEventListener('animationend', animationend);
		node.addEventListener('webkitAnimationEnd', animationend);

		requestNextAnimationFrame(function () {
			var styles = window.getComputedStyle(node);

			if (!(styles.animationName && styles.animationName !== 'none') && !(styles.webkitAnimationName && styles.webkitAnimationName !== 'none')) {
				console.warn('No animation set on element', _this);
				// No animation set, just remove the node
				animationend();
			}
		});

		document.body.appendChild(node);
	}
};

module.exports = function init(react) {
	// We have to use the user's React object, as it stores state and stuff.
	React = react;

	return {
		TweenState: TweenState, TransitionInOut: TransitionInOut
	};
};
