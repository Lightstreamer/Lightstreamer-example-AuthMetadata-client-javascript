define(["Subscription","DynaGrid","./lsClient"],
    function(Subscription,DynaGrid,lsClient) {
  
  var subscribed = {};
  
  var itemsGrid= new DynaGrid("stocks", true);
  
  //setup the grid listener
  itemsGrid.addListener({
    onVisualUpdate: function(key, info, node) {
      if (info == null) {
        // Cleaning
        return;
      }
      
      var item = info.getChangedFieldValue("item_name");
      if(item != null) {
        //first update for this item, we're filling the grid, let's add the click listener
        $(node).click(function() {
          if (item in subscribed) {
            //already subscribed 
            return;
          }
          //prepare the subscription for the item
          var subscription = new Subscription("MERGE",item,["last_price"]);
          subscription.setDataAdapter("QUOTE_ADAPTER");
          subscription.setRequestedSnapshot("yes");
          
          subscribed[item] = subscription;
          
          //add a listener to handle the subscription events
          subscription.addListener({
            onItemUpdate: function(updateInfo) {
              //new update from the server
              itemsGrid.updateRow(item,{status: updateInfo.getValue("last_price")});
            },
            onSubscriptionError: function(code,message) {
              //server refused our subscription: probably this user is not enabled to subscribe to this item
              itemsGrid.updateRow(item,{status: "Error "+code+": "+message});
            }
          });
          //subscribe
          lsClient.subscribe(subscription);
          
          //tell the user we're subscribing
          itemsGrid.updateRow(item,{status: "subscribing"});
        });
      } 
      
      //let's highlight the new value
      info.setHotTime(200);
      info.setHotToColdTime(500);
      info.setAttribute("yellow", "", "backgroundColor");
    }
  });  
  
  
  function resetGrid() {
    for (var i=1; i<=30; i++) {
      itemsGrid.updateRow("item"+i,{item_name: "item"+i, status:"click to subscribe"});
    }
  }
  resetGrid();
  
  return {
    reset: function() {
      for (var sub in subscribed) {
        lsClient.unsubscribe(subscribed[sub]);
      }
      subscribed = {};
      resetGrid();
    }
  };
  
});