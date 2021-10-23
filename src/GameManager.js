import Player from './Player';
import React from 'react';

let player1Actions = [
    {
        name: 'idle',
        data: {}
    },
    {
        name: 'move',
        data: { x: window.innerWidth / 1.6, y: 0 }
    },
    {
        name: 'attack',
        data: { damage: 10 }
    },
    {
        name: 'attack',
        data: { damage: 10 }
    },
    {
        name: 'attack',
        data: { damage: 10 }
    },
    {
        name: 'attack',
        data: { damage: 10 }
    },
    {
        name: 'move',
        data: { x: window.innerWidth / 3, y: 0 }
    },
]

let player2Actions = [
    {
        name: 'idle',
        data: {}
    },
    {
        name: 'idle',
        data: {}
    },
]


const player1 = (<Player id="player1" speed={2} scale={-1} actions={player1Actions} startPosition={{ x: window.innerWidth / 4, y: window.innerHeight / 2 }} />)
const player2 = (<Player id="player2" speed={5} scale={1} actions={player2Actions} startPosition={{ x: window.innerWidth / 1.5, y: window.innerHeight / 2 }} />)

let players = []

function addPlayer(player) {
    players.push(player)
}

function getPlayers() {
    return players;
}

export { player1, player2, addPlayer, getPlayers }