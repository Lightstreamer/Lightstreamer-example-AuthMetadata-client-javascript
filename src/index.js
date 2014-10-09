/*
  Copyright 2014 Weswit Srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

//In this example we authenticate via JavaScript by sending an "Ajax" request to a WebServer that will answer
//with a session token (or refusing the request) 
//We do not actually deploy the WebServer, we will simulate the authentication on the client (see the js/Authentication.js) 


require(["js/lsClient","js/Authentication","js/Constants","js/Subscriptions"], 
    function(lsClient,Authentication,Constants,Subscriptions) {
  
  $("#submit_form :submit").click(function(event) {
    //the user wants to authenticate
    
    //in this case we handle the auth via JS so prevent the form from submitting 
    event.preventDefault();
    
    //disable the form while we try to authenticate
    $("input").prop('disabled', false);
    
    //trim input values
    var user = $("#user").val().replace(Constants.TRIM_REGEXP,"$1");
    var password = $("#password").val().replace(Constants.TRIM_REGEXP,"$1");
    
    //Let's call the webserver to ask for an authentication token
    //in this demo we call a longin.js file that is an empty file
    //and we'll fake the authentication on the client
    $.ajax({
      url: "js/login.js",
      type: "POST",
      data: {
        user: user,
        password: password,
      },
      error: function(obj,errorText) {
        jError("Authentication Failed: " + errorText,Constants.J_NOTIFY_OPTIONS_ERR);
      },
      success: function() {
        //we expect the token to be sent by the WebServer, 
        //in this case the token "generation" is simulated by the Authentication module.
        //note that while the Authentication module will always return the same token
        //for a certain user, the WebServer would actually generate a different token
        //every time (or at least will refresh it from time to time.
        var token = Authentication.getToken(user,password);
        
        if (token == null) {
          jError("Authentication Failed: wrong user/password",Constants.J_NOTIFY_OPTIONS_ERR);
        } else {
          
          //hide login form, show application
          $("#submit_form").hide();
          $("#application").show();
          
          //now we can connect to Lightstreamer
          lsClient.connectionDetails.setUser(user);
          lsClient.connectionDetails.setPassword(token); //send the token, not the password, to the Lightstreamer server
          lsClient.connect();
         
          //intercept potential errors on the Lightstreamer side; e.g.: the token expired while we were connecting
          lsClient.addListener({
            onServerError:function(code,message) {
              jError("Connection to Lightstreanmer refused: " + code + " " + message,Constants.J_NOTIFY_OPTIONS_ERR);
              //hide login form, show application
              $("#submit_form").show();
              $("#application").hide();
            }
          });
        }
      },
      complete: function() {
        $("input").prop('disabled', false);
      }
    });
    
  });
  
  //enable the login form
  $("input").prop('disabled', false);
  
  
  
  
});


 