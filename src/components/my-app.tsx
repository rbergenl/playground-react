import React from 'react';
import {
  BrowserRouter as Router,
  Link, Route, Switch, Redirect
} from "react-router-dom";

import { LandingScreen } from './landing-screen';
import { SettingsScreen } from './settings-screen';
import { Dashboard } from './dashboard';
import { Posts } from './posts';

export class MyApp extends React.Component {
	
	render() {
		let isLoggedIn = false;
		
		const landing = isLoggedIn ? (
				<Link to="/posts">Posts</Link>
		    ) : (
		    	<Link to="/">Landing</Link>
		    );

		return(<div>
				  <Router>
					  <div>
					    <nav>
					     {landing}
					      <Link to="/dashboard">Dashboard</Link>
					      <Link to="/settings">Settings</Link>
					    </nav>
					    <div>
					    	<Switch>
						    	<Route path="/posts" component={Posts} />
						    	<Route path="/dashboard" component={Dashboard}/>
						    	<Route path="/settings" render={()=><SettingsScreen />} />
						    	<Route path="/" component={LandingScreen} />
						    </Switch>
					    </div>
					  </div>
				  </Router>
			</div>);
	}
}

  
/*

import { XSearch } from './xsearch';
customElements.define('x-search', XSearch);
declare namespace JSX {
    interface IntrinsicElements {
        "x-search": any
    }
}
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}

//<x-search name="MyOtherName">MyName</x-search>

*/