import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

/**
* Route for view contact
* @class AdminRoute
*/
export default Ember.Route.extend(AuthenticatedRouteMixin ,{
	session: Ember.inject.service(),
	ajax: Ember.inject.service(),
	beforeModel(transition){
		if(localStorage.getItem('role') !== 'Admin'){
			transition.abort();
		}
	},
	model(){
		var self = this;
		let ajaxGet = new Ember.RSVP.Promise((resolve) =>
		this.get('ajax').request('/api/admin/users'
			).then(function(data){
				Ember.run(function() {
					var users = deserialAttributes(data.users);
					resolve({ 
						users: users
					});
				});
			},
			function(response){
				if (response === false){
					if (self.get('session.isAuthenticated')){
						self.get('session').invalidate();
					}
					self.transitionTo('/login');
            	}
            }));
		return ajaxGet;
	}
});

/**
* deserializes the attributes in the JSON object and converts it to an array of strings.
* @method deserialAttributes
* @param {object} user User object from the JSON, data.users
*/
function deserialAttributes(users){
	var deserial = [];
	for(var i = 0; i < users.length; i++) {
		var user = {};
		user.id = users[i].id;
		user.email = users[i].email;
		user.name = users[i].name;
		deserial.push(user);
	}
	return(deserial);
}