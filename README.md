# React State Transitions

Provides mixins to transition between elements when the view changes. Pretty much any method of view handling should work, and the demo uses ReactRouter.

![Demo](http://jacobp100.github.io/state-transitions/TweenState.gif)

View the [demo](http://jacobp100.github.io/state-transitions/) before reading to get a gist of what animations you'll get.

```
npm install --save state-transitions
```

```js
const React = require('react');
const { TweenState, TransitionInOut } = require('state-transitions')(React);
```

Note that you **must** provide your React object for this to work.

# Tween State

Morphs elements from the previous state to the next state. It does this by looking at the keys of the refs of the two states, and animating the elements whos ref keys match on both sides. In the example below, the ref `animate-me` is available on both components, so those two refs be transitioned.

The tween is formed of a body transition, where the previous element transforms into the next element, and an end transition, where the final element fades into itself. The end transition is off by default, but can be enabled in the case that the final element updates during the transition. E.g. you start fetching data when the animation starts.

```js
var AnimateFrom = React.createClass({
    mixins: [TweenState],
    transitionBodyDuration: 0.6, // Optional, defaults to 0.6
    transitionBodyTimingFunction: 'ease-in-out', // Optional, defaults to 'ease-in-out'
    transitionEndDuration: 0, // Optional, defaults to 0
    transitionEndTimingFunction: 'ease-in' // Optional, defaults to 'ease-in'
    ...
    render() {
        return (
            <div ref='animate-me'>
                Animate me!
            </div>
        );
    }
});

var AnimateTo = React.createClass({
    mixins: [TweenState],
    render() {
        return (
            <div ref='animate-me'>
                I was animated!
            </div>
        );
    }
});
```

Should you not want to automatically use the refs of the component, or want to reference elements in child components, you can add a `getRefs` method to your component. This should return an object of whose keys are the elements to match against, and the values as the React elements.

```js
React.createClass({
    mixins: [TweenState],
    getRefs() {
        return {
            a: this.refs.randomComponent,
            b: this.refs.childComponent.refs.childRef
        };
    }
    ...
});
```

It is possible to have multiple components animate. If one animating component is a child of another animating component, the child component will be removed from the parent, so you won't see any artifacts.

# Transition In Out

Adds transition in and transition out animations to a single element. Different from ReactCSSTransitionGroup in that it is designed for the one element, and not with inserting and removing child nodes. This can be used on its own, or with TweenState.

```js
React.createClass({
    mixins: [TransitionInOut],
    animateOutClassName: 'leaving', // Optional, defaults to 'leaving'
    render() {
        return (
            <div className='fade'>
                I was transitioned!
            </div>
        );
    }
    ...
});
```

```css
.fade {
    -webkit-animation: 1s fade-in;
    animation: 1s fade-in;
}
.fade.leaving {
    -webkit-animation: 1s fade-out;
    animation: 1s fade-out;
}
```

Similar to TweenState, if a component is animating with tween state, that is a child component of the TransitionInOut element, it will be removed from the transition animation to stop artifacts.

# Notes

## Browser Support

You can use the mixin in any browser, and it will disable itself if any of the following conditions are not met.

* The browser supports `transition`
* The browser supports `animation` or `-webkit-animation`

## Dependencies

* LoDash 3.9+
* EventEmitter
