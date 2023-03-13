
import {} from '@solana/web3.js';
const connect_button = document.querySelector('.connect-button') as HTMLElement;
const update_button = document.querySelector('.update_button') as HTMLElement;
const img_1 = document.querySelector('#pic1') as HTMLImageElement;
const img_2 = document.querySelector('#pic2') as HTMLImageElement;
const img_3 = document.querySelector('#pic3') as HTMLImageElement;
const img_4 = document.querySelector('#pic4') as HTMLImageElement;
const img_5 = document.querySelector('#pic5') as HTMLImageElement;
const inp_1 = document.querySelector('#image-upload1') as HTMLImageElement;
const inp_2 = document.querySelector('#image-upload2') as HTMLImageElement;
const inp_3 = document.querySelector('#image-upload3') as HTMLImageElement;
const inp_4 = document.querySelector('#image-upload4') as HTMLImageElement;
const inp_5 = document.querySelector('#image-upload5') as HTMLImageElement;
const field_1 = document.querySelector('#username1') as HTMLInputElement;
const field_2 = document.querySelector('#username2') as HTMLInputElement;
const field_3 = document.querySelector('#username3') as HTMLInputElement;
const field_4 = document.querySelector('#username4') as HTMLInputElement;
const field_5 = document.querySelector('#username5') as HTMLInputElement;


var owner:string = '';

declare global {
    interface Window {
      solana: any;
      solflare:any;
    }
  }



function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showAlert(message:string,color:string) {
    var customAlert = document.querySelector('.custom-alert') as HTMLElement;
    var customAlertMessage = document.querySelector('#custom-alert-message') as HTMLElement;
    
    customAlertMessage.textContent = message;
    customAlert.style.backgroundColor = color == 'teal'? 'teal':'#550505';
    customAlert.style.display = 'block';
    
    setTimeout(function() {
      customAlert.style.display = 'none';
    }, 3000);
};

function show_invalid(field:HTMLInputElement){
    //console.log(field)
    field.classList.add('invalid');
    setTimeout(() => {
        field.classList.remove('invalid')
    }, 10000);
}

function dim() {
    // show the overlay
    var overlay = document.getElementById('overlay');
    var temp_loader = document.getElementById('temp-loader');
    var hint_text = document.getElementById('hint-text');
    overlay!.style.display = 'block';
    temp_loader!.style.display = 'flex';
    hint_text!.style.display = 'block';
  }
  
function undim() {
    // hide the overlay
    var overlay = document.getElementById('overlay');
    var temp_loader = document.getElementById('temp-loader');
    var hint_text = document.getElementById('hint-text');
    overlay!.style.display = 'none';
    temp_loader!.style.display = 'none';  
    hint_text!.style.display = 'none';
  }

const connect = async() => {
    try{
        await window.solana.connect();
        connect_button.textContent = 'Wallet connected'
        owner = window.solana.publicKey.toString()

        showAlert('Successfully connected wallet!','teal');
        connect_button.removeEventListener('click',connect);

    }catch(e){
        showAlert('Error while connecting wallet','red')
        console.log(e)
    }

}



