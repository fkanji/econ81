var vars;
	var constraints;
	var calc_set = false;
	var calculator;
	var sol_x;
	var sol_y;
	$(function () {
	  $('.gc').on('click', function () {
	  	vars = parseInt($('input[name="num_vars"]:checked').val());
	    $('#num_variables').html("<br> Number of variables = " + String(vars));
	  	constraints = parseInt($('input[name="num_cons"]:checked').val());
	    $('#num_constraints').html("<br> Number of constraints = " + String(constraints));
	    make_inputs();
	  });
	});

	function solve_prob() {
	  	utility = [];
	  	i=1;
	  	while(i<=vars){
	  		field = $('input[name="coeff_'+i+'"]').val();
	  		if(isNaN(field) || field==""){
	  			alert("Please enter a valid utility condition.");
	  			return false;
	  		}
	  		utility.push(-1*parseFloat(field));
	  		i++;
	  	}
	  	i=1;
	  	rhs = [];
	  	cons_list = [];
	  	while (i<=constraints){
	  		window["cons_"+i]=[];
	  		j = 1;
	  		while (j<=vars){
	  			field = $('input[name="constr_'+i+'_'+j+'"]').val()
	  			if(isNaN(field) || field==""){
		  			alert("Please enter constraints.");
		  			return false;
		  		}
	  			window["cons_"+i].push(parseFloat(field));
	  			j++;
	  		}
	  		cons_list.push(window["cons_"+i]);
	  		field = $('input[name="cons_right_'+i+'"]').val();
	  		if(isNaN(field) || field==""){
		  		alert("Please enter constraints.");
		  		return false;
		  	}
	  		rhs.push(parseFloat(field));
	  		i++;
	  	}
	  	if($('#nn').is(":checked")){
	  		i=0;
	  		while(i<vars){
	  			new_cons = Array.apply(null, new Array(vars)).map(Number.prototype.valueOf,0);
	  			new_cons[i]=-1;
	  			cons_list.push(new_cons);
	  			rhs.push(0);
	  			i++;
	  		}
	  	}

	  	result = numeric.solveLP(utility, cons_list, rhs);
	  	$('#calc_text').html("");
			$('#calculator').html("");
			$('#slid').html("");
			$('#chosen').html("");
		$('#calculator').hide();
	  	if(result.message == ""){
	  		add_result = "A possible solution is<br>";
	  		for(i=1; i<=vars; i++){
	  			add_result += "x<sub>"+i+"</sub> = " + numeric.trunc(result.solution[i-1],1e-2)+"<br>"
	  		}

			$('#results').html(add_result);
			if (vars==2){
				$('#calculator').show();
				sol_x = parseFloat(numeric.trunc(result.solution[0],1e-2));
				sol_y = parseFloat(numeric.trunc(result.solution[1],1e-2));
				final_utility = parseFloat($('input[name="coeff_'+'1'+'"]').val()) * sol_x + parseFloat($('input[name="coeff_'+'2'+'"]').val()) * sol_y;
					$('#calc_text').html("<br><br> Below is a graphical representation of the Problem. The feasable set of solutions is given by the white unshaded space.<br><br>");
					var elt = document.getElementById('calculator');
					var properties = {
						expressionsCollapsed: true
					};
				  calculator = Desmos.Calculator(elt, properties);
				  diff_util = Math.abs((final_utility*2)-final_utility)+1;
				  $('#slid').html("<br><input id = \"slider\" type=\"range\" min=\""+(final_utility-diff_util)+"\" max=\""+(final_utility+diff_util)+"\" step=\"0.1\" value=\""+final_utility+"\" />");
				  diff_x = Math.abs((sol_x*2.5)-sol_x)+5;
				  diff_y = Math.abs((sol_y*2.5)-sol_y)+5;
				calculator.setViewport([sol_x-diff_x, sol_x+diff_x, sol_y-diff_y, sol_y+diff_y]);
				i=1;
				while (i<=constraints){
					cons_exp = $('input[name="constr_'+i+'_'+"1"+'"]').val()+"x + "+ $('input[name="constr_'+i+'_'+"2"+'"]').val()+"y \\> " + $('input[name="cons_right_'+i+'"]').val();
					graph_name = "graph" + i;
			  		calculator.setExpression({id:graph_name, latex:cons_exp});
			  		i++;
				}
				if($('#nn').is(":checked")){
					calculator.setExpression({id:"ineq_1", latex:"x\\<0"});
					calculator.setExpression({id:"ineq_2", latex:"y\\<0"});
				}
				calculator.setExpression({id:'slider', latex:'a='+final_utility});
				utility_expression = ""+$('input[name="coeff_'+'1'+'"]').val() + "x + " + $('input[name="coeff_'+'2'+'"]').val() + "y = a";
				calculator.setExpression({id:'utility', latex:utility_expression});
				solution_text = "("+sol_x + ", " + sol_y + ")";
				calculator.setExpression({id:'solution', latex:solution_text});
				// var updateVariable = function (evt) {
			 //        calculator.setExpression({id:'slider', latex:'a='+(evt.pageX/10)});
			 //      };
			 //      document.getElementById('calculator').addEventListener('mousedown', updateVariable, true);
			 
			//  function updateSlider(slideAmount) {
			//  	$('#chosen').html("a = " + $('#slider').val());
			// }
			 $('#chosen').html("utility = " + $('#slider').val());
			 $('#slider').on('input', function(){
			    $('#chosen').html("utility = " + $('#slider').val());
			    calculator.setExpression({id:'slider', latex:'a='+$('#slider').val()});
			});

			}
	  	}else{
	  		$('#results').html("The solution cannot be calculated. Reason: "+result.message);
	  	}
	  	return false;
	  	
	  }

	function make_inputs(){
		input_text = "<form onsubmit=\"return solve_prob();\">";
		input_text += "<br>Write your utility condition (function that you want to maximize):&nbsp;&nbsp;"
		i=1;
		while (i<=vars){
			input_text += "<input type=\"text\" name=\"coeff_"+i+"\" id=\"num\" class=\"line\"> x<sub>" + i + "</sub>";
			if(i<vars){
				input_text += "&nbsp;&nbsp; + &nbsp;&nbsp;";
			}
			i++;
		}
		input_text += "<br><br>Write your constraints:<br>";
		i=1;
		while (i<=constraints){
			j=1;
			while (j<=vars){
				input_text += "<input type=\"text\" name=\"constr_"+i+"_" + j +"\" id=\"num\" class=\"line\"> x<sub>" + j+"</sub>";
				if(j<vars){
					input_text += "&nbsp;&nbsp; + &nbsp;&nbsp;";
				}
			j++;
			}
			input_text += "&nbsp;&nbsp; &#8804; &nbsp;&nbsp;";
			input_text += "<input type=\"text\" name=\"cons_right_"+i+"\" id=\"num\" class=\"line\"><br>";
			i++;
		}
		input_text += "<br><input type=\"submit\" class=\"modern\"></form>"
		$('#get_inputs').html(input_text);
	}
