var userExist = false;
var userFullName = "";

function initListeners() {}

function initFirebase() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("auth change logged in");
            $(".name").html(userFullName);
            $(".load").prop("disabled", false);
            userExist = true;
        }
        else {
            console.log("auth change logged out");
            $(".name").html("");
            $(".load").prop("disabled", true);
            userExist = false;
            userFullName = "";
        }
    })
}

function createAcc() {
    $("#app").html(`<h2>Sign Up</h2><hr>
    <div class="create-account">
      <label for="fName">First Name</label>
      <input type="text" name="fName" id="fName">
      <label for="lName">Last Name</label>
      <input type="text" name="lName" id="lName">
      <label for="email">Email address</label>
      <input type="text" name="email" id="email">
      <label for="Password">Password</label>
      <input type="password" name="password" id="pw">
      <input type="submit" id="createBtn" name="submit" value="Create Account" onclick="createAccount()">
    </div>
    `);
}

function signIn() {
    

    $("#app").html(`<h2>Sign In</h2><hr><div class="login">
    <input type="text" id="log-email" placeholder="Email Address">
    <input type="password" id="log-pw" placeholder="Password">
    <input type="submit" value="Login" name="Submit" onclick="login()">
  </div>`);
    
    // firebase
    //     .auth()
    //     .signInAnonymously()
    //     .then(() => {
    //         console.log("signed in");
    //     })
    //     .catch((error) =>{
    //         var errorCode = error.code;
    //         var errorMsg = error.message;
    //         console.log("Error Signing in ", errorCode + " " , errorMsg);
    //     });
}

function signOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            
            console.log("signed out");
            $("#app").html("");

        })
        .catch((error) =>{
            var errorCode = error.code;
            var errorMsg = error.message;
            console.log("Error Signing out ", errorCode + " " , errorMsg);
        });
}

function createAccount() {
    let fname = $("#fName").val();
    let lname = $("#lName").val();
    let email = $("#email").val();
    let pw = $("#pw").val();
    console.log("create " + fname + lname + email + pw);

    let fullName = fname + ' ' + lname;
    firebase
    .auth()
    .createUserWithEmailAndPassword(email, pw)
    .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        console.log("created");
        firebase.auth().currentUser.updateProfile({
            displayName: fullName,
        });
        userFullName = fullName;
        $(".name").html(userFullName);
    
        $("#fName").empty();
        $("#lName").empty();
        $("#email").empty();
        $("#pw").empty();
        // ...
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " create error " + errorMessage);

        // ..
    });

}

function login() {
    let email = $("#log-email").val();
    let pw = $("#log-pw").val();

    firebase
    .auth()
    .signInWithEmailAndPassword(email, pw)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log("logged in");
    $("#log-email").val("");
    $("#log-pw").val("");
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("logged in error ", errorMessage);

  });

}

function loadJSON() {

    $("#app").html("");
    let data = "<ul>";

    $.each(lists, function(i, item) {

        data += `<li id=${i} onclick="loadList(${i})">
                    ${item.name}
                <span class="right">Items: ${item.list.length}</span>
                </li>
        `;
        
    });
    data += "</ul>";

    $("#app").html(data);

}

function deleteItem(listIndex, itemIndex) {

    lists[listIndex].list.splice(itemIndex,1);
    loadList(listIndex);
}

function loadList(Listidx) {

    content = `<button onclick="loadJSON()">Back</button><ul>`;

    $.each(lists[Listidx].list, function(idx, listItem) {
        content += `
        <li class="${ listItem.checked ? "strike": ""}" id="${Listidx}">
            <input ${ listItem.checked ? (checked = "checked") : ""} type="checkbox" id="${idx}" name="${listItem.item}" onclick="itemChecked(this, ${Listidx}, ${idx})">
                <span>${listItem.item}</span>
                <span class="delete" onClick="deleteItem(${Listidx}, ${idx})">Delete</span>
        </li>`;
    });

    content += `</ul>
                <div class="addItemInput">
                    <input id="addItem" type="text">
                    <button onclick="addItem(${Listidx})">
                        Add Item
                    </button>
                </div>`;

    $("#app").html(content);

}


function addItem(listIndex) {
    let newItemName = $("#addItem").val();

    let newObj = {
        item: newItemName,
        checked: false,
        category: ""
    }

    lists[listIndex].list.push(newObj);
    loadList(listIndex);
}

