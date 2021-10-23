import React, { Component } from 'react';
import { player1, player2 } from './GameManager';

export class Game extends Component {
  constructor() {
    super();
    this.properties = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
    }
    this.container = React.createRef();
    this.players = [];
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this, false));

    const container = this.container.current;
    this.container = container;
  }

  handleResize(value, e) {
    this.properties.width = window.innerWidth;
    this.properties.height = window.innerHeight;
    this.properties.ratio = window.devicePixelRatio || 1
  }

  render() {


    return (
      <div id="container"
        width={this.properties.screen.width * this.properties.screen.ratio}
        height={this.properties.screen.height * this.properties.screen.ratio}
      >
        {player1}
        {player2}
      </div>
    )
  }
}

//<Player id="player1" scale={-1} actions={actions1} startPosition={{ x: window.innerWidth / 2 - 500, y: window.innerHeight / 2 }} />
//<Player id="player2" scale={1} actions={actions2} startPosition={{ x: window.innerWidth / 2 + 500, y: window.innerHeight / 2 }} />

export default Game;
