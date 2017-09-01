// @flow
import React, {Component} from 'react';
import {AppBar, IconButton} from 'material-ui';
import SocialPerson from 'material-ui/svg-icons/social/person';

export default class AnonymousAppBar extends Component {
    render() {
        return (
            <AppBar title={this.props.title} iconElementRight={<IconButton><SocialPerson/></IconButton>}
                    iconElementLeft={<img src="/logo.svg" style={{height: 30, padding: 8}} />}
                    style={{position: 'sticky', top: 0}}
                    onRightIconButtonTouchTap={this.handleLogin}>
                {this.props.children}
            </AppBar>
        )
    }
}
