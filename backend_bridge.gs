// 🚀 LITHIUM TECH: Google Drive "Serverless" Bridge
// Paste this into a new project at script.google.com

function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  var action = params.action;
  var email = params.email;
  var payload = params.payload; // Already encrypted from the browser

  var folderName = "LithiumOS_Vault";
  var folders = DriveApp.getFoldersByName(folderName);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
  
  // Hash email for filename (privacy)
  var fileName = "LITHIUM_" + Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email)) + ".json";
  var files = folder.getFilesByName(fileName);
  
  if (action === "sync" || action === "register") {
    if (files.hasNext()) {
      files.next().setContent(JSON.stringify(payload));
    } else {
      folder.createFile(fileName, JSON.stringify(payload));
    }
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === "login") {
    if (!files.hasNext()) return ContentService.createTextOutput(JSON.stringify({error: "User not found"})).setMimeType(ContentService.MimeType.JSON);
    var data = JSON.parse(files.next().getContent());
    return ContentService.createTextOutput(JSON.stringify({success: true, payload: data})).setMimeType(ContentService.MimeType.JSON);
  }
}
