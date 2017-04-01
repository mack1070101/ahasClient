import Ember from 'ember';

/**
* Controller for new-client
* @class NewClientController
*/
export default Ember.Controller.extend({
	session: Ember.inject.service(),
	ajax: Ember.inject.service(),
	//let cName, let cAddress, let cPhone,
	actions: {
		/**
		* makes an ajax POST request to save the new client
		* @method submitNewClient
		*/
		submitNewClient: function(){
			//disable button
			
			//make asynch post request
			var self = this;
			checkInputs(self);
			//let cName = this.get('clientName');
			if(checkInputs(self)){
				document.getElementById("create-client-button").disabled = true; 
				let ajaxPost = this.get('ajax').post('/api/client' , {
					type: 'application/json',
					data: {client: {
						firstName: this.get('clientFirstName'),
						lastName: this.get('clientLastName'),
						address: this.get('clientAddress'),
						phoneNumber: this.get('clientPhone'),
						email: this.get('clientEmail'),
						licos: this.get('clientLICO'),
						aish: this.get('clientAISH'),
						socialAssistance: this.get('clientAS'),
						pets: "",
						created_at: new Date(),
						updated_at: "",
						alternativeContactFirstName: this.get('alternativeFirstName'),
						alternativeContactLastName: this.get('alternativeLastName'),
						alternativeContactPhoneNumber: this.get('alternativePrimaryPhone'),
						alternativeContactAddress: this.get('alternativeAddress'),
						notes: this.get('clientNotes'),
						alternativeContact2ndPhone: this.get('alternativeSecondaryPhone'),
						alternativeContactEmail: this.get('alternativeEmail')
					}}, 
				}).then(function(data){
						//console.log("name is " + cName);
						// TODO display confrimation page
						// TODO prevent user from going back into this page
						clearFields(self);
						self.transitionToRoute('search-client');
					},
					function(response){
						document.getElementById("create-client-button").disabled = false;
						if (response === false){
							if (self.get('session.isAuthenticated')){
								self.get('session').invalidate();
							}
							clearFields(self);
							self.transitionToRoute('/login');
						}
					});
				return ajaxPost;
			}
			
		}
	}
});

/**
* clears the page's input fields
* @param {object} page the controller
* @method clearFields
*/
function clearFields(page){
	page.set('clientFirstName', '');
	page.set('clientLastName', '');
	page.set('clientAddress', '');
	page.set('clientPhone', '');
	page.set('clientEmail', '');
	page.set('clientLICO', '');
	page.set('clientAISH', '');
	page.set('clientAS', '');
	page.set('alternativeFirstName', '');
	page.set('alternativeLastName', '');
	page.set('alternativePrimaryPhone', '');
	page.set('alternativeAddress', '');
	page.set('clientNotes', '');
	page.set('alternativeSecondaryPhone', '');
	page.set('alternativeEmail', '');
}


/** 
* used to provide feedback to user on success condition as well as fail condition
* only displayed very briefly on success condition however before transition
* @method  showAlert
* @param {string} message The message to display in the alert
* @param {boolean} isGood Determines if this is a warning alert or confirmation alert. true for good, false for bad
*/   

function showAlert(message, isGood, divID) {
        if(isGood){
            Ember.$('#alert_placeholder_' + divID).html('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span  id="statusGood">'+message+'</span></div>');
        }
        else{
             Ember.$('#alert_placeholder_' + divID).html('<div class="alert alert-danger" ><a class="close" data-dismiss="alert">×</a><span id="statusBad">'+message+'</span></div>');
        }
}

function checkInputs(self){
    var validFirstName = testName(self.get('clientFirstName'), "firstName");
	var validLastName = testName(self.get('clientLastName'), "lastName");
    var validEmail = testEmail(self.get('clientEmail'), "clientEmail");
    var validAltEmail = testEmail(self.get('alternativeEmail'), "altEmail");
    var validClientPhone = testPhoneNumber(self.get('clientPhone'), "clientPhone");
    var validAltPrimaryPhone = testPhoneNumber(self.get('alternativePrimaryPhone'), "altPrimaryPhone");
    var validAltSecondaryPhone = testPhoneNumber(self.get('alternativeSecondaryPhone'), "altSecondaryPhone");
    return validEmail && validAltEmail && validFirstName && validLastName && validClientPhone &&
    		validAltPrimaryPhone && validAltSecondaryPhone;
}

function testName(name, divID){
	if(name === undefined || name === ""){
		showAlert("Name cannot be blank", false, divID);
		return false;
	}else{
		return true;
	}
}

function testEmail(email, divID){
	var emailRegEx =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if(emailRegEx.test(email) || email===undefined || email===""){
		return true;
	} else{
		showAlert("Invalid email address", false, divID);
		return false;
	}
}

function testPhoneNumber(phone, divID){

	//of format xxx-xxx-xxxx, or xxx.xxx.xxxx or xxx xxx xxxx
	var phoneRegEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	if(phoneRegEx.test(phone) || (phone === undefined) || (phone === "")){
		return true;
	} else{
		showAlert("Phone number must be of format xxx-xxx-xxxx, or xxx.xxx.xxxx or xxx xxx xxxx",
		 false, divID);
		return false;
	}
}