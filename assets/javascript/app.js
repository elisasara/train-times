
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

var childName = "";
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = "";
var updateButton = "<button class='btn btn-default' id='update'>Update</button>";
// var removeButton = "<button class='btn btn-default' id='remove'><span class='glyphicon glyphicon-remove'></span></button>"
var removeButton = "<button class='btn btn-default' id='remove'>Remove</button>"
// var checkButton = "<button class='btn btn-default' id='submitChanges'><span class='glyphicon glyphicon-ok'></span></button>"
var checkButton = "<button class='btn btn-default' id='submitChanges'>Submit</button>"

$(document).ready(function () {

    // when the submit button is clicked

    $("#submitButton").on("click", function () {
        event.preventDefault();

        // get the values of the inputs
        var name = $("#name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTime = $("#firstTrain").val().trim();
        var frequency = $("#frequency").val().trim();

        // push those values into firebase
        database.ref().push({
            trainName: name,
            destination: destination,
            firstTrain: firstTime,
            frequency: frequency
        });
    });

    // when a child is added in firebase
    database.ref().on("child_added", function (childSnapshot) {

        // store the value that is in firebase
        childName = childSnapshot.key;
        trainName = childSnapshot.val().trainName;
        destination = childSnapshot.val().destination;
        firstTrain = childSnapshot.val().firstTrain;
        frequency = childSnapshot.val().frequency;

        // convert the input to a time format
        var minutesForMath = parseInt(moment(firstTrain, "HH:mm").format("mm"));
        console.log("Minutes for Math:" + minutesForMath);

        // format the time in am/pm manner
        var formattedTime = moment(firstTrain, "HH:mm:ss").format("HH:mm a");
        console.log("formatted time:" + formattedTime);

        // get the current time
        var currentTime = moment().format("HH:mm");
        console.log("current time:" + currentTime);

        // get the minutes for the current time
        var currentForMath = parseInt(moment().format("mm"));
        console.log("current for math:" + currentForMath);

        // find the difference in minutes between the current time and the time of the first train
        var difference = Math.abs(parseInt(currentForMath - minutesForMath));
        console.log("difference:" + difference);

        // get the remainder of minutes left when the difference is divided by the frequency
        var remainder = difference % frequency;
        console.log("remainder:" + remainder);

        var timeToAdd = frequency - remainder;
        console.log("time to add:" + timeToAdd);

        // add the remainder to the current time to get the time of the next train
        var nextTrain = moment().add(timeToAdd, "minutes").format("hh:mm a");
        console.log("next train time:" + nextTrain);


        if (formattedTime === currentTime) {
            nextTrain = formattedTime;
            remainder = moment(timeForMath).diff(moment(), "minutes");
        };

        // display all of the fields in a new row in the table
        $("#timeSchedule").append("<tr id=" + childName + "><td>" + updateButton + "<br />" + removeButton + "</td><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + timeToAdd + "</td></tr>");

    });



    $(document).on("click", "#update", function () {
        // get the snapshot of the child you want to call and use those values for the preset values of the inputs
        var rowID = $(this).closest("tr").attr("id");
        console.log(rowID);

        var nameValue = "";
        var destinationValue = "";
        var frequencyValue = "";
        var firstTrainValue = "";

        database.ref().child(rowID).on("value", function (snapshot) {
            nameValue = snapshot.val().trainName;
            console.log(nameValue);
            destinationValue = snapshot.val().destination;
            console.log(destinationValue);
            frequencyValue = snapshot.val().frequency;
            console.log(frequencyValue);
            firstTrainValue = snapshot.val().firstTrain;
            console.log(firstTrainValue);

            var trainNameInput = "<input type='text' value='" + nameValue + "' id='newName'>";
            var destinationInput = "<input type='text' value='" + destinationValue + "' id='newDestination'>";
            var frequencyInput = "<input type='number' value='" + frequencyValue + "' id='newFrequency'>";
            var firstTrainInput = "<input type='text' value='" + firstTrainValue + "' id='newFirstTrain'    >";


            $("#" + rowID).empty();
            $("#" + rowID).html("<td>" + checkButton + "<br />" + removeButton + "</td><td>" + trainNameInput + "</td><td>" + destinationInput + "</td><td>" + frequencyInput + "</td><td>" + firstTrainInput + "<br />**changes first train time (HH:mm - military time)</td>")

        });

        $(document).on("click", "#submitChanges", function () {
            event.preventDefault();
            var newTrainName = $("#newName").val().trim();
            var newDestination = $("#newDestination").val().trim();
            var newFrequency = $("#newFrequency").val().trim();
            var newFirstTrain = $("#newFirstTrain").val().trim();

            database.ref().child(rowID).update({
                trainName: newTrainName,
                destination: newDestination,
                firstTrain: newFirstTrain,
                frequency: newFrequency
            })

            database.ref().child(rowID).on("value", function (snapshot) {
                snapshot.forEach(function(){
                trainName = snapshot.val().trainName;
                console.log(nameValue);
                destination = snapshot.val().destination;
                console.log(destinationValue);
                frequency = snapshot.val().frequency;
                console.log(frequencyValue);
                firstTrain = snapshot.val().firstTrain;
                console.log(firstTrainValue);

                // convert the input to a time format
                minutesForMath = parseInt(moment(firstTrain, "HH:mm").format("mm"));
                console.log("Minutes for Math:" + minutesForMath);

                // format the time in am/pm manner
                formattedTime = moment(firstTrain, "HH:mm:ss").format("HH:mm a");
                console.log("formatted time:" + formattedTime);

                // get the current time
                currentTime = moment().format("HH:mm");
                console.log("current time:" + currentTime);

                // get the minutes for the current time
                currentForMath = parseInt(moment().format("mm"));
                console.log("current for math:" + currentForMath);

                // find the difference in minutes between the current time and the time of the first train
                difference = Math.abs(parseInt(currentForMath - minutesForMath));
                // var difference = moment().diff(timeForMath, "minutes");
                console.log("difference:" + difference);

                // get the remainder of minutes left when the difference is divided by the frequency
                remainder = difference % frequency;
                console.log("remainder:" + remainder);

                timeToAdd = frequency - remainder;
                console.log("time to add:" + timeToAdd);

                // add the remainder to the current time to get the time of the next train
                nextTrain = moment().add(timeToAdd, "minutes").format("hh:mm a");
                console.log("next train time:" + nextTrain);


                if (formattedTime === currentTime) {
                    nextTrain = formattedTime;
                    remainder = moment(timeForMath).diff(moment(), "minutes");
                };

                // display all of the fields in a new row in the table

                $("#" + rowID).html("<td>" + updateButton + "<br />" + removeButton + "</td><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + timeToAdd + "</td></tr>");

            });

            });

        });

    });

    $(document).on("click", "#remove", function () {
        var rowID = $(this).closest("tr").attr("id");
        $("#" + rowID).detach();
        database.ref().child(rowID).remove();
    });

});