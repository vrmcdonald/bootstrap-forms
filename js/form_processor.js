// form processor - October 2018 version - quiz version
// updated for ES6
/* this script processes your form data locally only - no server

   this works with a form for which the opening tag is:
   <form id="myForm" action="form_processor.js" method="post">

   STEP 1: REPLACE your <form> tag with that exact line -
   change PATH to .js file as needed

   in your HTML on your form page, you MUST have
   an empty DIV with id="showAnswers" - or else this script will not work
   */
// STEP 2: Add that DIV immediately below your closing /form tag

// see STEP 3 below ... last step, I promise!


const form = document.querySelector("#myForm");

// this will be an associative array of the user's answers
let userAnswers = {};


// STEP 3:
/* edit the correctAnswers Object below to represent both
   YOUR form element NAMES and the CORRECT values -
   be VERY careful about the PUNCTUATION marks
   - FORMAT -
   name: "value",
   if you have a set of checkboxes, put the correct answers into an array
   do the same if you have a multiple-select element in your form -
   below, features: [ "heels", "laces" ],
   is an example of the correct way to do that
   */

const correctAnswers = {
        // replace all lines below, as many or as few as you need
    year: "2015",
    author: "Andrzej Sapkowski",
    morals: "The writing was infused with real-life aspects like moral ambiguity in a deliberate attempt to avoid simplification, impart authenticity, and reflect Sapkowski's novels.",
    publisher: "CD Projekt",
    locales: [ "Kaer Morhen", "Lofoten", "Skellige", "Vizima" ],
    lovers: "Yennefer of Vengerberg",
        // stop here - you can have more lines if yur quiz has more answers
};

// DO NOT CHANGE anything below this !!!


form.onsubmit = checkAnswers;

function checkAnswers() {
  // process every element in the form with this for-loop
  for (let i = 0; i < form.elements.length; i++) {
    // skip an element if it has no name
    if (form.elements[i].name == "") {
      // keep looping
      continue;
    } else if (form.elements[i].nodeName == 'INPUT') {
      /* this switch-statement checks for each type of INPUT element - there are
         even more INPUT elements - add others if needed
	 */
      switch (form.elements[i].type) {
        case 'text':
        case 'email':
        case 'tel':
        case 'url':
        case 'hidden':
        case 'password':
          /* if any of the above cases is true for this one form element, add
	     the name:value pair to userAnswers using the function below this one
	     */
          addPairToAssocArray(form.elements[i].name, form.elements[i].value);
          break;
        // continue with more INPUT form elements
        case 'radio':
          /* if the element is INPUT radio, then see if it has the "checked" attribute.
	     If so, add it to userAnswers
	     */
          if (form.elements[i].checked) {
            addPairToAssocArray(form.elements[i].name, form.elements[i].value);
          }
          break;
        case 'checkbox':
          /* different from radio b/c checkbox can have more than one answer, so we need
	     an array for this - uses a different function
	     */
          if (form.elements[i].checked) {
            addMultipleToAssocArray(form.elements[i].name, form.elements[i].value);
          }
          break;
        case 'file':
        case 'button':
        case 'reset':
        case 'submit':
          // if the element is any of those, just ignore it
          break;
      } // end switch
    } else if (form.elements[i].nodeName == 'TEXTAREA') {
      // add it to userAnswers using same function as for single INPUT elements
      addPairToAssocArray(form.elements[i].name, form.elements[i].value);
    } else if (form.elements[i].nodeName == 'SELECT') {
      /* this switch-statement checks if SELECT menu allows multiple or not. If multiple,
         loop through all of them (with j in new for-loop)
	 */
      switch (form.elements[i].type) {
        case 'select-one':
          addPairToAssocArray(form.elements[i].name, form.elements[i].value);
          break;
        case 'select-multiple':
          for (let j = 0; j < form.elements[i].options.length; j++) {
            if (form.elements[i].options[j].selected) {
              // use same function used for checkboxes
              addMultipleToAssocArray(form.elements[i].name, form.elements[i].options[j].value);
            }
          }
          break;
      } // end switch
    } else if (form.elements[i].nodeName == 'BUTTON') {
      // ignore it and keep looping
      continue;
    } else {
      alert("Error! " + form.elements[i].nodeName);
    }
  } // end of for-loop

  // run the function that is below
  writeMessage();

  // reset all the form fields
  form.reset();

  // reset the Object
  userAnswers = {};

  // keep next line as final line of this function, because we are
  // returning data to the same page, and we don't want page to reload
  return false;

} // end of function checkAnswers()

function writeMessage() {
  // start the message string
  let msg = "<ol>";

  // compare answers in the two associative arrays
  for ( let key in userAnswers ) {
    for ( let key2 in correctAnswers ) {
      // when you reach the matching key ...
      if ( key === key2) {
        // check if correct answer is an array
        if ( Array.isArray( correctAnswers[ key2 ] ) ) {
            // if it is, pass its key to the function for handling
            let result = testMultipleItemAnswer( key2 );
            msg += result;
        // if this is not an array - check whether two simple values match
        } else if ( userAnswers[ key ] == correctAnswers[ key2 ] ) {
          msg += "<li>" + userAnswers[ key ] + " is correct!</li>";
        } else {
          msg += "<li>" + userAnswers[ key ] + " is wrong. The correct answer is " + correctAnswers[ key2 ] + ".</li>";
        }
      }
    }
  }
  // close the list element in the message string
  msg += "</ol>";

  // writes message and tags into the DIV with id="showAnswers"
  document.querySelector("#showAnswers").innerHTML = msg;
}

// this complex function checks an answer that has more than one part -
// to see whther you choose all the correct ones -
// pass in the current key item as theKey
function testMultipleItemAnswer( theKey ) {
    let correctItems = [];
    let missingItems = [];
    let count = 0;
    // check each item in the correctAnswers array
    for (let i = 0; i < correctAnswers[ theKey ].length; i++) {
        for (let j = 0; j < userAnswers[ theKey ].length; j++) {
            // if a userAnswer matches the current correctAnswer,
            // add userAnswer to temp array correctItems
            if ( correctAnswers[ theKey ][i] == userAnswers[ theKey ][j] ) {
              correctItems.push( userAnswers[ theKey ][j] );
              count++;
            }
        }
        // catch a missing item and add to temp array missingItems
        if (count == 0) {
          missingItems.push( correctAnswers[ theKey ][i] );
        } else {
          // rest count for next loop
          count = 0;
        }
    }
    let msgAdd;
    if ( userAnswers[ theKey ].length > correctAnswers[ theKey ].length ) {
      msgAdd = "<li>You chose extra items for " + theKey + ".</li>";
    } else if ( correctItems.length == correctAnswers[ theKey ].length ) {
      msgAdd = "<li>Your choices for " + theKey + " were all correct: " + userAnswers[ theKey ] + "</li>";
    } else {
      msgAdd = "<li>In your choices for " + theKey + ", you were missing: " + missingItems + "</li>";
    }
    return msgAdd;
} // end of testMultipleItemAnswer() function

// writes one new key-value pair into the Object named userAnswers
function addPairToAssocArray(n, v) {
  userAnswers[ n ] = v;
}

// writes multiple values into an array value in the Object named userAnswers
function addMultipleToAssocArray(n, v) {
  let found = false;
  // loop through all keys and check if n already exists
  for ( let key in userAnswers ) {
    if (key === n) {
      found = true;
    }
  }
  // if n does not exist, create it as an array
  if (!found) {
    userAnswers[ n ] = [];
  }
  // now add the value to the array
  userAnswers[ n ].push( v );
}
