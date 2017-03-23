import Ember from 'ember';

export default Ember.Controller.extend({
	loadedFile: null,
	session: Ember.inject.service(),
	ajax: Ember.inject.service(),
	actions: {
		fileLoaded: function(file){
			this.set('loadedFile', file);
			// console.log("name is " + file.name);
			// console.log("type is " + file.type);
			// console.log("data is ");
			// //console.log(file.data);
			// console.log("size is " + file.size + " bytes");
		},
		sendRadiographyResults: function(patientId){
			document.getElementById("saveRadiography").disabled = true;
			var partialDate = this.get('datePicker');
			var partialDate2 = partialDate.toString().split(' ');
			var imageDate = partialDate2[2] + "/" + partialDate2[1] + "/" + partialDate2[3];
			var self = this;
			let ajaxPost = this.get('ajax').post('api/patients/' + patientId + "/images", {
				type: 'application/json',
				data: {image: {
					patient_id: patientId,
					name: this.loadedFile.name,
					data: this.loadedFile.data,
					picture_type: "radiograph",
					date: Date.parse(imageDate)/1000
				}},
			}).then(function(response){
				console.log("status is " +JSON.stringify(response));
				self.transitionToRoute('/view-patient/' + patientId);

			}, function(response){
				document.getElementById("saveRadiography").disabled = false;
				console.log("status is " + JSON.stringify(response));
				if(response === false){
					if(self.get('session.isAuthenticated')){
						self.get('session').invalidate();
					}
					self.transitionToRoute('/login');
				}
			});
			return ajaxPost;
		}
	}
});
