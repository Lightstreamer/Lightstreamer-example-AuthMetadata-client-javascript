define(function() {
  
  //here is the list of the user/password/token
  //these info, excluding the password, is shared with the Metadata Adapter
  var users = {
      user1: {
        password:"wow",
        token:"ikgdfigdfhihdsih",
        permissions:"item1, item2, item3"
      }
      
  };

  //show the list of available user/password pairs on the page, I would not do that
  //on a production site ;)
  for (var user in users) {
    $("#userlist").append(
        $("<tr>")
          .append($("<td>").text(user))
          .append($("<td>").text(users[user].password))
          .append($("<td>").text(users[user].permissions)));
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

