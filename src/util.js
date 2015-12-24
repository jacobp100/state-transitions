import { forEach } from 'lodash';

const REACT_ID_RE = /(<[^>]+)(data-reactid)([^>]*>)/gm;

export function requestNextAnimationFrame(callback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}

export function createClone({ outerHTML, rect }) {
  // Creates a clone that fits exactly in the space that the previous element used
  const container = document.createElement('div');
  container.innerHTML = outerHTML;

  const element = container.firstChild;

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

export function serializeNode(node, id) {
  // Serialize a node in a form that createClone will use
  const rect = node.getBoundingClientRect();

  // Set input state values to HTML values so they don't change when creating the clone
  forEach(node.getElementsByTagName('input'), input => {
    input.setAttribute('value', input.value);
  });
  forEach(node.getElementsByTagName('textarea'), textarea => {
    textarea.innerHTML = textarea.value;
  });

  // React will pick up on the ids of the clone and get confused, so change them
  const outerHTML = node.outerHTML.replace(REACT_ID_RE, '$1data-_reactid$3');

  return { id, rect, outerHTML };
}
