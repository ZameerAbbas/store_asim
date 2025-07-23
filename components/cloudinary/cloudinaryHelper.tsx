/* eslint-disable spaced-comment */
const baseUrl = `https://file.engineeric.qa/engineeric/fileSystem`;

export const makeUploadRequest = ({
  file,
  fieldName,
  progressCallback,
  successCallback,
  errorCallback
}) => {
  const url = `${baseUrl}`;

//   const formData = new FormData();

//   formData.append('image', file);
//   const request = new XMLHttpRequest();
//   request.open("POST", url);
  
//   request.setRequestHeader('Access-Control-Allow-Headers', '*')
//   request.setRequestHeader('Content-Type', 'image/png');
//   request.upload.onprogress = (e) => {
//     progressCallback(e.lengthComputable, e.loaded, e.total);
//   };

//   request.onload = () => {
//     if (request.status >= 200 && request.status < 300) {
//      // const { delete_token: deleteToken } = JSON.parse(request.response);

//       successCallback(fieldName);
//     } else {
//       errorCallback(request.responseText);
//     }
//   };

// request.send(formData);

//   return () => {
//     request.abort();
 // };
// setAnimation(true)
 const formData = new FormData();
 //e.preventDefault();


 formData.append('image',file, file.name);
 
 fetch(
   'https://file.engineeric.qa/engineeric/fileSystem',
   {
     method: 'POST',
     body: formData,
     redirect: 'follow', 
     mode: 'no-cors'
   }
 )
   .then((response) => response.text())
   .then((result) => {
   //  setStatusFile(true)
    // setAnimation(false)

    progressCallback(result.length);
    successCallback(fieldName);
    
   })
   .catch((error) => {

   });



return(fieldName)

};

export const makeDeleteRequest = ({
  token,
  successCallback,
  errorCallback
}) => {
  const url = `${baseUrl}/delete_by_token`;

  const request = new XMLHttpRequest();
  request.open("POST", url);

  request.setRequestHeader("Content-Type", "application/json");

  request.onload = () => {
    if (request.status >= 200 && request.status < 300) {
      successCallback();
    } else {
      errorCallback(request.responseText);
    }
  };
  request.send(JSON.stringify({ token }));
};
