var lock = new Auth0Lock('P5EDxUyc02sAmpwjQuOAlkrr9GXCgwrZ', 'spiders1999.auth0.com', {
    auth: {
      params: {
        scope: 'openid email app_metadata'
      }
    }
  });

$(document).ready(function(){
  $('#btn-login').on('click', login);
  $('#btn-logout').on('click', logout);
  $('#new-student-form').on('submit', newStudent)

})

function login(e){
  e.preventDefault();
  lock.show();
}
function logout(e){
  e.preventDefault();
  localStorage.removeItem('idToken');
  $('#logged-out').show();
  $('#logged-in').hide();
  $('#student-list-container').hide();
  $('#new-form-container').hide();

}

lock.on("authenticated", function(authResult) {
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      console.log(error);
      return;
    }
    localStorage.setItem('idToken', authResult.idToken);
    showStudents();
    $('#logged-out').hide();
    $('#logged-in').show();
    $('#student-list-container').show();
    if (profile.app_metadata.role === "admin") {
      $('#new-form-container').show();
    }
    console.log(profile.app_metadata.role);
  });
});


function showStudents(){
  var options = {
    url: 'http://localhost:3000/students',
    method: 'GET',
    headers: {
      'Authorization':'Bearer ' + localStorage.getItem('idToken')
    }
  }
  var request = $.ajax(options);
  request.done(function(response){
    response.forEach(function(student){
      showStudent(student);
    })
  }).fail(function(header, error, code){
    console.log(error, code);
  })
}

function newStudent(e){
  e.preventDefault();
  var options = {
    url: 'http://localhost:3000/students',
    method: 'POST',
    data: {
      firstName: $('#new-student-first').val(),
      lastName: $('#new-student-last').val()
    },
    headers: {
      'Authorization':'Bearer ' + localStorage.getItem('idToken')
    }
  }
  var request = $.ajax(options);
  request.done(function(response){
    showStudent(response)
  }).fail(function(header, error, code){
    console.log(error, code);
  })
}

function showStudent(student){
  var $li = $('<li />');
  var studentFull = student.firstName + " " + student.lastName;
  $li.text(studentFull);
  $('#student-list').append($li);
}

function isLoggedIn(){
  if (localStorage.getItem('idToken')){
    return true;
  } else {
    return false;
  }
}
