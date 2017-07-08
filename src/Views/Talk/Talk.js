// @flow
import React, {Component} from 'react';
import {Avatar, BottomNavigation, BottomNavigationItem, CircularProgress, Paper} from "material-ui";
import ScheduleRepository from '../../Repositories/ScheduleRepository'
import config from '../../Config/theme';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import VoteButton from "../../Components/VoteButton/VoteButton";
import reactMixin from 'react-mixin';
import ReactFireMixin from 'reactfire';
import Comments from "./Comments";
import {PropTypes} from 'prop-types';

class Talk extends Component {

    static propTypes = {
        auth: PropTypes.object,
        match: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {vote: {score: null}}
    }

    componentDidMount() {
        const firebaseRef = this.props.auth.firebase.database().ref(`/votes/${this.props.match.params.id}`);
        this.setState({ref: firebaseRef});
        this.bindAsObject(firebaseRef, 'vote');
    }

    handleVote = (score) => {
        const newScore = parseFloat(parseFloat(this.state.vote.score || 0) + score).toFixed(2);
        this.state.ref.update({score: newScore});
    };

    render() {
        const item = ScheduleRepository.findById(this.props.match.params.id);
        return (
            <div>
                <Paper style={{padding: 30, margin: 30, textAlign: 'center'}} zDepth={1}>
                    {item.speaker.photo ? <Avatar size={140} src={item.speaker.photo}/> : null}
                    <h2 style={{color: config.palette.accent1Color}}>{item.speaker.name}</h2>
                    <h3>{item.title}</h3>
                    <BottomNavigation style={{marginTop: 20}}>
                        {this.state.vote.score === null ?
                            <CircularProgress size={30} thickness={1}/> : 'undefined' === typeof this.state.vote.score ?
                                <BottomNavigationItem label={0} icon={<ActionGrade/>}/> :
                                <BottomNavigationItem label={parseFloat(this.state.vote.score).toFixed(2)} icon={<ActionGrade/>}/>}
                    </BottomNavigation>
                    <VoteButton id={item.id} onVote={this.handleVote}/>
                </Paper>
                <h2>Komentarze</h2>
                <Comments id={item.id}/>
            </div>
        )
    }
}

reactMixin(Talk.prototype, ReactFireMixin);
export default Talk;