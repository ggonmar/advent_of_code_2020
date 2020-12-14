try{input = document.getElementsByTagName("pre")[0].innerText;}
catch(e){
    input=``;
}
input = input.split("\n").filter(e => e.length);


