// @flow
import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {Dialog, IconButton, RaisedButton} from "material-ui";
import ActionGrade from "material-ui/svg-icons/action/grade";

export default class VoteButton extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        onVote: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        this.state = {open: false}
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleRating(rate) {
        this.props.onVote(rate);
        this.handleClose();
    };

    static customContentStyle = {
        width: 250,
        maxWidth: 'none',
    };

    render() {
        return (
            <RaisedButton style={{width: '90%', margin: 10}} label="Oceń Wystąpienie" secondary={true} onTouchTap={this.handleOpen}>
                <Dialog title="Oddaj głos" modal={false} open={this.state.open} onRequestClose={this.handleClose} contentStyle={VoteButton.customContentStyle}>
                    <IconButton onTouchTap={() => this.handleRating(-1.5)} touch={true}><ActionGrade/></IconButton>
                    <IconButton onTouchTap={() => this.handleRating(-1)} touch={true}><ActionGrade/></IconButton>
                    <IconButton onTouchTap={() => this.handleRating(1)} touch={true}><ActionGrade/></IconButton>
                    <IconButton onTouchTap={() => this.handleRating(1.5)} touch={true}><ActionGrade/></IconButton>
                </Dialog>
            </RaisedButton>
        );
    }
}
