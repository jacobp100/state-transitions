import React from 'react';
import { render } from 'react-dom';

import ButtonModal from './src/ButtonModal';


class App extends React.Component {
  constructor() {
    super();

    this.state = { activeModal: null };
    this.setActiveModal = activeModal => this.setState({ activeModal });
    this.clearActiveModal = () => this.setState({ activeModal: null });
  }

  render() {
    const { activeModal } = this.state;

    const elements = ['fairisle', 'festive', 'knit', 'lasers', 'patterened'].map((title, index) => (
      <ButtonModal
        key={ title }
        title={ title }
        isActive={ activeModal === index }
        onClick={ this.setActiveModal.bind(this, index) }
        onClear={ this.clearActiveModal }
      >
        <img className="boutique__image" src={ `resources/dinosaur-boutique/${title}.jpg` } />
      </ButtonModal>
    ));

    return (
      <div>
        <div className="boutique">
          { elements }
        </div>
      </div>
    );
  }
}

render((
  <App />
), document.getElementById('MAIN'));
