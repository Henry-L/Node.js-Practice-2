var userListData = [];

$(document).ready(function() {
	populateTable();

	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	$('#btnAddUser').on('click', addUser);
	$('#btnEditUser').on('click', editUser);


	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

	$('#userList table tbody').on('click', 'td a.linkedituser', showEditUserForm);
});

function populateTable() {
	var tableContent = '';
	$.getJSON('/users/userlist', function(data) {
		userListData = data
		$.each(data, function() {
			tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '<td><a href="#" class="linkedituser" rel="' + this.username + '">edit</a></td>';
            tableContent += '</tr>';
		});
		$('#userList table tbody').html(tableContent);
	});
};

function showUserInfo(event) {
	event.preventDefault();

	var thisUserName = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem) {return arrayItem.username;}).indexOf(thisUserName);

	var thisUserObject = userListData[arrayPosition];

	$('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

    $('#userInfo fieldset').addClass('hide');
    
};

function showEditUserForm(event) {
	event.preventDefault();

	$('#userInfo span').empty();

	var thisUserName = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem) {return arrayItem.username;}).indexOf(thisUserName);

	var thisUserObject = userListData[arrayPosition];

	$('#userInfo fieldset').removeClass('hide');

    $('#editUserName').val( thisUserObject.username );
    $('#editUserEmail').val( thisUserObject.email );
    $('#editUserFullname').val( thisUserObject.fullname );
    $('#editUserAge').val(thisUserObject.age);
    $('#editUserGender').val(thisUserObject.gender);
    $('#editUserLocation').val(thisUserObject.location);
    $('#editUserID').val(thisUserObject.id);

}

function editUser(event) {
	event.preventDefault();

	var errorCount = 0;
	$('#editUser input').each(function(index, val) {
		if($(this).val() === '') {errorCount++;}
	});

	if(errorCount === 0) {

		var editedUser = {
			'username': $('#editUser fieldset input#editUserName').val(),
            'email': $('#editUser fieldset input#editUserEmail').val(),
            'fullname': $('#editUser fieldset input#editUserFullname').val(),
            'age': $('#editUser fieldset input#editUserAge').val(),
            'location': $('#editUser fieldset input#editUserLocation').val(),
            'gender': $('#editUser fieldset input#editUserGender').val(),
		}

		$.ajax({
			type: 'PUT',
			data: editedUser,
			url: '/users/edituser',
			dataType: 'JSON'
		}).done(function(response) {

			// POST was successful of response is blank
			if(response.msg === '') {
				$('#editUser fieldset input').val('');
				populateTable();
			}
			else {
				alert('Error: ' + response.msg);
			}
		});
	}
	else {
		// If errorCount was anything other than 0
		alert('Please fill in all fields');
		return false;
	}
};

function addUser(event) {
	event.preventDefault();

	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === '') {errorCount++;}
	});

	if(errorCount === 0) {

		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
		}

		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response) {

			// POST was successful of response is blank
			if(response.msg === '') {
				$('#addUser fieldset input').val('');

				populateTable();
			}
			else {
				alert('Error: ' + response.msg);
			}
		});
	}
	else {
		// If errorCount was anything other than 0
		alert('Please fill in all fields');
		return false;
	}
};

function deleteUser(event) {
	event.preventDefault();

	var confirmation = confirm('Are you sure you want to delete this user?');

	if(confirmation === true) {
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(response) {

			if(response.msg === '') {
			}
			else {
				alert('Error: ' + response.msg);
			}

			populateTable();
		})
	}
	else {
		// they said no to the confirm popup
		return false
	}
};