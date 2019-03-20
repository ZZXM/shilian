   	function hideorshow(){
    	var current=document.getElementById("displaypup");
    	if(current.style.display == 'none'){
    		current.style.display = 'block';
    	}
    	else{
    		current.style.display = 'none';
    	}
    };
    var fromclass = document.getElementsByClassName('but');
    var arraybut=Array.from(fromclass) ;
    arraybut.forEach(function(but){
    but.addEventListener('click', hideorshow, true)
    });