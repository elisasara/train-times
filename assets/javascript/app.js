
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBYdLlZUCc1gICVu-yj7pGatlF6OJ3jOT8",
    authDomain: "train-times-846d2.firebaseapp.com",
    databaseURL: "https://train-times-846d2.firebaseio.com",
    projectId: "train-times-846d2",
    storageBucket: "",
    messagingSenderId: "977676775221"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

$(document).ready(function (){

// when the submit button is clicked

    $("#submitButton").on("click", function (){
        event.preventDefault();

        // get the values of the inputs
        var name = $("#name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTime = $("#firstTrain").val().trim();
        var frequency = $("#frequency").val().trim();

        // push those values into firebase
        database.ref().push({
            trainName : name,
            destination : destination,
            firstTrain : firstTime,
            frequency : frequency
        });
    });

    // when a child is added in firebase
    database.ref().on("child_added", function(childSnapshot) {

        // store the value that is in firebase
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().firstTrain;
        console.log(firstTrain);
        var frequency = childSnapshot.val().frequency;
        
        // conver the input to a time format
        var timeForMath = moment(firstTrain, "HH:mm:ss").format();
        console.log(timeForMath);

        // format the time in am/pm manner
        var formattedTime = moment(firstTrain, "HH:mm:ss").format("hh:mm a");
        console.log(formattedTime);

        // find the difference in minutes between the current time and the time of the first train
        var difference = moment().diff(timeForMath, "minutes");
        console.log(difference);

        // get the remainder of minutes left when the difference is divided by the frequency
        var remainder = difference % frequency;
        console.log(remainder);

        // add the remainder to the current time to get the time of the next train
        var nextTrain = moment().add(remainder, "minutes").format("hh:mm a");
        console.log(nextTrain);

        // display all of the fields in a new row in the table
        $("#timeSchedule").append("<tr><td>" + trainName +"</td><td>" + destination + "</td><td>" +  frequency + "</td><td>" + nextTrain + "</td><td>" + remainder + "</td></tr>");

    });
        


    });


