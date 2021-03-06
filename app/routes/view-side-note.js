import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin,

	
	{
	
	session: Ember.inject.service(),
    ajax: Ember.inject.service(),
            /**
    *model of the sidenote route, assigns stuff from the get to the sidenote
    *@class model
    */
	model(param) {
		var self = this;
		var ajaxGet = new Ember.RSVP.Promise((resolve) =>
		this.get('ajax').request('/api/patients/'+param.patientID+'/medical_records/'+param.recordID+'/notes/'+param.notesID
			).then(function(data){
				Ember.run.later(function() {
       			 resolve({ id: JSON.stringify(data.note.id).replace(/\"/g, ""),
						   body: JSON.stringify(data.note.body).replace(/\"/g, "").replace(/\\n/g, " <br> "),
						   initials: JSON.stringify(data.note.initials).replace(/\"/g, "")
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
		return(ajaxGet);

	}
	

});
