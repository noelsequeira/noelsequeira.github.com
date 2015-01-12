/*$('.collapse').on('hidden.bs.collapse', function() {
	console.log("Hide!!!")
})

$('.collapse').on('show.bs.collapse', function() {
	console.log("Show!!!")
})*/

$(document)
	.ready(function() {

		$("#content .text")
			.fadeIn(2000)
			.animate({
				'top': '0px'
			}, {
				duration: 1000,
				queue: false
			}, 'easeOutExpo', function() {});


		$('.carousel').carousel({
			interval: 2000
		});

	});
