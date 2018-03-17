
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



    $("#submitButton").on("click", function (){
        event.preventDefault();

        var name = $("#name").val().trim();
        console.log(name);
        var destination = $("#destination").val().trim();
        console.log(destination);
        var firstTime = $("#firstTrain").val().trim();
        console.log(firstTime);
        var frequency = $("#frequency").val().trim();
        console.log(frequency);

        database.ref().push({
            trainName : name,
            destination : destination,
            firstTrain : firstTime,
            frequency : frequency
        });
    });


    database.ref().on("child_added", function(snapshot) {
        var trainName = snapshot.val().trainName;
        var destination = snapshot.val().destination;
        var firstTrain = snapshot.val().firstTrain;
        var frequency = snapshot.val().frequency;

        $("#timeSchedule").append("<tr><td>" + trainName +"</td><td>" + destination + "</td><td>" +  firstTrain + "</td><td>" + frequency + "</tr>");

    });
        


    })


