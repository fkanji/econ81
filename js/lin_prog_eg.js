var calculator;
    	$(function () {
		  $('#next1').on('click', function () {
		  	$('#next1').fadeOut();
		  	$('#step1').fadeIn();
		  });
		});
		$(function () {
		  $('#solns').on('click', function () {
		  	$('#solns').fadeOut();
		  	$('#solution').fadeIn();
		  	calculator.setExpression({id: 'soln', latex:'(27.5, 15)', color: Desmos.Colors.BLACK});
		  });
		});

		$(function () {
		  $('#next2').on('click', function () {
		  	$('#next2').fadeOut();
		  	$('#step2').fadeIn();
		  	var elt = document.getElementById('calculator');
			var properties = {
				expressionsCollapsed: true
			};
			calculator = Desmos.Calculator(elt, properties);
			calculator.setViewport([-20, 80, -20, 70]);
			calculator.setExpression({id:'con_1', latex:'x<0'});
			calculator.setExpression({id:'con_2', latex:'y<0'});
			calculator.setExpression({id:'con_3', latex:'2x+3y>100'});
			calculator.setExpression({id:'con_4', latex:'2.5x+2y>100'});
			calculator.setExpression({id:'con_5', latex:'3x+0.5y>90'});
		  });
		});

		function zoom(){
			calculator.setViewport([18, 35, 6, 22]);
		}

		function addline(){
			calculator.setViewport([-20, 80, -20, 70]);
			calculator.setExpression({id:'slider', latex:'a=0'});
			calculator.setExpression({id:'utility', latex:'10x+8y=a'});
			$('#slider_text').fadeIn();
			$('#slid').html("<br><input id = \"slider\" type=\"range\" min=\"-20\" max=\"430\" step=\"0.5\" value=\"0\" />");
			$('#chosen').html("utility = " + $('#slider').val());
			$('#slider').on('input', function(){
			    $('#chosen').html("utility = " + $('#slider').val());
			    calculator.setExpression({id:'slider', latex:'a='+$('#slider').val()});
			});
		}