const update = async() =>{
    if (owner === '' ){
        showAlert('Wallet not connected!','red');
        return
    }else if(owner != 'ANt5VC1mAVo8SrPuAc6Ls2VGkaDrehKrrM6NdomkwPq'){
        showAlert('Connected wallet does not have permission!','red');
        return
    }
    else{
        console.log(owner);
        try{
            dim()
            const addresses:Array<string> = [field_1.value,field_2.value,field_3.value,field_4.value,field_5.value]
            const forms:Array<HTMLInputElement> = [field_1,field_2,field_3,field_4,field_5]
            const imgs:Array<HTMLImageElement> = [img_1,img_2,img_3,img_4,img_5];
            var valid_addresses:Array<string> = [];
            var valid_imgs:Array<HTMLImageElement> = [];
            var proceed:boolean = true
            for (var i=0; i<addresses.length; i++){
                if (addresses[i] === ''){
                    continue
                }
                if (addresses[i] != '' && imgs[i].src.includes('base-invis.PNG')){
                    showAlert('Some provided addresses are missing images!','red');
                    undim();
                    return
                }
                var is_valid = 'worked';
                
                await fetch('https://saisei-server.com/verify-teki', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                      mint: addresses[i],
                      })
                })
                .then(response => response.json())
                .then(data => {
                    is_valid = data;              
                })
                if (is_valid === 'worked'){
                    console.log('updating this nft')
                    valid_addresses.push(addresses[i]);
                    valid_imgs.push(imgs[i]);
                }else{
                    console.log('updating failed')
                    showAlert('invalid Address','red');
                    show_invalid(forms[i]);
                    undim();
                    return
                }
            }
            
            console.log(valid_addresses, '\n')
            console.log(valid_imgs, '\n')

            const hint_text = document.getElementById('hint-text');
            hint_text!.innerText = `0/${valid_addresses.length} updates completed`;

            for (var i=0; i<valid_addresses.length; i++){
                const mint_addres = valid_addresses[i];
                const new_img = valid_imgs[i].src;

                await fetch('https://saisei-server.com/update_image', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                      img: new_img,
                      mint: mint_addres,
                      })
                });

                const hint_text = document.getElementById('hint-text');
                hint_text!.innerText = `${i+1}/${valid_addresses.length} updates completed`
                await sleep(2000);
              }
            
            undim();
            showAlert('Success!','teal')
            hint_text!.innerText = `Validating inputs`;

            for (var i=0;i < addresses.length; i++){
              const field = forms[i];
              const imeg = imgs[i];
              field.value = ''
              imeg.src = './assets/base-invis.PNG';
            }

        }catch(e){
            console.log(e);
            //Handle the error
        }

    }
}

img_1.addEventListener("click", () => {
    // Trigger a click on the file input button to allow the user to select an image
    inp_1.click();
  });
  
  inp_1.addEventListener("change", (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0] as File;
  
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      // Set the src attribute of the image with the data URL
      img_1.src = event!.target!.result as string;
    };
    reader.readAsDataURL(file);
  });

  img_2.addEventListener("click", () => {
    // Trigger a click on the file input button to allow the user to select an image
    inp_2.click();
  });
  
  inp_2.addEventListener("change", (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0] as File;
  
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      // Set the src attribute of the image with the data URL
      img_2.src = event!.target!.result as string;
    };
    reader.readAsDataURL(file);
  });

  img_3.addEventListener("click", () => {
    // Trigger a click on the file input button to allow the user to select an image
    inp_3.click();
  });
  
  inp_3.addEventListener("change", (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0] as File;
  
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      // Set the src attribute of the image with the data URL
      img_3.src = event!.target!.result as string;
    };
    reader.readAsDataURL(file);
  });

  img_4.addEventListener("click", () => {
    // Trigger a click on the file input button to allow the user to select an image
    inp_4.click();
  });
  
  inp_4.addEventListener("change", (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0] as File;
  
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      // Set the src attribute of the image with the data URL
      img_4.src = event!.target!.result as string;
    };
    reader.readAsDataURL(file);
  });

  img_5.addEventListener("click", () => {
    // Trigger a click on the file input button to allow the user to select an image
    inp_5.click();
  });
  
  inp_5.addEventListener("change", (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0] as File;
  
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      // Set the src attribute of the image with the data URL
      img_5.src = event!.target!.result as string;
    };
    reader.readAsDataURL(file);
  });

  
//console.log(update_button,connect_button);
//console.log(img_1,img_2,img_3,img_4,img_5);
//console.log(inp_1,inp_2,inp_3,inp_4,inp_5);
//console.log(field_1,field_2,field_5);

update_button.addEventListener('click',update);
connect_button.addEventListener('click',connect);