define(["LightstreamerClient","StatusWidget","./Constants"],
    function(LightstreamerClient,StatusWidget,Constants) {
  
  //prepare the LightstreamerClient we'll use to connect to the server
  var lsClient = new LightstreamerClient(Constants.SERVER,Constants.ADAPTER);
  lsClient.addListener(new StatusWidget("left", "5px", true));
  
  
  return lsClient;
  
});