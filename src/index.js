'use strict';

const events = require('events');
const _ = require('lodash');

const REACT_ID_RE = /(<[^>]+)(data-reactid)([^>]*>)/gm;
const OPACITY_MANAGED_BY_TWEEN = 'data-opacity-managed';



const elementComunicator = new events.EventEmitter();
elementComunicator.setMaxListeners(101);



function requestNextAnimationFrame(callback) {
	requestAnimationFrame(() => {
		requestAnimationFrame(callback);
	});
}

function createClone({ outerHTML, rect }) {
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
	_.forEach(node.getElementsByTagName('input'), input => {
		input.setAttribute('value', input.value);
	});
	_.forEach(node.getElementsByTagName('textarea'), textarea => {
		textarea.innerHTML = textarea.value;
	});

	// React will pick up on the ids of the clone and get confused, so change them
	var outerHTML = node.outerHTML.replace(REACT_ID_RE, '$1data-_reactid$3');

	return {
		id, rect, outerHTML
	};
}

function animateElement({ toRect, fromRect, originalElement, toElement, fromElement, bodyDuration, bodyTimingFunction, endDuration, endTimingFunction }) {
	var container = document.createElement('div');
	document.body.appendChild(container);

	var fromClone = /*createClone*/(fromElement);
	var toClone = /*createClone*/(toElement);

	// To animate components, set initial scales, opacities, and transitions on the elements, and in the next frame, add the new initial scales and opacities.
	var scaleX = fromRect.width / toRect.width;
	var scaleY = fromRect.height / toRect.height;

	var transition = `all ${bodyDuration}s ${bodyTimingFunction}`;
	var translate = `translate(${fromRect.left}px, ${fromRect.top}px)`;
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

	_.assign(fromClone.style, sharedStyles, fromStyles);
	_.assign(toClone.style, sharedStyles, toStyles);


	requestNextAnimationFrame(() => {
		var scaleX = toRect.width / fromClone.offsetWidth;
		var scaleY = toRect.height / fromClone.offsetHeight;

		var toTranslate = `translate(${toRect.left}px, ${toRect.top}px)`;
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

		_.assign(fromClone.style, fromStyles);
		_.assign(toClone.style, toStyles);
	});

	toClone.addEventListener('transitionend', function fadeOutToElement() {
		originalElement.style.opacity = '';
		toClone.removeEventListener('transitionend', fadeOutToElement);
		fromClone.remove();
		//triggerAnimationCallback();

		if (endDuration > 0.01) {
			// Fade the clone of the original element to the original element in the case that it has updated during the animation (off by default)
			toClone.style.transition = `opacity ${endDuration}s ${endTimingFunction}`;
			toClone.style.pointerEvents = 'none';

			requestNextAnimationFrame(() => {
				toClone.addEventListener('transitionend', function removeContainer() {
					// Probably not needed, best to be safe
					toClone.removeEventListener('transitionend', removeContainer);
					toClone.remove();

					elementComunicator.removeListener('animating-to', removeAnimatingToElements);
					elementComunicator.removeListener('animating-from', removeAnimatingFromElements);

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

	elementComunicator.addListener('animating-to', removeAnimatingToElements);
	elementComunicator.addListener('animating-from', removeAnimatingFromElements);

	// elementCommunicator isn't async, so if we emit outside of a setTimeout, some elements will be missing, and if we do it inside a setTimout, there can be a frame flash. Do both!
	function emitHandlers() {
		elementComunicator.emit('animating-to', toClone.getAttribute('data-_reactid'));
		elementComunicator.emit('animating-from', fromClone.getAttribute('data-_reactid'));
	}
	setTimeout(emitHandlers, 0);
	emitHandlers();

	container.appendChild(fromClone);
	container.appendChild(toClone);


	// If an element and one of its subchildren is being transitioned, we don't want to animate both of them, else there will be duplicated artifacts. So we remove all child elements that are being animated. This pretty much has to be done with an event listener.
	function removeAnimatingToElements(id) {
		_.forEach(toClone.querySelectorAll(`[data-_reactid="${id}"]`), element => {
			if (element !== toClone) {
				element.style.opacity = 0;
			}
		});
	}

	function removeAnimatingFromElements(id) {
		_.forEach(fromClone.querySelectorAll(`[data-_reactid="${id}"]`), element => {
			if (element !== fromClone) {
				element.style.opacity = 0;
			}
		});
	}

	function finish() {
		container.remove();
	}
}

function resetElement({ originalElement, toElement, fromElement }) {
	originalElement.style.opacity = '';
	toElement.style.opacity = '';
	fromElement.style.opacity = '';
}

function animateBetween(from, to) {
	var elements = {
		bodyDuration: to.bodyDuration,
		bodyTimingFunction: to.bodyTimingFunction,
		endDuration: to.endDuration,
		endTimingFunction: to.endTimingFunction,
		toRect: to.toElement.rect,
		fromRect: from.fromElement.rect,
		toElement: createClone(to.toElement),
		fromElement: createClone(from.fromElement),
		originalElement: to.originalElement
	};

	console.log(elements, from, to);

	if (String(elements.fromElement.style.opacity) !== '0') {
		animateElement(elements);
	} else {
		// A result of two quick successions
		// We're dealing with an element inside React's reach that we've manually set the opacity of
		// We'll just reset it
		resetElement(elements);
	}
}

const itemTransition = (() => {
	// This is definitely a hack. To work around react not providing a 'a whole view just changed' handler, we have to use timeouts. We start two lists formed of components that will unmount (from), and components that have mounted (to). The handlers will call a function (tranisionFrom, transitionTo) to append to one of these lists. When the first function is called, we know that the view is about to update, so we set a timeout. Due to the synchronous nature of React and the event loop of JavaScript, this will be called once the whole view has changed. Once this is called, we have to reset the lists to empty so we can recognise a new view.
	var to = null;
	var from = null;
	var timerId = null;

	function fireAnimation() {
		var fromKeys = _.keys(from);
		var toKeys = _.keys(to);
		_(toKeys).intersection(fromKeys).forEach(key => {
			animateBetween(from[key], to[key]);
		}).value();

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

		var { id } = serial.toElement;

		if (!to[id]) {
			to[id] = serial;
			queueAnimation();
		} else {
			console.error(serial, to);
			throw new Error(`Transitioning to duplicate id (${serial.id})`);
		}
	}

	function transitionFrom(serial) {
		if (from === null) {
			from = {};
		}

		var { id } = serial.fromElement;

		if (!from[id]) {
			from[id] = serial;
			queueAnimation();
		} else {
			console.error(serial, from);
			throw new Error(`Transitioning from duplicate id (${serial.id})`);
		}
	}

	return { transitionTo, transitionFrom };
})();


module.exports = function init(React) {
	// We have to use the user's React object, as it stores state and stuff.

	const TweenState = React.createClass({
		getDefaultProps() {
			return {
				bodyDuration: 0.6,
				bodyTimingFunction: 'ease-in-out',
				endDuration: 0,
				endTimingFunction: 'ease-in'
			};
		},
		componentWillUnmount() {
			var originalElement = React.findDOMNode(this);
			var fromElement = serializeNode(originalElement, this.props.id);

			var placeholderElement = createClone(fromElement);

			// Don't allow default animations on the element (to be safe)
			_.assign(placeholderElement.style, {
				animation: 'none',
				webkitAnimation: 'none',
				top: fromElement.rect.top + 'px',
				left: fromElement.rect.left + 'px'
			});

			document.body.appendChild(placeholderElement);

			itemTransition.transitionFrom({ fromElement });

			// Remove the placeholder element once everything is finished (setTimeout, for the moment, is guaranteed to be finished after the next component is mounted)
			setTimeout(() => {
				// Called after animations are initialised
				placeholderElement.remove();
			}, 0);
		},
		componentDidMount() {
			// React doesn't provide a 'whole view just loaded' handler. To work around this, we use a setTimeout, which will be fired after this happens. However, this does mean that this element will flash on the screen, so we have to temporarily hide it. This has to be done regardless of whether the element will be animated.
			var originalElement = React.findDOMNode(this);
			var toElement = serializeNode(originalElement, this.props.id);
			var context = _.assign({ toElement, originalElement }, _.pick(this.props, 'bodyDuration', 'bodyTimingFunction', 'endDuration', 'endTimingFunction'));

			originalElement.style.opacity = 0;

			itemTransition.transitionTo(context);

			// In the animateElement, we override the opacity. We don't want to override what animateElement is doing, so we set a flag (OPACITY_MANAGED_BY_TWEEN) on the element to say that the opacity is managed. If it isn't managed, we reset it.
			setTimeout(() => {
				// Called after animations are initialised
				if (originalElement.getAttribute(OPACITY_MANAGED_BY_TWEEN) !== 'true') {
					originalElement.style.opacity = '';
				}

				originalElement.removeAttribute(OPACITY_MANAGED_BY_TWEEN);
			}, 0);
		},
		render() {
			return React.Children.only(this.props.children);
		}
	});

	const TransitionInOut = React.createClass({
		/*componentWillUnmount() {
			// The gist here is that we clone the element in place and assign a 'leave' animation to it. When the animation finishes, we remove the clone from the dom.
			var ref = React.findDOMNode(this);

			var elem = serializeNode(ref);
			var node = createClone(elem);

			node.style.top = elem.rect.top + 'px';
			node.style.left = elem.rect.left + 'px';
			node.classList.add(_.get(this, 'animateOutClassName', ANIMATE_OUT_CLASS_NAME));


			// Same as in animateElements
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
		}*/
		render() {
			return this.props.children[0];
		}
	});

	return {
		TweenState, TransitionInOut
	};
};
