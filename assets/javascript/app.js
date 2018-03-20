
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
var removeButton = "<button class='btn btn-default' id='remove'><span class='glyphicon glyphicon-remove'></span></button>"
var checkButton = "<button class='btn btn-default' id='submitChanges'><span class='glyphicon glyphicon-ok'></span></button>"


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
        console.log(childName);
        trainName = childSnapshot.val().trainName;
        destination = childSnapshot.val().destination;
        firstTrain = childSnapshot.val().firstTrain;
        frequency = childSnapshot.val().frequency;

        // conver the input to a time format
        var timeForMath = moment(firstTrain, "HH:mm:ss").format();

        // format the time in am/pm manner
        var formattedTime = moment(firstTrain, "HH:mm:ss").format("hh:mm a");

        // find the difference in minutes between the current time and the time of the first train
        var difference = moment().diff(timeForMath, "minutes");

        // get the remainder of minutes left when the difference is divided by the frequency
        var remainder = difference % frequency;

        // add the remainder to the current time to get the time of the next train
        var nextTrain = moment().add(remainder, "minutes").format("hh:mm a");


        if (difference < 0) {
            nextTrain = formattedTime;
            remainder = moment(timeForMath).diff(moment(), "minutes");
        };

        // display all of the fields in a new row in the table

        $("#timeSchedule").append("<tr id=" + childName + "><td>" + updateButton + removeButton + "</td><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + remainder + "</td></tr>");
        // $("#timeSchedule").append("<tr class='trainRow'><td>" + updateButton + removeButton + "</td><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + remainder + "</td></tr>");


    });

    $(document).on("click", "#update", function () {
        // get the snapshot of the child you want to call and use those values for the preset values of the inputs
        
        var trainNameInput = "<input type='text' value=" + trainName + ">";
        var destinationInput = "<input type='text' value=" + destination + ">";
        var frequencyInput = "<input type='number' value=" + frequency + ">";
        var firstTrainInput = "<input type='text' value=" + firstTrain + ">";

        var rowID = $(this).closest("tr").attr("id");
        $("#" + rowID).empty();
        $("#" + rowID).html("<td>" + checkButton + removeButton + "</td><td>" + trainNameInput + "</td><td>" + destinationInput + "</td><td>" + frequencyInput + "</td><td>" + firstTrainInput + "<br />**changes first train time</td>")

        $(document).on("click", "#submitChanges", function () {
            database.ref().child(rowID).update({
                trainName: trainNameInput.val().trim(),
                destination: destinationInput.val().trim(),
                firstTrain: firstTrainInput.val().trim(),
                frequency: frequencyInput.val().trim()
            })
        })

    });

    $(document).on("click", "#remove", function () {
        var rowID = $(this).closest("tr").attr("id");
        $("#" + rowID).detach();
        // find the unique id assigned by firebase to reference for removal

    });



});


// add buttons to update or remove
// if update is clicked then turn each cell into a form input with the preset info being what is already there
// if remove is clicked then delete the entire row