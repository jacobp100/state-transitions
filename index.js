'use strict';

var React;
const events = require('events');
const _ = require('lodash');

const TRANSITION_BODY_TIME = 0.6;
const TRANSITION_END_TIME = 0.1;
const REACT_ID_RE = /(<[^>]+)(data-reactid)([^>]*>)/gm;
const OPACITY_MANAGED_BY_TWEEN = 'data-opacity-managed';

const elementComunicator = new events.EventEmitter();


function createClone({ outerHTML, rect }) {
	var container = document.createElement('div');
	container.innerHTML = outerHTML;

	var element = container.firstChild;

	element.style.position = 'absolute';
	element.style.margin = '0';
	element.style.boxSizing = 'border-box';
	element.style.top = window.scrollY + 'px';
	element.style.left = window.scrollY + 'px';
	element.style.maxWidth = 'none';
	element.style.maxHeight = 'none';
	element.style.width = rect.width + 'px';
	element.style.height = rect.height + 'px';

	return element;
}

function requestNextAnimationFrame(callback) {
	requestAnimationFrame(() => {
		requestAnimationFrame(callback);
	});
}

function serializeNode(node, ref) {
	var element = React.findDOMNode(node);

	var rect = element.getBoundingClientRect();

	// Sigh
	_.forEach(element.getElementsByTagName('input'), input => {
		input.setAttribute('value', input.value);
	});
	_.forEach(element.getElementsByTagName('textarea'), textarea => {
		textarea.innerHTML = textarea.value;
	});

	var outerHTML = element.outerHTML.replace(REACT_ID_RE, '$1data-_reactid$3');

	return {
		ref, rect, outerHTML
	};
}

function animateElements(fromRefs, toRefs, originalElements) {
	var container = document.createElement('div');

	var sharedKeys = _.intersection(_.keys(fromRefs), _.keys(toRefs));


	var elementAnimationFinish = _.after(sharedKeys.length, function removeContainer() {
		container.remove();
	});

	_.forEach(sharedKeys, key => {
		var to = toRefs[key];
		var from = fromRefs[key];
		var originalElement = React.findDOMNode(originalElements[key]);

		var fromElem = createClone(from);
		var toElem = createClone(to);


		if (String(fromElem.style.opacity) === '0') {
			// Two quick successive navigations can cause glitches
			originalElement.style.opacity = '';
			toElem.style.opacity = '';
			fromElem.style.opacity = '';
			elementAnimationFinish();
		} else {
			var scaleX = from.rect.width / to.rect.width;
			var scaleY = from.rect.height / to.rect.height;

			var transition = `all ${TRANSITION_BODY_TIME}s ease-in-out`;
			var translate = `translate(${from.rect.left}px, ${from.rect.top}px)`;
			var fromTransform = `${translate} scale(1, 1)`;
			var toTransform = `${translate} scale(${scaleX}, ${scaleY})`;

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

			originalElement.style.opacity = 0;
			originalElement.setAttribute(OPACITY_MANAGED_BY_TWEEN, 'true');

			_.assign(fromElem.style, sharedStyles, fromStyles);
			_.assign(toElem.style, sharedStyles, toStyles);

			requestNextAnimationFrame(() => {
				var scaleX = to.rect.width / fromElem.offsetWidth;
				var scaleY = to.rect.height / fromElem.offsetHeight;

				var toTranslate = `translate(${to.rect.left}px, ${to.rect.top}px)`;
				var toTransform = `${toTranslate} scale(1, 1)`;
				var fromTransform = `${toTranslate} scale(${scaleX}, ${scaleY})`;

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
				toElem.removeEventListener('transitionend', fadeOutToElement);
				fromElem.remove();

				originalElement.style.opacity = '';

				toElem.style.transition = `opacity ${TRANSITION_END_TIME}s ease-in`;
				toElem.style.pointerEvents = 'none';

				_.result(originalElements, [key, 'animationDidFinish']);

				requestNextAnimationFrame(() => {
					toElem.addEventListener('transitionend', function removeContainer() {
						// Probably not needed, best to be safe
						toElem.removeEventListener('transitionend', removeContainer);

						elementComunicator.removeListener('animating-to', removeAnimatingToElements);
						elementComunicator.removeListener('animating-from', removeAnimatingFromElements);

						elementAnimationFinish();
					});

					toElem.style.opacity = 0;
				});
			});

			// Function-block ES6 syntax
			function removeAnimatingToElements(id) {
				_.forEach(toElem.querySelectorAll(`[data-_reactid="${id}"]`), element => {
					if (element !== toElem) {
						element.style.opacity = 0;
					}
				});
			}

			function removeAnimatingFromElements(id) {
				_.forEach(fromElem.querySelectorAll(`[data-_reactid="${id}"]`), element => {
					if (element !== fromElem) {
						element.style.opacity = 0;
					}
				});
			}

			elementComunicator.addListener('animating-to', removeAnimatingToElements);
			elementComunicator.addListener('animating-from', removeAnimatingFromElements);

			elementComunicator.emit('animating-to', toElem.getAttribute('data-_reactid'));
			elementComunicator.emit('animating-from', fromElem.getAttribute('data-_reactid'));
			setTimeout(() => {
				elementComunicator.emit('animating-to', toElem.getAttribute('data-_reactid'));
				elementComunicator.emit('animating-from', fromElem.getAttribute('data-_reactid'));
			}, 0);

			container.appendChild(fromElem);
			container.appendChild(toElem);
		}
	});

	document.body.appendChild(container);
}

