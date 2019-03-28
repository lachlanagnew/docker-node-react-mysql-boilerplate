import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      search: '',
      users: []
    };
  }

  componentDidMount() {
    this.fetchUsers(this.state.search);
  }

  fetchUsers(query) {
    if (query.length < 1) {
      fetch("http://localhost:5000/users")
        .then(response => response.json())
        .then(data => {
          this.setState({ users: data });
        });
    } else {
      fetch("http://localhost:5000/users/search", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({query})
      })
        .then(response => response.json())
        .then(data => {
          this.setState({ users: data });
        });
    }
  }

  handleChangeUsername = event => {
    this.setState({ username: event.target.value});
  };

  handleChangePassword = event => {
    this.setState({ password: event.target.value});
  };

  handleChangeSearch = event => {
    const val = event.target.value;
    this.setState({ search: val});
    this.fetchUsers(val);
  };

  handleSubmit = event => {
    let user = {
      username: this.state.username,
      password: this.state.password
    }
    fetch("http://localhost:5000/users", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(user), // body data type must match "Content-Type" header
      })
      .then(res => {
        this.fetchUsers(this.state.search)
      })
  };

  usersList () {
    return this.state.users.map((user) => {
      return (
        <div key={user.id} >
          {user.username}
        </div>
      )
    })
  }

  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height:'100vh'}}>
        <div style={{display: 'flex', flexDirection:'column' }}>
          <h1> Create User </h1>
          Username:
          <input placeholder="Username" onChange={this.handleChangeUsername} value={this.state["username"]}/>
          <br/>
          Password:
          <input placeholder="Password" type="password" onChange={this.handleChangePassword} value={this.state["password"]}/>
          <br/>
          <button onClick={this.handleSubmit} > Create User </button>
          <br/>
          <h1> Search Users </h1>
          <input placeholder="search here" onChange={this.handleChangeSearch} value={this.state["search"]}/>
          {this.usersList()}
        </div>
      </div>
    );
  }
}

export default App;
