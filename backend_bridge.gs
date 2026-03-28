// 🚀 LITHIUM TECH: Google Drive "Serverless" Bridge (Version 4.0)
// Features: Plain Text Storage + Duplicate Email Protection.

function doGet(e) {
  var action = e.parameter.action;
  var email = e.parameter.email;
  
  if (action === "login") {
    var folderName = "LithiumOS_Vault";
    var folder = DriveApp.getFoldersByName(folderName).next();
    var fileName = "LITHIUM_" + Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email.toLowerCase())) + ".json";
    var files = folder.getFilesByName(fileName);
    
    if (!files.hasNext()) return sendJSON({error: "User not found"});
    var file = files.next();
    var data = JSON.parse(file.getContent());
    return sendJSON({success: true, payload: data});
  }
}

function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  var action = params.action;
  var email = params.email;
  var payload = params.payload;

  var folderName = "LithiumOS_Vault";
  var folders = DriveApp.getFoldersByName(folderName);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
  
  var fileName = "LITHIUM_" + Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email.toLowerCase())) + ".json";
  var files = folder.getFilesByName(fileName);
  
  if (action === "register") {
    if (files.hasNext()) {
       return sendJSON({error: "Email already taken. Try logging in."});
    }
    folder.createFile(fileName, JSON.stringify(payload));
    return sendJSON({success: true});
  }

  if (action === "sync") {
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
