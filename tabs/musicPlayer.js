function MusicRandomPlay(address){
		document.getElementById("musicPlayer").src = address;
	}
	
function RandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); 
		//The maximum is exclusive and the minimum is inclusive
	}
function Player(){
var a = RandomInt(1,4);
switch(a){
	
	case 1:
		MusicRandomPlay("//music.163.com/outchain/player?type=2&id=1466303986&auto=1&height=66");
	//the sixth sense
		
		break;
	
	case 2:
		MusicRandomPlay("//music.163.com/outchain/player?type=2&id=28941709&auto=1&height=66");
	//ヒビカセ
		
		break;
	
	case 3:
		MusicRandomPlay("//music.163.com/outchain/player?type=2&id=31356410&auto=1&height=66");
	//Mr.taxi
		
		break;
	
	default:
		MusicRandomPlay("//music.163.com/outchain/player?type=2&id=436016471&auto=1&height=66");
	//宵々古今
	
		break;
	
	}
}