const itemTransition = (() => {
	var base = null;
	var to = null;
	var from = null;
	var timerId = null;

	function fireAnimation() {
		animateElements(from, to, base);

		base = null;
		to = null;
		from = null;
		timerId = null;
	}

	function queueAnimation() {
		if (timerId === null) {
			// All the updates are (currently) done synchronously, so this will fire after all updates are finished
			// spec says setTimeout is actually 5ms, so this may leak frames
			timerId = setTimeout(fireAnimation, 0);
		}
	}

	function setBase(newBase) {
		base = newBase;
	}

	function transitionTo(serial) {
		if (to === null) {
			to = {};
		}

		if (!to[serial.ref]) {
			to[serial.ref] = serial;
			queueAnimation();
		} else {
			//throw new Error(`Transitioning to duplicate ref (${serial.ref})`);
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
			//throw new Error(`Transitioning from duplicate ref (${serial.ref})`);
		}
	}

	return { transitionTo, transitionFrom, setBase };
})();

const TweenState = {
	getRefs() {
		return this.refs;
	},
	componentWillUnmount() {
		// We can get a flicker when the next component is loading, just show the current element in the mean time
		var element = createClone(serializeNode(React.findDOMNode(this)));

		_.assign(element.style, {
			animation: 'none',
			webkitAnimation: 'none'
		});

		document.body.appendChild(element);

		console.log(element.getBoundingClientRect());

		_(this.getRefs()).mapValues(serializeNode).forEach(itemTransition.transitionFrom).value();

		setTimeout(() => {
			element.remove();
		}, 0);
	},
	componentDidMount() {
		var node = React.findDOMNode(this);

		node.style.opacity = 0;

		setTimeout(() => {
			if (node.getAttribute(OPACITY_MANAGED_BY_TWEEN) !== 'true') {
				node.style.opacity = '';
			}

			node.removeAttribute(OPACITY_MANAGED_BY_TWEEN);
		}, 0);

		var refs = this.getRefs();

		itemTransition.setBase(refs);

		_(refs).mapValues(serializeNode).forEach(itemTransition.transitionTo).value();
	}
};

const TransitionInOut = {
	componentWillUnmount() {
		var ref = React.findDOMNode(this);

		var elem = serializeNode(ref);
		var node = createClone(elem);

		node.style.top = elem.rect.top + 'px';
		node.style.left = elem.rect.left + 'px';
		node.classList.add(this.animateOutClassName || 'leaving');


		function removeAnimatingElements(id) {
			_.forEach(node.querySelectorAll(`[data-_reactid="${id}"]`), element => {
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


		requestNextAnimationFrame(() => {
			var styles = window.getComputedStyle(node);

			if (!(styles.animationName && styles.animationName !== 'none') && !(styles.webkitAnimationName && styles.webkitAnimationName !== 'none')) {
				console.warn('No animation set on element', this);
				// No animation set, just remove the node
				animationend();
			}
		});


		document.body.appendChild(node);
	}
};

module.exports = function init(react) {
	React = react;

	return {
		TweenState, TransitionInOut
	};
};