$(document).ready(function() {

    try {
        let app = firebase.app();
        initListeners();
        initFirebase();
        
    } catch (error) {
        console.log("error " , error);
    }

});


function itemChecked(element, listIndex, item) {
    $(element).parent().toggleClass("strike");
    let checkedValue = !lists[listIndex].list[item].checked;
    lists[listIndex].list[item].checked = checkedValue;
    console.log("checked " , lists);

}


var lists = [
    {
        name: "Groceries",
        list: [
            {
                item: "Milk",
                checked: false,
                category: "Dairy"
            },
            {
                item: "Eggs",
                checked: false,
                category: "Poultry"
            },
            {
                item: "Cheese",
                checked: false,
                category: "Dairy"
            },
            {
                item: "Bread",
                checked: false,
                category: ""
            },
            {
                item: "Banana",
                checked: false,
                category: "Fruits"
            },
            {
                item: "Apple",
                checked: false,
                category: "Fruits"
            },
            {
                item: "Cornflakes",
                checked: false,
                category: "Cereal"
            },
            {
                item: "Ranch",
                checked: false,
                category: "Condiments"
            },
            {
                item: "Ketchup",
                checked: false,
                category: "Condiments"
            },
            {
                item: "Pasta",
                checked: false,
                category: ""
            }
        ]
    },
    {
        name: "Camping",
        list: [
            {
            item: "Tent",
            checked: false,
            category: ""
        },
        {
            item: "Gas Canister",
            checked: false,
            category: "Fuel"
        },
        {
            item: "Wood",
            checked: false,
            category: "Dairy"
        },
        {
            item: "Fuel",
            checked: false,
            category: ""
        },
        {
            item: "Food Supplies",
            checked: false,
            category: "Fruits"
        },
        {
            item: "Sleeping Bag",
            checked: false,
            category: "Fruits"
        },
        {
            item: "Milk",
            checked: false,
            category: "Cereal"
        },
        {
            item: "Batteries",
            checked: false,
            category: "Condiments"
        },
        {
            item: "Map",
            checked: false,
            category: "Condiments"
        },
        {
            item: "Books",
            checked: false,
            category: ""
        }

        ]
    },
    {
        name: "Random things",
        list: [
            {
            item: "Ice cube tray",
            checked: false,
            category: ""
        },
        {
            item: "CD",
            checked: false,
            category: ""
        },
        {
            item: "bowl",
            checked: false,
            category: ""
        },
        {
            item: "STOP sign",
            checked: false,
            category: ""
        },
        {
            item: "deodorant",
            checked: false,
            category: ""
        },
        {
            item: "Conditioner",
            checked: false,
            category: ""
        },
        {
            item: "buckle",
            checked: false,
            category: ""
        },
        {
            item: "sofa",
            checked: false,
            category: ""
        },
        {
            item: "Cinder Block",
            checked: false,
            category: "Condiments"
        },
        {
            item: "Piano",
            checked: false,
            category: ""
        }

        ]
    },

    {
        name: "Clothes",
        list: [
            {
            item: "T-Shirt",
            checked: false,
            category: ""
        },
        {
            item: "Cravat",
            checked: false,
            category: ""
        },
        {
            item: "Hat",
            checked: false,
            category: ""
        },
        {
            item: "Tankini",
            checked: false,
            category: ""
        },
        {
            item: "Gloves",
            checked: false,
            category: ""
        },
        {
            item: "Poncho",
            checked: false,
            category: ""
        },
        {
            item: "Shawl",
            checked: false,
            category: ""
        },
        {
            item: "Robe",
            checked: false,
            category: ""
        },
        {
            item: "Tracksuit",
            checked: false,
            category: "Condiments"
        },
        {
            item: "Tights",
            checked: false,
            category: ""
        }

        ]
    },

    {
        name: "Flowers",
        list: [
            {
            item: "Lilac",
            checked: false,
            category: ""
        },
        {
            item: "Marigold",
            checked: false,
            category: ""
        },
        {
            item: "Cosmos",
            checked: false,
            category: ""
        },
        {
            item: "Artemisia",
            checked: false,
            category: ""
        },
        {
            item: "Lantana",
            checked: false,
            category: ""
        },
        {
            item: "Columbine",
            checked: false,
            category: ""
        },
        {
            item: "Lobelia",
            checked: false,
            category: ""
        },
        {
            item: "Hydrangea",
            checked: false,
            category: ""
        },
        {
            item: "Hybrid Tea Roses",
            checked: false,
            category: "Condiments"
        },
        {
            item: "Bachelor Button",
            checked: false,
            category: ""
        }

        ]
    },

    {
        name: "Instruments",
        list: [
            {
            item: "Ukulele",
            checked: false,
            category: ""
        },
        {
            item: "Slide Whistle",
            checked: false,
            category: ""
        },
        {
            item: "Organ",
            checked: false,
            category: ""
        },
        {
            item: "Piano",
            checked: false,
            category: ""
        },
        {
            item: "Fiddle",
            checked: false,
            category: ""
        },
        {
            item: "Cowbell",
            checked: false,
            category: ""
        },
        {
            item: "Keyboard",
            checked: false,
            category: ""
        },
        {
            item: "Turntables",
            checked: false,
            category: ""
        },
        {
            item: "Ocarina",
            checked: false,
            category: "Condiments"
        },
        {
            item: "Bagpipes",
            checked: false,
            category: ""
        }

        ]
    },

    {
        name: "GDP Rankings",
        list: [
            {
            item: "USA",
            checked: false,
            category: "1"
        },
        {
            item: "China",
            checked: false,
            category: "2"
        },
        {
            item: "Japan",
            checked: false,
            category: "3"
        },
        {
            item: "Germany",
            checked: false,
            category: "4"
        },
        {
            item: "India",
            checked: false,
            category: "5"
        },
        {
            item: "United Kingdom",
            checked: false,
            category: "6"
        },
        {
            item: "France",
            checked: false,
            category: "7"
        },
        {
            item: "Brazil",
            checked: false,
            category: "8"
        },
        {
            item: "Italy",
            checked: false,
            category: "9"
        },
        {
            item: "Canada",
            checked: false,
            category: "10"
        }

        ]
    },
    {
        name: "Mexican Food",
        list: [
            {
            item: "Chilaquiles",
            checked: false,
            category: ""
        },
        {
            item: "Pozole",
            checked: false,
            category: ""
        },
        {
            item: "Tacos al pastor",
            checked: false,
            category: ""
        },
        {
            item: "Chiles en nogada",
            checked: false,
            category: ""
        },
        {
            item: "Elote",
            checked: false,
            category: ""
        },
        {
            item: "Enchiladas",
            checked: false,
            category: ""
        },
        {
            item: "Mole",
            checked: false,
            category: ""
        },
        {
            item: "Tostadas",
            checked: false,
            category: ""
        },
        {
            item: "Burrito",
            checked: false,
            category: "Condiments"
        },
        {
            item: "Chimichangas",
            checked: false,
            category: ""
        }

        ]
    },

    {
        name: "F1 Drivers",
        list: [
            {
            item: "Lewis Hamilton",
            checked: false,
            category: ""
        },
        {
            item: "Michael Schumacher",
            checked: false,
            category: ""
        },
        {
            item: "Sebastian Vettel",
            checked: false,
            category: ""
        },
        {
            item: "Alain Prost",
            checked: false,
            category: ""
        },
        {
            item: "Ayrton Senna",
            checked: false,
            category: ""
        },
        {
            item: "Max Verstappen",
            checked: false,
            category: ""
        },
        {
            item: "Fernando Alonso",
            checked: false,
            category: ""
        },
        {
            item: "Nigel Mansell",
            checked: false,
            category: ""
        },
        {
            item: "Jackie Stewart",
            checked: false,
            category: "Condiments"
        },
        {
            item: "Niki Lauda",
            checked: false,
            category: ""
        }

        ]
    },

    {
        name: "Martial Arts",
        list: [
            {
            item: "Taekwondo",
            checked: false,
            category: ""
        },
        {
            item: "Kung Fu",
            checked: false,
            category: ""
        },
        {
            item: "Judo",
            checked: false,
            category: ""
        },
        {
            item: "Aikido",
            checked: false,
            category: ""
        },
        {
            item: "Karate",
            checked: false,
            category: ""
        },
        {
            item: "Muay Thai",
            checked: false,
            category: ""
        },
        {
            item: "Jeet Kune Do",
            checked: false,
            category: ""
        },
        {
            item: "Brazilian Jiu-Jitsu",
            checked: false,
            category: ""
        },
        {
            item: "Krav Maga",
            checked: false,
            category: "Condiments"
        },
        {
            item: "Boxing",
            checked: false,
            category: ""
        }

        ]
    }
];

