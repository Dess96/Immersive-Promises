/*
Copyright 2018 Google Inc.

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
/*jshint esversion: 6*/

const app = (() => {

  function getImageName(country) {
    let lowerCountry = country.toLowerCase();
    let countryPng;
    let checkParamPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        if(lowerCountry === 'spain' || lowerCountry === 'chile' || lowerCountry === 'peru') {
          countryPng = lowerCountry + '.png';
          resolve(countryPng);
        } else {
          reject('Did not receive valid name!');
        }
      }, 1000);
    });
    return checkParamPromise;
  }

  function flagChain(country) {
    getImageName(country)
      .then(function() {
        return fallbackName();
      }).then(function(namePromise) {
        return fetchFlag(namePromise);
      }).then(function(blobFlag) {
        return processFlag(blobFlag);
      }).then(function(flagBlob) {
        return appendFlag(flagBlob);
      }).catch(logError);
  }

  /* Helper functions */

  function logSuccess(result) {
    console.log('Success!:\n' + result);
  }

  function logError(err) {
    console.log('Oh no!:\n' + err);
  }

  function returnFalse() {
    return false;
  }

  function fetchFlag(imageName) {
    return fetch('flags/' + imageName); // fetch returns a promise
  }

  function processFlag(flagResponse) {
    if (!flagResponse.ok) {
      throw Error('Bad response for flag request!'); // This will implicitly reject
    }
    return flagResponse.blob(); // blob() returns a promise
  }

  function appendFlag(flagBlob) {
    const flagImage = document.createElement('img');
    const flagDataURL = URL.createObjectURL(flagBlob);
    flagImage.src = flagDataURL;
    const imgContainer = document.getElementById('img-container');
    imgContainer.appendChild(flagImage);
    imgContainer.style.visibility = 'visible';
  }

  function fallbackName() {
    return 'spain.png';
  }

  // Don't worry if you don't understand this, it's not part of Promises.
  // We are using the JavaScript Module Pattern to enable unit testing of
  // our functions.
  return {
    getImageName: (getImageName),
    flagChain: (flagChain),
    fetchFlag: (fetchFlag),
    processFlag: (processFlag),
    appendFlag: (appendFlag)
  };

})();
