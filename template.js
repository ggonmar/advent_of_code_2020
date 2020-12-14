try{input = document.getElementsByTagName("pre")[0].innerText;}
catch(e){
    input=getLiteralInput();
}
input = input.split("\n").filter(e => e.length);


function dayX(input){

}

function dayX_2(input){

}

dayX(input);
dayX_2(input);

function getLiteralInput(){
    return ``;
}