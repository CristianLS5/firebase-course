const admin = require("firebase-admin");

//dos variables: "serviceAccountPath" --> path of the service account
//"userUid" --> the ID of the user we want to make admin
const serviceAccountPath = process.argv[2],
  userUid = process.argv[3];

console.log(`Using service account ${serviceAccountPath}`);
console.log(`Setting user ${userUid} as admin`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

//setting the custom claims of the user that we want to be the admin
async function initAdmin(adminUid) {
  admin.auth().setCustomUserClaims(adminUid, { admin: true });
}

//al cabar la promesa, para saber que se ha acabado el proceso
initAdmin(userUid).then(() => {
  console.log("Exiting");
  process.exit();
});
