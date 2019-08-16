import React, { Component } from 'react';
import Header from './Header';
import ContestList from './ContestList';

class App extends Component {

  state = {
    pageHeader: 'Naming Contests',
    contests: this.props.initialContests
  };

  componentDidMount() {    
  };

  componentWillUnmount() {
  };

  render() {
    return (
      <div className="App">
        <Header message={this.state.pageHeader}/>
        <ContestList contests={this.state.contests} />
      </div>
    );
  }
};

export default App;
