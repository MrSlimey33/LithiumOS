// 🚀 LITHIUM TECH: Google Drive "Serverless" Bridge (Version 2.0)
// This version supports GET for retrieval and simpler POST requests to bypass CORS.

function doGet(e) {
  var action = e.parameter.action;
  var email = e.parameter.email;
  
  if (action === "login") {
    var folderName = "LithiumOS_Vault";
    var folder = DriveApp.getFoldersByName(folderName).next();
    var fileName = "LITHIUM_" + Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email)) + ".json";
    var files = folder.getFilesByName(fileName);
    
    if (!files.hasNext()) return sendJSON({error: "User not found"});
    var data = JSON.parse(files.next().getContent());
    return sendJSON({success: true, payload: data});
  }
  
  return sendJSON({error: "Unknown action"});
}

function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  var action = params.action;
  var email = params.email;
  var payload = params.payload;

  var folderName = "LithiumOS_Vault";
  var folders = DriveApp.getFoldersByName(folderName);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
  
  var fileName = "LITHIUM_" + Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email)) + ".json";
  var files = folder.getFilesByName(fileName);
  
  if (action === "register" || action === "sync") {
    if (files.hasNext()) {
      files.next().setContent(JSON.stringify(payload));
    } else {
      folder.createFile(fileName, JSON.stringify(payload));
    }
    return sendJSON({success: true});
  }
}

function sendJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
