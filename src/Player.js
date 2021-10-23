import React from "react";
import Animation from "./Animation";
import { player1, player2, addPlayer, getPlayers } from "./GameManager";
import * as d3 from 'd3';

const idleAnimation = new Animation({
    frameWidth: 104,
    frameHeight: 107,
    imageWidth: 415,
    imageHeight: 107,
    xPos: 0,
    yPos: 0,
    fps: 32,
    frames: 4,
    src: 'assets/goku/idle.png'
})

const attackAnimation = new Animation({
    frameWidth: 148,
    frameHeight: 118,
    imageWidth: 591,
    imageHeight: 118,
    xPos: 0,
    yPos: 0,
    fps: 32,
    frames: 4,
    src: 'assets/goku/attack.png'
})

const walkAnimation = new Animation({
    frameWidth: 103,
    frameHeight: 118,
    imageWidth: 415,
    imageHeight: 111,
    xPos: 0,
    yPos: 0,
    fps: 32,
    frames: 4,
    src: 'assets/goku/walk.png'
})




export default class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: this.props.startPosition,
            velocity: { x: 0, y: 0 },
            currentAction: 0,
            actions: this.props.actions,
            hitBox: null,
            hurtBox: null,
            currentAnimation: idleAnimation,
            health: 100,
            hasAttacked: false,
        };

        this.player = null;
    }

    componentDidMount() {
        //Set up the player

        addPlayer(this)
        const player = d3.select(`#${this.props.id}`);
        this.player = player

        this.player.style("position", "absolute");
        this.player.style("left", (this.state.position.x) + "px");
        this.player.style("bottom", (this.state.position.y) + "px");

        let svg = this.player
            .append('svg')
            .attr("width", this.state.currentAnimation.frameWidth)
            .attr("height", this.state.currentAnimation.frameHeight)
            .style("transform", `scaleX(${this.props.scale})`);

        svg
            .append("svg:image")
            .attr("width", this.state.currentAnimation.imageWidth)
            .attr("height", this.state.currentAnimation.imageHeight)
            .attr("xlink:href", this.state.currentAnimation.src);

        let hitBox = svg
            .append("rect")
            .attr("x", 0)
            .attr("y", 30)
            .attr("width", Math.abs(this.state.currentAnimation.frameWidth / 2 - this.state.currentAnimation.frameWidth))
            .attr("height", 10)
            .attr("class", "hitbox")
            .style("visibility", "hidden");

        let hurtBox = svg
            .append("rect")
            .attr("x", this.state.currentAnimation.frameWidth / 4)
            .attr("y", 0)
            .attr("width", this.state.currentAnimation.frameWidth / 2)
            .attr("height", this.state.currentAnimation.frameHeight)
            .attr("class", "hurtbox")
            .style("visibility", "hidden");

        this.setState({ hitBox: hitBox, hurtBox: hurtBox });

        requestAnimationFrame(() => { this.update() });
    }

    updateSprite() {
        let svg = this.player.select('svg')
            .attr("width", this.state.currentAnimation.frameWidth)
            .attr("height", this.state.currentAnimation.frameHeight)

        svg.select('image')
            .attr("width", this.state.currentAnimation.imageWidth)
            .attr("height", this.state.currentAnimation.imageHeight)
            .attr("transform", `translate(${this.state.currentAnimation.xPos}, ${this.state.currentAnimation.yPos})`)
            .attr("xlink:href", this.state.currentAnimation.src);

    }

    updatePosition() {
        this.setState({
            position: {
                x: this.state.position.x + this.state.velocity.x,
                y: this.state.position.y + this.state.velocity.y
            }
        });

        this.player.style("left", `${this.state.position.x}px`);
        this.player.style("bottom", `${this.state.position.y}px`);
    }

    animationPlayer(currentAction) {
        //If there any no more actions left, play the idle animation
        if (currentAction >= this.state.actions.length) {
            if (this.state.currentAnimation !== idleAnimation) {
                this.setState({ currentAnimation: idleAnimation });
            }
        }
        else {
            //Play the animation depending on the current actions name
            if (this.state.actions[currentAction].name === 'move') {
                if (this.state.currentAnimation !== walkAnimation) {
                    this.setState({ currentAnimation: walkAnimation });
                }
            }
            else if (this.state.actions[currentAction].name === 'attack') {

                if (this.state.currentAnimation !== attackAnimation) {
                    this.setState({ currentAnimation: attackAnimation });
                }

            }
            else if (this.state.actions[currentAction].name === 'idle') {
                if (this.state.currentAnimation !== idleAnimation) {
                    this.setState({ currentAnimation: idleAnimation });
                }
            }
        }
    }

    move(direction) {
        if (direction === "right") {
            this.setState({ velocity: { x: this.props.speed, y: 0 } });
        } else if (direction === "left") {
            this.setState({ velocity: { x: -1 * this.props.speed, y: 0 } });
        }
    }

    detectHit() {
        //Get the other player
        //Check if your hitbox collided with player 2 hurtbox using AABB collision
        //If it did, deal damage to player 2

        const enemy = (this.props.id === player1.props.id ? player2 : player1);
        const enemyHurtBox = d3.select(`#${enemy.props.id}`).select(".hurtbox");

        let enemyX = parseInt(d3.select(`#${enemy.props.id}`).style("left"))
        let enemyY = parseInt(d3.select(`#${enemy.props.id}`).style("bottom"))

        let x1 = this.state.position.x + parseInt(this.state.hitBox.attr("x"));
        let x2 = enemyX + parseInt(enemyHurtBox.attr("x"));

        let y1 = this.state.position.y + parseInt(this.state.hitBox.attr("y"));
        let y2 = enemyY + parseInt(enemyHurtBox.attr("y"));

        //If the player is facing the right, adjust the x and y coordinates accordingly.
        if (this.props.scale === -1) {
            x1 = this.state.position.x + parseInt(this.state.hitBox.attr("width"));
            y1 = this.state.position.y + parseInt(this.state.hitBox.attr("height"));
        }

        //AABB Collsion algorithm
        if (x1 < x2 + parseInt(enemyHurtBox.attr("width")) &&
            x1 + parseInt(this.state.hitBox.attr("width")) > x2 &&
            y1 < y2 + parseInt(enemyHurtBox.attr("height")) &&
            y1 + parseInt(this.state.hitBox.attr("height")) > y2) {
            enemyHurtBox.attr("fill", "#69a3b2");
            enemyHurtBox.attr("class", "hurtbox hit");
            return true;
        } else {
            enemyHurtBox.attr("class", "hurtbox");
        }
        return false;
    }

    takeDamage(damage) {
        //Check if the hurtbox has the "hit" class before doing any damage
        const hurtBox = this.player.select(".hurtbox")
        if (hurtBox.attr("class").includes("hit")) {
            this.setState({ health: this.state.health - damage })
        }
    }

    reachedPosition(position) {
        //Check if we are within 10px of the position (number can be adjusted)
        return Math.abs(this.state.position.x - position.x) <= 10
    }

    update() {
        let currentAction = this.state.currentAction;
        this.state.currentAnimation.animate();
        this.updateSprite();
        this.updatePosition();
        this.animationPlayer(currentAction);



        if (currentAction < this.state.actions.length) {
            if (this.state.actions[currentAction].name === 'move') {
                let position = this.state.actions[currentAction].data
                if (position.x > this.state.position.x) {
                    this.move("right")
                }
                else if (position.x <= this.state.position.x) {
                    this.move("left")
                }

                if (this.reachedPosition(position)) {
                    this.setState({ currentAction: currentAction + 1 });
                    this.setState({ velocity: { x: 0, y: 0 } });
                }
            }
            else if (this.state.actions[currentAction].name === 'idle') {

                if (this.state.currentAnimation.isFinished()) {
                    this.state.currentAnimation.reset();
                    this.setState({ currentAction: currentAction + 1 });
                }
            }
            else if (this.state.actions[currentAction].name === 'attack') {
                //If we detect a hit, damage the enemy once
                if (this.detectHit()) {
                    if (!this.state.hasAttacked) {
                        this.setState({ hasAttacked: true })
                        const enemy = getPlayers().filter(player => player.props.id !== this.props.id)[0];

                        enemy.takeDamage(this.state.actions[currentAction].data.damage);

                        console.log(enemy.state.health)
                    }
                }

                //Reset the animation and the damage timer, then move on the next event
                if (this.state.currentAnimation.isFinished()) {
                    this.state.currentAnimation.reset();
                    this.setState({ hasAttacked: false })
                    this.setState({ currentAction: currentAction + 1 });
                }
            }
        }



        requestAnimationFrame(() => { this.update() });
    }

    render() {

        return (
            <div ref={this.ref} id={this.props.id}>
                <div className="health" style={{ width: this.state.health + 'px' }}>{this.state.health}</div>
            </div>
        )
    }
}