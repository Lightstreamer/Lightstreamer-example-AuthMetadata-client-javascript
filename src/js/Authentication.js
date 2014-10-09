define(function() {
  
  //here is the list of the user/password/token
  //these info, excluding the password, are shared with the Metadata Adapter
  var users = {
      user1: {
        password:"wow",
        token:"ikgdfigdfhihdsih",
        permissions:"item1, item2, item3"
      },
      
      patient0: {
        password:"suchpassword",
        token:"imwrongtoken",
        permissions:"the token of this user will result expired on the server"
      },
      
      leto: {
        password:"sosecurity",
        token:"powerfultoken",
        permissions:"all"
      },
      
      gollum: {
        password:"veryauth",
        token:"toobadforyou",
        permissions:"none"
      },
      
      lucky: {
        password: "muchhappy",
        token:"srsly",
        permissions:"item13, item17"
      }
      
  };
  
  function userClicked(user) {
    return function() {
      $("#user").val(user);
      $("#password").val(users[user].password);
    };
  }
  
  //show the list of available user/password pairs on the page, I would not do that
  //on a production site ;)
  for (var user in users) {
    $("#userlist").append(
        $("<tr class='button'>")
          .append($("<td>").text(user))
          .append($("<td>").text(users[user].password))
          .append($("<td>").text(users[user].permissions))
          .click(userClicked(user)));
  }
  
  
  return {
    getToken: function(user,password) {
      if (user in users) {
        if (users[user].password == password) {
          return users[user].token;
        }
      }
      return null;
    }
  };
  
  
});

