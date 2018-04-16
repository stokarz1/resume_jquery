/*  Personal Resume project by Steve Tokarz, steventokarz11@gmail.com 
	Done as a refresher in Ajax, css styling, bootstrap alpha and jQeury
*/

//	resumeObject is used to store the resume json to minimize the ajax calls
var resumeObject
// 	styleArray contains all the styles that can be dynamically added to the style dropdown and their clear names
var styleArray = [{'code':'default_resume', 'name':'Default Resume'}, {'code':'blue', 'name':'Blue Theme'}];

$(document).ready(function() {
	

	//load the default style
	changeStyle('default_resume');

	//fetch the resume contents and draw them
	$.ajax({
		url: "./json/resume.json"
	}).done(function(resumeJson) {
		resumeObject = resumeJson;
		drawResume(resumeJson, "null");
	});

	//append the styles to the dropdown
	_.each(styleArray, function(style){

		$('#themeSelect').append('<option value="'+ style.code +'">' + style.name + '</option>');
		
	});
	
	//bind the changing of styles
	$('#themeSelect').change(function(){
		changeStyle($('#themeSelect').val());
	});
	
	//show the intro modal
	//$('#introModal').modal('show')
	
	//search for a technology after the user has entered 3 keys in the search field
	$('#searchInput').keyup(function(){
		if($('#searchInput').val().length >=3){
			drawResume(resumeObject, $('#searchInput').val());
		} else{
			drawResume(resumeObject, "null");
		}
	});
	//also search if the user presses the enter key, since the previous method doesn't work on Safari
	$('#searchForm').submit(function(event){
		event.preventDefault();
		drawResume(resumeObject, $('#searchInput').val());
	});
	

});

//the function thaat draws the employment section of the resume, expanding and highlighting any matching tech sections if the searchString is present.
var drawResume = function(resumeJson, searchString){
	$('.employmentContainer').empty()
	//itearate over the employment nodes, clone the blank div and populate
	_.each(resumeJson.jobs, function(job){
		var employmentDiv = $('.blankEmployment').clone();
		$(employmentDiv).removeClass('blankEmployment');
		$(employmentDiv).find('.employerName').html(job.employer);
		$(employmentDiv).find('.employerLocation').html(job.location);
		$(employmentDiv).find('.employerLongDates').html(job.dates);
		$(employmentDiv).find('.employerShortDates').html(job.shortDates);
		
		//iterate over the tasks for each job, colone blank div and populate
		_.each(job.tasks, function(task){
			var taskDiv = $('.blankTask').clone();
			$(taskDiv).removeClass('blankTask');
			$(taskDiv).find('.fullTask').html(task.taskName);
			//bind the click functions
			$(taskDiv).find('.fullTask').click(function(){
				$(event.target).parent().find('.techContainerDiv').toggle();
			});
			$(taskDiv).find('.simpleTask').click(function(){
				$(event.target).parent().find('.techContainerDiv').toggle();
			});	
			$(taskDiv).find('.simpleTask').html(task.simpleName);
			//iterate over the techs used for each tesk, determine if they match the searchString, and display all the techs for each task if they match
			_.each(task.techUsed, function(tech){
				var techDiv = $('.blankTech').clone();
				$(techDiv).removeClass('blankTech');
				$(techDiv).html(tech.name);
				if(tech.name.toUpperCase().includes(searchString.toUpperCase())){
					$(techDiv).addClass('highlightedTech');
					$(taskDiv).find(".techContainerDiv").removeClass("hiddenTech");
				}
				$(taskDiv).find('.techContainerDiv').append(techDiv);
			});			
			$(employmentDiv).find('.taskContainer').append(taskDiv);
		});
		//append completed div to the employmentContainer
		$('.employmentContainer').append(employmentDiv);
	});
};

// used to change the stylesheet of the site by disabling all other styles by code and enabling the selected one
var changeStyle = function(chosenStyle){
	_.each(styleArray, function(style){

		if(chosenStyle == style.code){
			document.getElementById(style.code).disabled  = false;
		} else{
			document.getElementById(style.code).disabled  = true;
		}
	});
}