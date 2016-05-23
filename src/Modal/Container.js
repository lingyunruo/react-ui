'use strict';

import React, { Component } from 'react';
import classnames from 'classnames';
import Overlay from '../Overlay';
import Modal, { ZINDEX } from './Modal';
import { isEmpty } from '../utils/objects';
import { removeItem } from '../utils/array';

import ModalStyles from '../styles/_modal.scss';

export default class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      increase: false,
      ids: [],
      modals: {}
    };
    this.addModal = this.addModal.bind(this);
    this.removeModal = this.removeModal.bind(this);
  }

  addModal (props) {
    let { modals, ids } = this.state;
    modals[props.id] = props;
    if (ids.indexOf(props.id) < 0) {
      ids.push(props.id);
    }

    this.setState({ modals, ids, increase: true });
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
  }

  removeModal (id) {
    let { modals, ids } = this.state;

    id = id || ids.pop();
    let props = modals[id];

    if (!props) { return; }

    props.onClose && props.onClose();

    delete modals[id];
    ids = removeItem(ids, id);
    this.setState({ modals, ids, increase: false });

    if (isEmpty(modals)) {
      document.body.style.height = '';
      document.body.style.overflow = '';
    }
  }

  clickaway (event) {
    if (event.target.className === 'rct-modal-inner') {
      event.stopPropagation();
    }
  }

  renderModals () {
    const { modals } = this.state;
    return Object.keys(modals).map((key, i) => {
      return <Modal key={key} {...modals[key]} index={i} onClose={this.removeModal} />;
    });
  }

  render () {
    let mlen = this.state.ids.length;

    let className = classnames(
      ModalStyles.container,
      !isEmpty(this.state.modals) && ModalStyles.open
    );

    return (
      <div className={className}>
        <Overlay style={{zIndex: ZINDEX + mlen - 1}}
          className={classnames({active: !isEmpty(this.state.modals)})} />
        { this.renderModals() }
      </div>
    );
  }
}