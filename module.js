let acc_data = { name: 'talks', phone: 'talks' };
$(function () {
    // variables
    let acc;
    let lUser = [];
    let lMess = [];
    let userSend = [];
    let userIndex;
    $('#boxChat').hide();
    $('#titleName').hide();
    $('#divSend').hide();

    // Check user (create or get)
    firebase.database().ref('User').on('child_added', function (snapshot) {
        //Do something with the data
        lUser.push({ name: snapshot.val().name, phone: snapshot.val().phone });
        if (snapshot.val().phone == acc_data.phone) {
            acc = { name: snapshot.val().name, phone: snapshot.val().phone };
        }
    });
    firebase.database().ref('Mess').on('child_added', function (snapshot) {
        //Do something with the data
        if (acc_data.phone == snapshot.val().to || acc_data.phone == snapshot.val().phone) {
            lMess.push({ text: snapshot.val().text, phone: snapshot.val().phone, to: snapshot.val().to, seen: snapshot.val().seen, time: snapshot.val().time });

            if (userSend.findIndex(e => e.phone == snapshot.val().phone) == -1) {
                //
                var user = lUser.find(e => e.phone == snapshot.val().phone);
                if (user != undefined) {
                    userSend.push({ name: user.name, phone: user.phone });
                    var button = document.createElement('button');
                    button.onclick = function () {
                        $('#boxChat').show();
                        $('#titleName').show();
                        $('#divSend').show();
                        userIndex = user;
                        document.getElementById('name').innerHTML = user.name;
                        var messShow = [];
                        lMess.forEach((e) => {
                            if (e.phone == user.phone || e.to == user.phone) {
                                messShow.push(e);

                            }
                        });
                        messShow.forEach((e) => {
                            if (e.phone == acc_data.phone) {
                                // element
                                var li = document.createElement('li');
                                li.className = 'clearfix';
                                var div = document.createElement('div');
                                div.className = "message-data text-right";
                                var span = document.createElement('span');
                                span.className = "message-data-time";
                                span.innerHTML = e.time;
                                div.appendChild(span);
                                var divText = document.createElement('div');
                                divText.className = "message other-message float-right";
                                divText.innerHTML = e.text;
                                li.appendChild(div);
                                li.appendChild(divText);
                                $('#chatList').append(li);
                            } else
                                if (e.to == acc_data.phone) {
                                    // element
                                    var li = document.createElement('li');
                                    li.className = 'clearfix';
                                    var div = document.createElement('div');
                                    div.className = "message-data";
                                    var span = document.createElement('span');
                                    span.className = "message-data-time";
                                    span.innerHTML = e.time;
                                    div.appendChild(span);
                                    var divText = document.createElement('div');
                                    divText.className = "message my-message";
                                    divText.innerHTML = e.text;
                                    li.appendChild(div);
                                    li.appendChild(divText);
                                    $('#chatList').append(li);
                                }
                        })
                    }
                    var li = document.createElement('li');
                    li.className = 'clearfix';
                    var img = document.createElement('img');
                    img.src = "https://bootdey.com/img/Content/avatar/avatar1.png";
                    img.alt = "avatar";
                    var div = document.createElement('div');
                    div.className = "about";
                    var divName = document.createElement('div');
                    divName.className = "name";
                    divName.innerHTML = user.name;
                    var divStatus = document.createElement('div');
                    divStatus.className = "status";
                    var i = document.createElement('i');
                    i.className = "fa fa-circle offline";
                    divStatus.appendChild(i);
                    var span = document.createElement('span');
                    span.innerHTML = 'left 7 mins ago';
                    divStatus.appendChild(span);
                    div.appendChild(divName);
                    div.appendChild(divStatus);
                    li.appendChild(img);
                    li.appendChild(div)
                    button.appendChild(li);
                    //     button.appendChild(`<li class="clearfix">
                    //     <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar">
                    //     <div class="about">
                    //         <div class="name">${user.name}</div>
                    //         <div class="status"> <i class="fa fa-circle offline"></i> left 7 mins ago </div>
                    //     </div>
                    // </li>`);
                    $('#listUser').append(button);
                }
            }

            if (userIndex != undefined) {
                if (userIndex.phone == snapshot.val().phone || userIndex.phone == snapshot.val().to) {
                    if (snapshot.val().phone == acc_data.phone) {
                        // element
                        var li = document.createElement('li');
                        li.className = 'clearfix';
                        var div = document.createElement('div');
                        div.className = "message-data text-right";
                        var span = document.createElement('span');
                        span.className = "message-data-time";
                        span.innerHTML = snapshot.val().time;
                        div.appendChild(span);
                        var divText = document.createElement('div');
                        divText.className = "message other-message float-right";
                        divText.innerHTML = snapshot.val().text;
                        li.appendChild(div);
                        li.appendChild(divText);
                        $('#chatList').append(li);
                    } else
                        if (snapshot.val().to == acc_data.phone) {
                            // element
                            var li = document.createElement('li');
                            li.className = 'clearfix';
                            var div = document.createElement('div');
                            div.className = "message-data";
                            var span = document.createElement('span');
                            span.className = "message-data-time";
                            span.innerHTML = snapshot.val().time;
                            div.appendChild(span);
                            var divText = document.createElement('div');
                            divText.className = "message my-message";
                            divText.innerHTML = snapshot.val().text;
                            li.appendChild(div);
                            li.appendChild(divText);
                            $('#chatList').append(li);
                        }
                    document.getElementById('chatList').scrollIntoView(false);
                }
            }
        }
    });
    $('#send').click(function () {
        send(firebase, userIndex.phone, acc, $('#inputText').val());
        $('#inputText').val('');
    });
    // enter key
    $('#inputText').on('keypress', function (e) {
        if (e.which === 13) {

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            //Do Stuff, submit, etc..
            send(firebase, userIndex.phone, acc, $('#inputText').val());
            $(this).val('');

            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
        }
    });
});


function send(firebase, to, acc, text) {
    if (acc == undefined) {
        firebase.database().ref('User').push({
            name: acc_data.name,
            phone: acc_data.phone,
        });
    }
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    var date = dt.getDate() + "/" + dt.getMonth() + "/" + dt.getFullYear();
    firebase.database().ref('Mess').push({
        text: text,
        phone: acc_data.phone,
        to: to,
        time: time + ", " + date,
        seen: false
    });
}