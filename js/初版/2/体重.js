var height = parseFloat(prompt("请输入身高(m):"));
var weight = parseFloat(prompt('请输入体重(kg):'));
var bmi=weight/(height*height);
if(bmi<18.5){
	alert("你的体重过轻。")
} else if(18.5<bmi<25){
	alert("你的体重正常。")
} else if(25<bmi<28){
	alert("你的体重过重。")
} else if(28<bmi<32){
	alert("你的体重肥胖。")
} else {
	alert("你的体重严重肥胖。")
}